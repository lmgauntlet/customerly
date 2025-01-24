'use client'

import { useParams } from 'next/navigation'
import { TicketDetails } from '@/components/tickets/TicketDetails'
import { useEffect, useState } from 'react'

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

export default function TicketPage() {
    const params = useParams()
    const [ticket, setTicket] = useState<Ticket>()

    useEffect(() => {
        // Mock data - replace with actual data fetching
        if (params.id === '1') {
            setTicket({
                id: params.id as string,
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
            })
        }
    }, [params.id])

    return <TicketDetails ticket={ticket} />
}