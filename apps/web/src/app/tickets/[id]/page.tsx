'use client'

import { useParams } from 'next/navigation'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState, type ChangeEvent } from 'react'

export default function TicketDetailsPage() {
    const params = useParams()
    const [replyText, setReplyText] = useState('')

    // Mock data - replace with actual data fetching
    const ticket = {
        id: params.id,
        title: 'Pod scheduling issues in production cluster',
        status: 'new',
        priority: 'urgent',
        requester: {
            name: 'John Smith',
            email: 'john@acmecorp.com'
        },
        created_at: '2024-01-15T14:30:00Z',
        source: 'email',
        description: 'We are experiencing issues with pod scheduling in our production Kubernetes cluster. The pods are stuck in pending state and not being assigned to any nodes.',
        messages: [
            {
                id: '1',
                content: 'Hi, we are having issues with pod scheduling in our production cluster. Can you help?',
                sender: {
                    name: 'John Smith',
                    email: 'john@acmecorp.com',
                    type: 'customer'
                },
                created_at: '2024-01-15T14:30:00Z'
            },
            {
                id: '2',
                content: 'I\'ll take a look at this right away. Can you provide the output of `kubectl describe pod` for one of the affected pods?',
                sender: {
                    name: 'Support Agent',
                    email: 'agent@customerly.com',
                    type: 'agent'
                },
                created_at: '2024-01-15T14:35:00Z'
            }
        ]
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
                        <StatusBadge status={ticket.status as any} />
                        <PriorityBadge priority={ticket.priority as any} />
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
                    {ticket.messages.map((message) => (
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