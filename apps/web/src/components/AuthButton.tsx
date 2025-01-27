import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'

export default async function AuthButton() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const signOut = async () => {
    'use server'
    const supabase = createServerClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return session ? (
    <form action={signOut}>
      <Button variant="ghost">Sign out</Button>
    </form>
  ) : (
    <Link href="/login">
      <Button variant="ghost">Sign in</Button>
    </Link>
  )
}
