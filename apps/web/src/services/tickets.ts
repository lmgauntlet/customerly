import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export interface Ticket {
    id: string
    title: string
    description: string
    status: 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    source: 'email' | 'web' | 'chat' | 'api' | 'phone'
    customer_id: string
    assigned_agent_id?: string
    team_id?: string
    sla_deadline?: string
    tags: string[]
    metadata: Record<string, unknown>
    created_at?: string
    updated_at?: string
    customer: {
        id: string
        name: string
        email: string
        avatarUrl?: string
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
            avatarUrl?: string
        }
    }
    messages?: TicketMessage[]
}

export interface TicketMessage {
    id: string
    ticket_id: string
    content: string
    sender_id: string
    is_internal: boolean
    attachments: string[]
    created_at?: string
    updated_at?: string
    sender?: {
        id: string
        name: string
        email: string
        avatarUrl: string
    }
}

export const ticketsService = {
    async createTicket(data: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
        const ticket: Ticket = {
            id: uuidv4(),
            ...data
        }

        const { data: createdTicket, error } = await supabase
            .from('tickets')
            .insert(ticket)
            .select(`
                *,
                customer:users!tickets_customer_id_fkey(id, name, email, avatarUrl:avatar_url),
                team:teams!tickets_team_id_fkey(id, name),
                assignedAgent:agents!tickets_assigned_agent_id_fkey(
                    id,
                    user:users!agents_user_id_fkey(
                        name,
                        email,
                        avatarUrl:avatar_url
                    )
                ),
                messages:ticket_messages(
                    *,
                    sender:users!ticket_messages_sender_id_fkey(
                        id, 
                        name, 
                        email, 
                        avatarUrl:avatar_url
                    )
                )
            `)
            .single()

        if (error) {
            throw error
        }

        return createdTicket
    },

    async addMessage(data: Omit<TicketMessage, 'id' | 'created_at' | 'updated_at' | 'sender'>): Promise<TicketMessage> {
        const message: Omit<TicketMessage, 'created_at' | 'updated_at' | 'sender'> = {
            id: uuidv4(),
            ...data
        }

        const { data: createdMessage, error } = await supabase
            .from('ticket_messages')
            .insert(message)
            .select(`
                *,
                sender:users!ticket_messages_sender_id_fkey(
                    id, 
                    name, 
                    email, 
                    avatarUrl:avatar_url
                )
            `)
            .single()

        if (error) {
            throw error
        }

        return createdMessage
    },

    async updateTicket(id: string, data: Partial<Omit<Ticket, 'id' | 'created_at' | 'updated_at'>>): Promise<Ticket> {
        const { data: updatedTicket, error } = await supabase
            .from('tickets')
            .update(data)
            .eq('id', id)
            .select(`
                *,
                customer:users!tickets_customer_id_fkey(id, name, email, avatarUrl:avatar_url),
                team:teams!tickets_team_id_fkey(id, name),
                assignedAgent:agents!tickets_assigned_agent_id_fkey(
                    id,
                    user:users!agents_user_id_fkey(
                        name,
                        email,
                        avatarUrl:avatar_url
                    )
                ),
                messages:ticket_messages(
                    *,
                    sender:users!ticket_messages_sender_id_fkey(id, name, email, avatarUrl:avatar_url)
                )
            `)
            .single()

        if (error) {
            throw error
        }

        return updatedTicket
    },

    async getTicket(id: string): Promise<Ticket> {
        const { data: ticket, error } = await supabase
            .from('tickets')
            .select(`
                *,
                customer:users!tickets_customer_id_fkey(id, name, email, avatarUrl:avatar_url),
                team:teams!tickets_team_id_fkey(id, name),
                assignedAgent:agents!tickets_assigned_agent_id_fkey(
                    id,
                    user:users!agents_user_id_fkey(
                        name,
                        email,
                        avatarUrl:avatar_url
                    )
                ),
                messages:ticket_messages(
                    *,
                    sender:users!ticket_messages_sender_id_fkey(id, name, email, avatarUrl:avatar_url)
                )
            `)
            .eq('id', id)
            .single()

        if (error) {
            throw error
        }

        return ticket
    },

    async getTickets(): Promise<Ticket[]> {
        const { data: tickets, error } = await supabase
            .from('tickets')
            .select(`
                *,
                customer:users!tickets_customer_id_fkey(id, name, email, avatarUrl:avatar_url),
                team:teams!tickets_team_id_fkey(id, name),
                assignedAgent:agents!tickets_assigned_agent_id_fkey(
                    id,
                    user:users!agents_user_id_fkey(
                        name,
                        email,
                        avatarUrl:avatar_url
                    )
                ),
                messages:ticket_messages(
                    *,
                    sender:users!ticket_messages_sender_id_fkey(id, name, email, avatarUrl:avatar_url)
                )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return tickets
    },

    subscribeToTickets(callback: (ticket: Ticket) => void) {
        return supabase
            .channel('tickets')
            .on(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table: 'tickets',
                },
                async (payload: { new: { id: string } }) => {
                    // Fetch the complete ticket data when there's a change
                    const ticket = await this.getTicket(payload.new.id)
                    callback(ticket)
                }
            )
            .subscribe()
    },

    subscribeToMessages(ticketId: string, callback: (message: TicketMessage) => void) {
        return supabase
            .channel(`messages:${ticketId}`)
            .on(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table: 'ticket_messages',
                    filter: `ticket_id=eq.${ticketId}`
                },
                async (payload: { new: { id: string, ticket_id: string } }) => {
                    // Fetch the complete message data when there's a change
                    const { data: message, error } = await supabase
                        .from('ticket_messages')
                        .select(`
                            *,
                            sender:users!ticket_messages_sender_id_fkey(
                                id, 
                                name, 
                                email, 
                                avatarUrl:avatar_url
                            )
                        `)
                        .eq('id', payload.new.id)
                        .single()

                    if (!error && message) {
                        callback(message)
                    }
                }
            )
            .subscribe()
    }
}
