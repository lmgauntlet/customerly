import { createBrowserClient } from '@/utils/supabase'

export interface Ticket {
    id: string
    title: string
    description: string
    status: 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    source: 'email' | 'web' | 'chat' | 'api' | 'phone'
    customer_id: string
    team_id?: string
    assigned_agent_id?: string
    sla_deadline?: string
    first_response_at?: string
    resolved_at?: string
    tags: string[]
    metadata?: Record<string, any>
    created_at: string
    updated_at: string
    customer: {
        id: string
        name: string
        email: string
        avatar_url?: string
    }
    team?: {
        id: string
        name: string
    }
    assignedAgent?: {
        id: string
        user: {
            name: string
            email: string
            avatar_url?: string
        }
    }
    messages?: TicketMessage[]
}

export interface TicketMessage {
    id: string
    ticket_id: string
    sender_id: string
    content: string
    is_internal: boolean
    attachments: string[]
    created_at: string
    updated_at: string
    sender: {
        id: string
        name: string
        email: string
        avatar_url?: string
    }
}

export const ticketsService = {
    async getTickets() {
        const supabase = createBrowserClient()
        const { data: tickets, error } = await supabase
            .from('tickets')
            .select(`
                *,
                customer:users!tickets_customer_id_fkey(id, name, email, avatar_url),
                team:teams!tickets_team_id_fkey(id, name),
                assignedAgent:agents!tickets_assigned_agent_id_fkey(
                    id,
                    user:users!agents_user_id_fkey(
                        name,
                        email,
                        avatar_url
                    )
                ),
                messages:ticket_messages(
                    *,
                    sender:users!ticket_messages_sender_id_fkey(id, name, email, avatar_url)
                )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return tickets as Ticket[]
    },

    async getTicketById(id: string) {
        const supabase = createBrowserClient()
        const { data: ticket, error } = await supabase
            .from('tickets')
            .select(`
                *,
                customer:users!tickets_customer_id_fkey(id, name, email, avatar_url),
                team:teams!tickets_team_id_fkey(id, name),
                assignedAgent:agents!tickets_assigned_agent_id_fkey(
                    id,
                    user:users!agents_user_id_fkey(
                        name,
                        email,
                        avatar_url
                    )
                ),
                messages:ticket_messages(
                    *,
                    sender:users!ticket_messages_sender_id_fkey(id, name, email, avatar_url)
                )
            `)
            .eq('id', id)
            .single()

        if (error) {
            throw error
        }

        return ticket as Ticket
    },

    async createTicket(ticket: Partial<Ticket>) {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
            .from('tickets')
            .insert([ticket])
            .select()

        if (error) {
            throw error
        }

        return data[0] as Ticket
    },

    async updateTicket(id: string, updates: Partial<Ticket>) {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
            .from('tickets')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) {
            throw error
        }

        return data[0] as Ticket
    },

    async addMessage(message: Partial<TicketMessage>) {
        const supabase = createBrowserClient()

        // Generate a unique ID for the message
        const { data: maxId } = await supabase
            .from('ticket_messages')
            .select('id')
            .order('created_at', { ascending: false })
            .limit(1)

        // Extract the numeric part and increment
        const lastNum = maxId?.[0]?.id ? parseInt(maxId[0].id.split('_')[1]) : 0
        const newNum = (lastNum + 1).toString().padStart(3, '0')
        const newId = `tm_${newNum}`

        const { data, error } = await supabase
            .from('ticket_messages')
            .insert([{ ...message, id: newId }])
            .select(`
                *,
                sender:users!ticket_messages_sender_id_fkey(id, name, email, avatar_url)
            `)

        if (error) {
            throw error
        }

        return data[0] as TicketMessage
    },

    subscribeToTickets(callback: (ticket: Ticket) => void) {
        const supabase = createBrowserClient()

        return supabase
            .channel('tickets')
            .on<{ id: string }>(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table: 'tickets',
                },
                async (payload: { new: { id: string } }) => {
                    // Fetch the complete ticket data when there's a change
                    const ticket = await this.getTicketById(payload.new.id)
                    callback(ticket)
                }
            )
            .subscribe()
    }
}
