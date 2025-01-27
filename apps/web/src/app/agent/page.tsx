import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import type { Ticket } from '@/types/tickets'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'

export default async function AgentDashboard() {
  const cookieStore = cookies()
  const supabase = createServerClient()

  // Get session and user data
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/')
  }

  // Get user role and verify it's an agent/admin
  const role = session.user?.user_metadata?.role
  if (role !== 'agent' && role !== 'admin') {
    redirect('/')
  }

  // Fetch tickets assigned to this agent
  const { data: tickets } = await supabase
    .from('tickets')
    .select(
      `
            id,
            title,
            description,
            status,
            priority,
            source,
            sla_deadline,
            first_response_at,
            resolved_at,
            tags,
            created_at,
            customer:customer_id (
                email,
                name
            ),
            team:team_id (
                name
            )
        `,
    )
    .eq('assigned_agent_id', session.user.id)
    .order('created_at', { ascending: false })
    .returns<Ticket[]>()

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Agent Dashboard</h1>

      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">My Tickets</h2>
        <div className="flex items-center gap-4">
          {/* Add filters here later */}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Team</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Priority</th>
              <th className="p-4 font-medium">Source</th>
              <th className="p-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets?.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-muted/50">
                <td className="p-4">{ticket.id}</td>
                <td className="p-4">{ticket.title}</td>
                <td className="p-4">
                  {ticket.customer?.name || ticket.customer?.email}
                </td>
                <td className="p-4">{ticket.team?.name || 'Unassigned'}</td>
                <td className="p-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="p-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="p-4">
                  <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium">
                    {ticket.source}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!tickets?.length && (
              <tr>
                <td
                  colSpan={8}
                  className="p-4 text-center text-muted-foreground"
                >
                  No tickets assigned to you yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
