import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { type Ticket, ticketsService } from '@/services/tickets'

interface Props {
    ticket?: Ticket
}

export function TicketDetails({ ticket }: Props) {
    const [replyContent, setReplyContent] = useState('')
    const [sending, setSending] = useState(false)

    if (!ticket) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a ticket to view details
            </div>
        )
    }

    const handleSendReply = async () => {
        if (!replyContent.trim()) return

        try {
            setSending(true)
            await ticketsService.addMessage({
                ticket_id: ticket.id,
                content: replyContent,
                is_internal: false,
                attachments: []
            })
            setReplyContent('')
        } catch (error) {
            console.error('Failed to send reply:', error)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Ticket Header */}
            <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-semibold mb-2">{ticket.title}</h1>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <StatusBadge status={ticket.status} />
                            <PriorityBadge priority={ticket.priority} />
                            <span>#{ticket.id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                    <div>
                        <div className="text-sm font-medium">Customer</div>
                        <div className="text-sm text-muted-foreground">
                            {ticket.customer.name} ({ticket.customer.email})
                        </div>
                    </div>

                    {ticket.assignedAgent && (
                        <div>
                            <div className="text-sm font-medium">Assigned Agent</div>
                            <div className="text-sm text-muted-foreground">
                                {ticket.assignedAgent.user.name}
                            </div>
                        </div>
                    )}

                    {ticket.team && (
                        <div>
                            <div className="text-sm font-medium">Team</div>
                            <div className="text-sm text-muted-foreground">
                                {ticket.team.name}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                    {/* Initial Description */}
                    <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex-shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{ticket.customer.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(ticket.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                {ticket.description}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {ticket.messages?.map((message) => (
                        <div key={message.id} className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{message.sender.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(message.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <div className="prose prose-sm max-w-none">
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t border-border">
                <Textarea
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="mb-4"
                    rows={4}
                />
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={handleSendReply}
                        disabled={!replyContent.trim() || sending}
                    >
                        {sending ? 'Sending...' : 'Send Reply'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
