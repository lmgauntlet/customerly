'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

export default function TicketsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [selectedView, setSelectedView] = useState('unresolved')
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Left Panel - Navigation and Views */}
            <div className="w-64 border-r border-border bg-card">
                {/* Main Navigation */}
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Customerly
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                </div>

                {/* Views Panel */}
                <nav className="p-4">
                    <h2 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">VIEWS</h2>
                    <div className="space-y-1">
                        <button
                            onClick={() => setSelectedView('unresolved')}
                            className={`w-full rounded-md px-4 py-2 text-sm font-medium ${selectedView === 'unresolved'
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-accent'
                                }`}
                        >
                            Your unresolved tickets
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                1
                            </span>
                        </button>
                        <button
                            onClick={() => setSelectedView('unassigned')}
                            className={`w-full rounded-md px-4 py-2 text-sm font-medium ${selectedView === 'unassigned'
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-accent'
                                }`}
                        >
                            Unassigned tickets
                            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                0
                            </span>
                        </button>
                    </div>

                    {/* Channel Status */}
                    <h2 className="mb-2 mt-8 px-4 text-sm font-semibold text-muted-foreground">
                        CHANNEL STATUS
                    </h2>
                    <div className="space-y-1">
                        <div className="flex items-center px-4 py-2">
                            <div className="flex h-4 w-4 items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">Email</span>
                        </div>
                        <div className="flex items-center px-4 py-2">
                            <div className="flex h-4 w-4 items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">Chat</span>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Middle Panel - Ticket List */}
            <div className="flex flex-1 flex-col border-r border-border">
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                    <h1 className="text-lg font-semibold">Your unresolved tickets</h1>
                    <div className="flex items-center space-x-2">
                        {/* Add search and filter controls here */}
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </div>

            {/* Right Panel - Conversation and Details */}
            <div className="w-96 bg-card">
                <div className="flex h-16 items-center border-b border-border px-6">
                    <h2 className="text-lg font-semibold">Ticket Details</h2>
                </div>
                <div className="p-6">
                    {/* Ticket details will be rendered here */}
                </div>
            </div>
        </div>
    )
} 