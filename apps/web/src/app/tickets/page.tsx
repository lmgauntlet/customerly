'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { ChannelIcon } from '@/components/tickets/ChannelIcon'
import { Avatar } from '@/components/ui/avatar'
import { TicketDetails } from '@/components/tickets/TicketDetails'
import { type Ticket, ticketsService } from '@/services/tickets'

export default function TicketsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load initial tickets
        loadTickets()

        // Subscribe to ticket updates
        const channel = ticketsService.subscribeToTickets((updatedTicket) => {
            setTickets(currentTickets => {
                const index = currentTickets.findIndex(t => t.id === updatedTicket.id)
                if (index === -1) {
                    return [updatedTicket, ...currentTickets]
                }
                const newTickets = [...currentTickets]
                newTickets[index] = updatedTicket
                return newTickets
            })

            // Update selected ticket if it was updated
            if (selectedTicket?.id === updatedTicket.id) {
                setSelectedTicket(updatedTicket)
            }
        })

        return () => {
            channel.unsubscribe()
        }
    }, [selectedTicket?.id])

    const loadTickets = async () => {
        try {
            setLoading(true)
            const data = await ticketsService.getTickets()
            setTickets(data)
        } catch (error) {
            console.error('Failed to load tickets:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        if (!searchQuery) return true
        const searchLower = searchQuery.toLowerCase()
        return (
            ticket.title.toLowerCase().includes(searchLower) ||
            ticket.description.toLowerCase().includes(searchLower) ||
            ticket.customer.name.toLowerCase().includes(searchLower) ||
            ticket.customer.email.toLowerCase().includes(searchLower)
        )
    })

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
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {filteredTickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`w-full flex items-start p-4 hover:bg-accent/50 text-left ${selectedTicket?.id === ticket.id ? 'bg-accent' : ''}`}
                                >
                                    {/* Channel Icon */}
                                    <div className="mr-4 mt-1">
                                        <ChannelIcon channel={ticket.metadata?.channel as string || 'web'} />
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
                                            {ticket.assignedAgent && (
                                                <div className="flex items-center gap-1.5 text-xs bg-muted px-2 py-0.5 rounded-full">
                                                    <Avatar
                                                        name={ticket.assignedAgent.user.name}
                                                        email={ticket.assignedAgent.user.email}
                                                        avatarUrl={ticket.assignedAgent.user.avatar_url}
                                                        size="sm"
                                                    />
                                                    {ticket.assignedAgent.user.name}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {ticket.messages?.[0]?.content || ticket.description}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
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