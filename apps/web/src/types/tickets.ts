export type TicketStatus = 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'urgent' | 'high' | 'medium' | 'low'
export type TicketSource = 'email' | 'web' | 'chat' | 'api' | 'phone'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  source: TicketSource
  customerId: string
  teamId?: string
  assignedAgentId?: string
  slaDeadline?: string
  firstResponseAt?: string
  resolvedAt?: string
  tags: string[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
  customer_id: string
  assigned_agent_id?: string
  team_id?: string
  assigned_agent?: {
    user: {
      name: string
      email: string
      avatar_url?: string
    }
  }

  // Relations (optional as they may not be included in every query)
  customer?: {
    id: string
    email: string
    name?: string
    avatar_url?: string
    organization?: string
  }
  team?: {
    name: string
  }
  assignedAgent?: {
    user: {
      email: string
      name?: string
      avatar_url?: string
    }
  }
  messages?: TicketMessage[]
  attachments?: Attachment[]
}

export interface TicketMessage {
  id: string
  ticketId: string
  senderId: string
  content: string
  isInternal: boolean
  attachments: string[]
  created_at: string
  updated_at: string

  // Relations
  sender?: {
    email: string
    name?: string
  }
}

export interface Attachment {
  id: string
  filename: string
  contentType: string
  size: number
  url: string
}
