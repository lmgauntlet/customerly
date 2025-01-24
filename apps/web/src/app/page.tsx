'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        router.push('/tickets')
      }
      setLoading(false)

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }
    getSession()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    router.refresh()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  console.log('Rendering with session:', session?.user?.email) // Debug log

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Customerly</span>
            </Link>
            <nav className="flex items-center">
              {session?.user ? (
                <Button
                  variant="ghost"
                  className="mr-6"
                  onClick={handleSignOut}
                >
                  Sign Out ({session.user.email})
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" className="mr-6">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
        <div className="bg-grid-pattern absolute inset-0 opacity-5" />
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Customer Support{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                That Scales
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              24/7 expert support for your business. Our specialized teams ensure your customers are always taken care of.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="w-full rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 sm:w-auto"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Specialized Support Teams
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Technical Support */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Technical Support</h3>
              <p className="mb-4 text-muted-foreground">
                Expert assistance with APIs, Kubernetes, infrastructure, and
                performance optimization. 24/7 coverage across APAC, EMEA, and
                AMER time zones.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  API
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Kubernetes
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Performance
                </span>
              </div>
            </div>

            {/* Security Team */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Security Team</h3>
              <p className="mb-4 text-muted-foreground">
                Dedicated security and compliance support. Enterprise SSO
                integration, security audits, and compliance documentation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  SSO
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Compliance
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Security
                </span>
              </div>
            </div>

            {/* Billing Support */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Billing Support</h3>
              <p className="mb-4 text-muted-foreground">
                Handle subscription changes, enterprise billing, and custom
                pricing. Dedicated team for all your billing and contract needs.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Enterprise
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Billing
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  Contracts
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-card p-6 text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Global Coverage
              </div>
            </div>
            <div className="rounded-lg bg-card p-6 text-center">
              <div className="text-3xl font-bold text-primary">15min</div>
              <div className="mt-2 text-sm text-muted-foreground">
                First Response
              </div>
            </div>
            <div className="rounded-lg bg-card p-6 text-center">
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Specialized Teams
              </div>
            </div>
            <div className="rounded-lg bg-card p-6 text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="mt-2 text-sm text-muted-foreground">
                SLA Compliance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <span className="text-sm text-muted-foreground">
                All Support Teams Available
              </span>
            </div>
            <Link
              href="/status"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View Coverage Hours →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
