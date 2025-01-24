'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { getCurrentDbUser, type DbUser } from '@/lib/auth'

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
    count?: number
}

const mainNavItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
        )
    },
    {
        label: 'Inbox',
        href: '/tickets',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
        )
    },
    {
        label: 'Customers',
        href: '/customers',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
    {
        label: 'Settings',
        href: '/settings',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    }
]

const ticketViews = [
    { label: 'All Tickets', count: 24 },
    { label: 'Assigned to me', count: 12 },
    { label: 'Unassigned', count: 8 },
    { label: 'Due today', count: 3 },
    { label: 'High priority', count: 5 }
]

export default function TicketsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [selectedView, setSelectedView] = useState('All')
    const [currentUser, setCurrentUser] = useState<DbUser | null>(null)
    const router = useRouter()

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getCurrentDbUser()
                setCurrentUser(user)
            } catch (error) {
                console.error('Failed to load user:', error)
                router.push('/login')
            }
        }
        loadUser()

        // Subscribe to auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/login')
            } else if (event === 'SIGNED_IN' && session) {
                try {
                    const user = await getCurrentDbUser()
                    setCurrentUser(user)
                } catch (error) {
                    console.error('Failed to load user:', error)
                    router.push('/login')
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <div className="fixed inset-0 flex bg-background">
            {/* Main Left Panel - Primary Navigation */}
            <div className="w-[240px] flex flex-col border-r border-border bg-card">
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

                {/* Main Navigation Items */}
                <nav className="space-y-1 p-4">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                                item.href === '/tickets'
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User Profile Section */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3">
                        <Avatar
                            name={currentUser?.name ?? currentUser?.email ?? ''}
                            email={currentUser?.email ?? ''}
                            avatarUrl={currentUser?.avatarUrl ?? undefined}
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{currentUser?.name ?? currentUser?.email}</p>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Left Panel - Ticket Views */}
            <div className="w-[240px] flex flex-col border-r border-border bg-card/50">
                <div className="flex h-16 items-center px-6 border-b border-border">
                    <h2 className="text-lg font-semibold">Views</h2>
                </div>
                <nav className="p-4">
                    <div className="space-y-1">
                        {ticketViews.map((view) => (
                            <button
                                key={view.label}
                                onClick={() => setSelectedView(view.label)}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium",
                                    selectedView === view.label
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent"
                                )}
                            >
                                <span>{view.label}</span>
                                <span className={cn(
                                    "rounded-full px-2 py-0.5 text-xs",
                                    selectedView === view.label
                                        ? "bg-primary/20"
                                        : "bg-muted"
                                )}>
                                    {view.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}