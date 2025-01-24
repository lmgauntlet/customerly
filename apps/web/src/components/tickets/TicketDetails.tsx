import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "./StatusBadge"
import { PriorityBadge } from "./PriorityBadge"
import { useState } from "react"

interface Sender {
    name: string
    email: string
    type: 'customer' | 'agent'
}

interface Message {
    id: string
    content: string
    sender: Sender
    created_at: string
}

interface Ticket {
    id: string
    title: string
    status: 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    requester: {
        name: string
        email: string
        company?: string
    }
    created_at: string
    source: 'email' | 'web' | 'chat' | 'api' | 'phone'
    messages?: Message[]
}

interface TicketDetailsProps {
    ticket: Ticket | null
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
    const [replyText, setReplyText] = useState('')

    if (!ticket) {
        return (
            <div className="w-[600px] bg-card border-l border-border">
                <div className="flex h-16 items-center border-b border-border px-6">
                    <h2 className="text-lg font-semibold">Ticket Details</h2>
                </div>
                <div className="p-6">
                    <div className="text-sm text-muted-foreground">
                        Select a ticket to view details
                    </div>
                </div>
            </div>
        )
    }

    const handleReply = () => {
        // Handle reply submission
        console.log('Submitting reply:', replyText)
        setReplyText('')
    }

    return (
        <div className="w-[600px] flex flex-col bg-card border-l border-border">
            {/* Ticket Header */}
            <div className="flex flex-col gap-4 border-b border-border p-6">
                <div className="flex items-start justify-between">
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

            {/* Customer Info */}
            <div className="border-b border-border p-6">
                <h2 className="text-sm font-semibold mb-4">Customer Info</h2>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                        {ticket.requester.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-medium">{ticket.requester.name}</div>
                        <div className="text-sm text-muted-foreground">{ticket.requester.email}</div>
                        {ticket.requester.company && (
                            <div className="text-sm text-muted-foreground">{ticket.requester.company}</div>
                        )}
                    </div>
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
                                    ? 'bg-primary/10 text-primary-foreground'
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
                    onChange={(e) => setReplyText(e.target.value)}
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