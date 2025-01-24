'use client'

import { useEffect, useState, useCallback } from 'react'
import { type Ticket, ticketsService } from '@/services/tickets'
import { TicketDetails } from '@/components/tickets/TicketDetails'
import { useParams } from 'next/navigation'

export default function TicketPage() {
    const params = useParams()
    const [ticket, setTicket] = useState<Ticket>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadTicket = async () => {
            try {
                setLoading(true)
                // Ensure params.id is a string
                const ticketId = Array.isArray(params.id) ? params.id[0] : params.id
                const data = await ticketsService.getTicket(ticketId)
                setTicket(data)
            } catch (error) {
                console.error('Failed to load ticket:', error)
                setError('Failed to load ticket')
            } finally {
                setLoading(false)
            }
        }
        loadTicket()

        // Subscribe to ticket updates
        const channel = ticketsService.subscribeToTickets((updatedTicket) => {
            if (updatedTicket.id === params.id) {
                setTicket(updatedTicket)
            }
        })

        return () => {
            channel.unsubscribe()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return <div>{error}</div>
    }

    if (!ticket) {
        return <div>Ticket not found</div>
    }

    return <TicketDetails ticket={ticket} />
}