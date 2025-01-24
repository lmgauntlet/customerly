'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { TicketDetails } from '@/components/tickets/TicketDetails'

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
    lastMessage?: string
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

export default function TicketsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>()

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
            source: 'email',
            lastMessage: 'The pods are not scheduling correctly in the production environment...',
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
            source: 'web',
            lastMessage: 'We need to review the network policies as they are not being applied...',
            messages: [
                {
                    id: '1',
                    content: 'Network policies are not being applied correctly in our cluster.',
                    sender: {
                        name: 'Sarah Connor',
                        email: 'sarah@skynet.com',
                        type: 'customer'
                    },
                    created_at: '2024-01-15T12:15:00Z'
                }
            ]
        }
    ]

    return (
        <div className="h-full flex">
            {/* Left Panel - Tickets List */}
            <div className="w-1/2 flex flex-col border-r border-border">
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                    <h1 className="text-lg font-semibold">Inbox</h1>
                </div>
                <div className="p-4 border-b border-border">
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
                </div>

                {/* Tickets List */}
                <div className="overflow-auto flex-1">
                    <div className="divide-y divide-border">
                        {tickets.map((ticket) => (
                            <button
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`w-full flex items-start p-4 hover:bg-accent/50 text-left ${selectedTicket?.id === ticket.id ? 'bg-accent' : ''}`}
                            >
                                {/* Source Icon */}
                                <div className="mr-4 mt-1">
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
                                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                            />
                                        </svg>
                                    )}
                                </div>

                                {/* Ticket Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-medium truncate">{ticket.title}</h3>
                                        <span className="text-xs text-muted-foreground ml-2">
                                            {new Date(ticket.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <StatusBadge status={ticket.status} />
                                        <PriorityBadge priority={ticket.priority} />
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {ticket.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Ticket Details */}
            <div className="w-1/2 flex flex-col">
                <div className="flex h-16 items-center border-b border-border px-6">
                    <h2 className="text-lg font-semibold">Ticket Details</h2>
                </div>
                <div className="overflow-auto flex-1">
                    <TicketDetails ticket={selectedTicket} />
                </div>
            </div>
        </div>
    )
}