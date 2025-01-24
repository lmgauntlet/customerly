import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState, type ChangeEvent } from 'react'

interface Ticket {
    id: string
    title: string
    status: 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    requester: {
        name: string
        email: string
    }
    created_at: string
    source: string
    description?: string
    messages?: Array<{
        id: string
        content: string
        sender: {
            name: string
            email: string
            type: 'customer' | 'agent'
        }
        created_at: string
    }>
}

interface TicketDetailsProps {
    ticket?: Ticket
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
    const [replyText, setReplyText] = useState('')

    if (!ticket) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <h2 className="text-xl font-semibold mb-2">Ticket Details</h2>
                <p className="text-muted-foreground">Select a ticket to view details</p>
            </div>
        )
    }

    const handleReply = () => {
        // Handle reply submission
        console.log('Submitting reply:', replyText)
        setReplyText('')
    }

    return (
        <div className="flex flex-col h-full">
            {/* Ticket Header */}
            <div className="border-b border-border p-6">
                <div className="flex items-start justify-between mb-4">
                    <h1 className="text-xl font-semibold">{ticket.title}</h1>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>From: {ticket.requester.name}</span>
                    <span>•</span>
                    <span>{new Date(ticket.created_at).toLocaleString()}</span>
                    <span>•</span>
                    <span>Ticket #{ticket.id}</span>
                </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                    {ticket.messages?.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender.type === 'agent' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-2xl rounded-lg p-4 ${message.sender.type === 'agent'
                                ? 'bg-blue-100 dark:bg-blue-900/30'
                                : 'bg-muted'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">{message.sender.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(message.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reply Box */}
            <div className="border-t border-border p-4">
                <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                    className="mb-4"
                    rows={4}
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleReply}>Send Reply</Button>
                </div>
            </div>
        </div>
    )
}
