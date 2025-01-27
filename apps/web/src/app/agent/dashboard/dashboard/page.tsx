import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Fetch tickets for the current user
  const { data: tickets } = await supabase
    .from('tickets')
    .select(
      `
            *,
            assigned_agent:agents(
                user:users(name, email)
            )
        `,
    )
    .order('created_at', { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-4">
          <Link href="/" className="text-xl font-bold text-primary">
            Customerly
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/tickets"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Tickets
          </Link>
          <Link
            href="/customers"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Customers
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
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
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-8">
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search tickets..."
              className="w-[300px]"
            />
          </div>
          <Button>+ New Ticket</Button>
        </div>

        {/* Tickets List */}
        <div className="p-8">
          <h1 className="mb-6 text-2xl font-bold">All Tickets</h1>
          <div className="space-y-4">
            {tickets?.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="font-medium">{ticket.title}</h3>
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ticket.description}
                  </p>
                </div>
                <div className="ml-4 text-right text-sm text-muted-foreground">
                  <div>{new Date(ticket.created_at).toLocaleDateString()}</div>
                  <div>{ticket.assigned_agent?.user?.name || 'Unassigned'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
