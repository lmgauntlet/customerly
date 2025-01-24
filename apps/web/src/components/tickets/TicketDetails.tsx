'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { Avatar } from '@/components/ui/avatar'
import { type Ticket, ticketsService } from '@/services/tickets'
import { cn } from '@/lib/utils'

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
        <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full">
                {/* Header */}
                <div className="border-b p-4">
                    <h1 className="text-2xl font-semibold mb-2">{ticket.title}</h1>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>

                {/* Message Thread */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Initial Description */}
                        <div className="flex gap-4">
                            <Avatar
                                name={ticket.customer.name}
                                email={ticket.customer.email}
                                avatarUrl={ticket.customer.avatar_url}
                                size="md"
                            />
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
                        <div className="space-y-6">
                            {ticket.messages?.map((message) => (
                                <div 
                                    key={message.id} 
                                    className={cn(
                                        "flex gap-4",
                                        message.is_internal ? "bg-[#FFF9E7] rounded-lg p-4" : ""
                                    )}
                                >
                                    <Avatar
                                        name={message.sender?.name || 'User'}
                                        email={message.sender?.email || ''}
                                        avatarUrl={message.sender?.avatar_url}
                                        size="md"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "font-medium",
                                                message.is_internal ? "text-[#8B5D23]" : ""
                                            )}>
                                                {message.sender?.name || message.sender?.email}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(message.created_at).toLocaleString()}
                                            </span>
                                            {message.is_internal && (
                                                <span className="text-xs text-[#8B5D23]">
                                                    • Internal Note
                                                </span>
                                            )}
                                        </div>
                                        <div className={cn(
                                            "prose prose-sm max-w-none",
                                            message.is_internal ? "text-[#8B5D23]" : ""
                                        )}>
                                            {message.content}
                                        </div>
                                    </div>
                                    {message.is_internal && (
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-[#8B5D23]" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7.5v9M12 7.5v9M16 7.5v9M3 10.5h18M3 14.5h18"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
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

            {/* Customer and Ticket Details Sidebar */}
            <div className="w-72 border-l bg-muted/10 h-full overflow-y-auto">
                <div className="p-6 space-y-8">
                    {/* Customer Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Customer Info</h3>
                        <div className="flex flex-col items-center mb-4">
                            <Avatar
                                name={ticket.customer?.name || 'Customer'}
                                email={ticket.customer?.email || ''}
                                avatarUrl={ticket.customer?.avatar_url}
                                size="lg"
                            />
                            <h4 className="font-medium mt-2">{ticket.customer?.name}</h4>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{ticket.customer?.email}</span>
                            </div>
                            {ticket.customer?.organization && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>{ticket.customer?.organization}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div>
                        <h3 className="font-semibold mb-4">Ticket Details</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <div className="flex flex-wrap gap-1.5">
                                    {ticket.tags?.length ? (
                                        ticket.tags.map((tag) => (
                                            <a
                                                key={tag}
                                                href={`/tickets?tag=${tag}`}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-sm font-medium"
                                            >
                                                #{tag}
                                            </a>
                                        ))
                                    ) : (
                                        <span>No tags</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{new Date(ticket.created_at).toLocaleString()}</span>
                            </div>
                            {ticket.sla_deadline && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>SLA: {new Date(ticket.sla_deadline).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <PriorityBadge priority={ticket.priority} />
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={ticket.status} />
                            </div>
                        </div>
                    </div>

                    {/* Additional Metadata */}
                    {ticket.metadata && Object.keys(ticket.metadata).length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-4">Additional Details</h3>
                            <div className="space-y-2">
                                {Object.entries(ticket.metadata).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                        <span className="font-medium text-foreground">{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
