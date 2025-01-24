'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'

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
    source: 'email' | 'web' | 'chat' | 'api' | 'phone'
}

export default function TicketsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    // Mock data - replace with actual data fetching
    const tickets: Ticket[] = [
        {
            id: '1',
            title: 'Pod scheduling issues in production cluster',
            status: 'new',
            priority: 'urgent',
            requester: {
                name: 'John Smith',
                email: 'john@acmecorp.com'
            },
            created_at: '2024-01-15T14:30:00Z',
            source: 'email'
        },
        {
            id: '2',
            title: 'Network policy configuration not working',
            status: 'in_progress',
            priority: 'high',
            requester: {
                name: 'Sarah Connor',
                email: 'sarah@skynet.com'
            },
            created_at: '2024-01-15T12:15:00Z',
            source: 'web'
        }
    ]

    return (
        <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10"
                    />
                    <svg
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <Button variant="outline">Filter</Button>
            </div>

            {/* Tickets List */}
            <div className="rounded-lg border border-border">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="flex items-center border-b border-border p-4 last:border-0 hover:bg-accent/50"
                    >
                        {/* Source Icon */}
                        <div className="mr-4">
                            {ticket.source === 'email' ? (
                                <svg
                                    className="h-5 w-5 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-5 w-5 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                                    />
                                </svg>
                            )}
                        </div>

                        {/* Ticket Info */}
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{ticket.title}</h3>
                                <div className="flex items-center space-x-2">
                                    <StatusBadge status={ticket.status} />
                                    <PriorityBadge priority={ticket.priority} />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{ticket.requester.name}</span>
                                <span>•</span>
                                <span>{new Date(ticket.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 