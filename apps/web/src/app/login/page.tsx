'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createUserRecord } from './actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function authenticate() {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        console.log('Auth user:', authUser)
        if (error) {
          console.error('Error during sign-in:', error)
          throw error
        }

        if (authUser) {
          setSession(authUser)
          router.push('/')
        }
      } catch (error) {
        console.error('Authentication error:', error)
      }
    }
    authenticate()
  }, [supabase, router, email, password])

  console.log('Rendering with session:', session)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Auth user:', authUser)
      if (error) {
        console.error('Error during sign-in:', error)
        throw error
      }

      // Get or create the database user
      if (authUser) {
        const result = await createUserRecord(authUser.id, authUser.email!)
        if (!result.success) {
          throw new Error(result.error || 'Failed to get or create user record')
        }
      }

      router.refresh()
      router.push('/tickets')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user: authUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) throw error

      // Create user record in our database
      if (authUser) {
        const result = await createUserRecord(authUser.id, authUser.email!)
        if (!result.success) {
          throw new Error(result.error || 'Failed to create user record')
        }
      }

      setError('Check your email to continue sign in process')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Already Signed In
            </h1>
            <p className="text-sm text-muted-foreground">
              You are already signed in. You can return home or sign out.
            </p>
          </div>
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full">Return Home</Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-between">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Link>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant={error.includes('Check your email') ? 'default' : 'destructive'}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSignUp}
              disabled={loading}
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
