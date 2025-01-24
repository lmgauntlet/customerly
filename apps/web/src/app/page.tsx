'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PriorityBadge } from '@/components/ui/priority-badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Avatar } from '@/components/ui/avatar'

export default function LandingPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [ticketForm, setTicketForm] = useState({
    email: '',
    subject: '',
    description: ''
  })
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

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement ticket submission
    console.log('Submitting ticket:', ticketForm)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Customerly</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/tickets">
                <Button variant="ghost">View Tickets</Button>
              </Link>
              {session?.user ? (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                >
                  Sign Out ({session.user.email})
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Quick Ticket Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <CardDescription>We'll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Describe your issue..."
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Request</Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Updates & Quick Links */}
            <div className="space-y-8">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>All systems operational</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>API</span>
                      <StatusBadge status="open" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Web Dashboard</span>
                      <StatusBadge status="open" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <StatusBadge status="open" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                  <CardDescription>Popular help articles and resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/docs/getting-started" className="block text-sm text-muted-foreground hover:text-primary">
                      → Getting Started Guide
                    </Link>
                    <Link href="/docs/api" className="block text-sm text-muted-foreground hover:text-primary">
                      → API Documentation
                    </Link>
                    <Link href="/docs/faq" className="block text-sm text-muted-foreground hover:text-primary">
                      → Frequently Asked Questions
                    </Link>
                    <Link href="/docs/integrations" className="block text-sm text-muted-foreground hover:text-primary">
                      → Integration Guides
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Recent Public Tickets</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">API Rate Limiting Issue</CardTitle>
                      <PriorityBadge priority="medium" />
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Avatar name="John Doe" />
                      <span>2 hours ago</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Having issues with API rate limits. Getting 429 errors frequently...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
