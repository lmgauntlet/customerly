'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { Avatar } from '@/components/ui/avatar'
import { type Ticket, type TicketMessage, ticketsService } from '@/services/tickets'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@/lib/supabase'
import { getUser } from '@/lib/auth'
import { Loader2, X } from 'lucide-react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'

// Initialize Supabase client
const supabase = createBrowserClient()

interface Props {
    ticket?: Ticket
}

export function TicketDetails({ ticket }: Props) {
    const [replyContent, setReplyContent] = useState('')
    const [sending, setSending] = useState(false)
    const [isInternalNote, setIsInternalNote] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [messages, setMessages] = useState<TicketMessage[]>([])
    const [isLoadingMessages, setIsLoadingMessages] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [attachments, setAttachments] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
    const [isLoading, setIsLoading] = useState(true)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        let mounted = true

        const loadUser = async () => {
            try {
                setIsLoading(true)
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                if (sessionError) throw sessionError
                if (!session) {
                    setError('You must be logged in to view tickets')
                    return
                }

                const user = await getUser(session.user)
                if (mounted) {
                    setCurrentUser(user)
                    setError(null)
                }
            } catch (err) {
                if (mounted) {
                    setError('Authentication failed')
                }
            } finally {
                if (mounted) {
                    setIsLoading(false)
                }
            }
        }

        loadUser()

        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        if (ticket?.messages) {
            setMessages(ticket.messages)
            setIsLoadingMessages(false)
        }
    }, [ticket?.messages])

    useEffect(() => {
        let mounted = true
        let subscription: ReturnType<typeof supabase.channel>

        if (ticket?.id) {
            subscription = ticketsService.subscribeToMessages(ticket.id, (message) => {
                if (!mounted) return
                setMessages((prevMessages) => {
                    const messageIndex = prevMessages.findIndex(m => m.id === message.id)
                    if (messageIndex >= 0) {
                        // Update existing message
                        const newMessages = [...prevMessages]
                        newMessages[messageIndex] = message
                        return newMessages
                    }
                    // Add new message
                    return [...prevMessages, message]
                })
            })
        }

        return () => {
            mounted = false
            if (subscription) {
                subscription.unsubscribe()
            }
        }
    }, [ticket?.id])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">{error}</div>
            </div>
        )
    }

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">You must be logged in to view tickets</div>
            </div>
        )
    }

    if (!ticket) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a ticket to view details
            </div>
        )
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setAttachments(prev => [...prev, ...newFiles])
        }
    }

    const handleRemoveFile = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index))
    }

    const uploadFile = async (file: File): Promise<string> => {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `tickets/${ticket?.id}/${fileName}`.replace(/^\/+|\/+$/g, '')
            
            // Upload with metadata
            const { data, error: uploadError } = await supabase.storage
                .from('customerly')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type,
                    duplex: 'half',
                    metadata: {
                        ticket_id: ticket?.id,
                        customer_id: ticket?.customer_id,
                        uploaded_by: currentUser?.id,
                        is_internal: isInternalNote,
                        original_name: file.name,
                        content_type: file.type
                    }
                })

            if (uploadError) {
                throw uploadError
            }

            return filePath
        } catch (error) {
            throw error
        }
    }

    const downloadFile = async (path: string, fileName: string) => {
        try {
            const filePath = path.includes('/storage/v1/object/public/customerly/') 
                ? path.split('/storage/v1/object/public/customerly/')[1] 
                : path.replace(/^\/+|\/+$/g, '')

            const { data, error } = await supabase.storage
                .from('customerly')
                .createSignedUrl(filePath, 60)

            if (error) {
                throw error
            }

            if (!data?.signedUrl) {
                throw new Error('Failed to generate download URL')
            }

            // Create a temporary link and trigger download
            const link = document.createElement('a')
            link.href = data.signedUrl
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            setError('Failed to download file. Please try again.')
        }
    }

    const previewImage = async (path: string) => {
        try {
            const filePath = path.includes('/storage/v1/object/public/customerly/') 
                ? path.split('/storage/v1/object/public/customerly/')[1] 
                : path.replace(/^\/+|\/+$/g, '')

            const { data, error } = await supabase.storage
                .from('customerly')
                .createSignedUrl(filePath, 300) // URL valid for 5 minutes for viewing

            if (error) {
                throw error
            }

            if (!data?.signedUrl) {
                throw new Error('Failed to generate preview URL')
            }

            setPreviewUrl(data.signedUrl)
            setPreviewOpen(true)
        } catch (error) {
            setError('Failed to load image preview. Please try again.')
        }
    }

    const handleSendReply = async () => {
        if (!replyContent.trim() && attachments.length === 0) {
            setError('Please enter a message or attach a file before sending.')
            return
        }

        try {
            setSending(true)
            setError(null)

            const { data: { user: authUser }, error } = await supabase.auth.getUser()
            if (error) throw error
            if (!authUser) {
                throw new Error('You must be logged in to send messages')
            }

            // Upload attachments first
            const uploadedPaths = await Promise.all(attachments.map(uploadFile))

            const user = await getUser(authUser)
            const newMessage = await ticketsService.addMessage({
                ticket_id: ticket!.id,
                content: replyContent,
                is_internal: isInternalNote,
                sender_id: user.id,
                attachments: uploadedPaths
            })
            
            // Optimistically add the new message
            setMessages(prev => [...prev, newMessage])
            
            setReplyContent('')
            setIsInternalNote(false)
            setAttachments([])
            setUploadProgress({})
        } catch (error) {
            setError('Failed to send message. Please try again.')
        } finally {
            setSending(false)
        }
    }

    if (isLoadingMessages) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <ResizablePanelGroup direction="horizontal">
            {/* Main Content */}
            <ResizablePanel defaultSize={75}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="border-b p-4">
                        <h1 className="text-2xl font-semibold mb-2">{ticket.title}</h1>
                        <div className="flex items-center gap-4">
                            <StatusBadge status={ticket.status} />
                            <PriorityBadge priority={ticket.priority} />
                        </div>
                    </div>

                    {/* Message Thread */}
                    <div className="flex-1 overflow-y-auto p-6" ref={messagesContainerRef}>
                        <div className="space-y-6">
                            {/* Initial Description */}
                            <div className="flex gap-4 max-w-2xl mx-auto">
                                <Avatar
                                    name={ticket.customer.name}
                                    email={ticket.customer.email}
                                    avatarUrl={ticket.customer.avatarUrl}
                                    size="md"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">
                                            {ticket.customer.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : 'No date'}
                                        </span>
                                    </div>
                                    <div className="prose prose-sm max-w-none p-3 rounded-lg bg-gray-50">
                                        {ticket.description}
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="space-y-6">
                                {messages.map((message) => {
                                    const isCustomer = message.sender?.email === ticket.customer.email;
                                    const isLoggedInUser = currentUser && message.sender?.email === currentUser.email;
                                    return (
                                        <div 
                                            key={message.id} 
                                            className={cn(
                                                "flex gap-4 max-w-2xl mx-auto",
                                                message.is_internal ? "bg-[#FFF9E7] rounded-lg p-4" : "",
                                            )}
                                        >
                                            {isCustomer && (
                                                <Avatar
                                                    name={message.sender?.name || 'User'}
                                                    email={message.sender?.email || ''}
                                                    avatarUrl={message.sender?.avatarUrl}
                                                    size="md"
                                                />
                                            )}
                                            <div className={cn(
                                                "flex-1",
                                                !isCustomer ? "" : ""
                                            )}>
                                                <div className={cn(
                                                    "flex items-center gap-2 mb-1",
                                                    !isCustomer ? "justify-end" : ""
                                                )}>
                                                    <span className={cn(
                                                        "font-medium",
                                                        isLoggedInUser ? "text-blue-600" : ""
                                                    )}>
                                                        {message.sender?.name || message.sender?.email}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {message.created_at ? new Date(message.created_at).toLocaleString() : 'No date'}
                                                    </span>
                                                    {message.is_internal && (
                                                        <span className="text-xs text-muted-foreground">
                                                            • Internal
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={cn(
                                                    "prose prose-sm max-w-none p-3 rounded-lg",
                                                    isLoggedInUser ? "bg-blue-50" :
                                                    message.is_internal ? "bg-[#FFF9E7]" : "bg-gray-50"
                                                )}>
                                                    {message.content}
                                                    {message.attachments && message.attachments.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            {message.attachments.map((path, index) => {
                                                                const fileName = path.split('/').pop() || 'file'
                                                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)
                                                                return (
                                                                    <div key={index} className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => isImage ? previewImage(path) : downloadFile(path, fileName)}
                                                                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                                            </svg>
                                                                            {decodeURIComponent(fileName)}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => downloadFile(path, fileName)}
                                                                            className="p-1 hover:bg-gray-100 rounded"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {!isCustomer && (
                                                <Avatar
                                                    name={message.sender?.name || 'User'}
                                                    email={message.sender?.email || ''}
                                                    avatarUrl={message.sender?.avatarUrl}
                                                    size="md"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Reply Box */}
                    <div className="p-4 border-t border-border">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                            <Button
                                variant={isInternalNote ? "outline" : "default"}
                                size="sm"
                                onClick={() => setIsInternalNote(false)}
                                className="relative"
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Reply
                            </Button>
                            <Button
                                variant={isInternalNote ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsInternalNote(true)}
                                className="relative"
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeWidth={2} d="M8 7.5v9M12 7.5v9M16 7.5v9M3 10.5h18M3 14.5h18"/>
                                </svg>
                                Internal Note
                            </Button>
                        </div>
                        <div className={cn(
                            "rounded-lg border transition-colors duration-200",
                            isInternalNote ? "bg-[#FFF9E7] border-[#E6D5A7]" : "bg-white border-input"
                        )}>
                            <Textarea
                                placeholder={isInternalNote ? "Add an internal note..." : "Type your reply..."}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className={cn(
                                    "border-0 focus-visible:ring-0 resize-none",
                                    isInternalNote ? "bg-[#FFF9E7] placeholder:text-[#8B5D23]" : ""
                                )}
                                rows={4}
                            />
                            <div className="flex items-center justify-between p-2 border-t">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        onChange={handleFileSelect}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        Attach
                                    </Button>
                                    {attachments.length > 0 && (
                                        <div className="flex gap-2 items-center">
                                            {attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs"
                                                >
                                                    <span className="truncate max-w-[100px]">{file.name}</span>
                                                    {uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
                                                        <span className="text-muted-foreground">
                                                            {uploadProgress[file.name]}%
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={handleSendReply}
                                    disabled={sending}
                                    className={cn(
                                        isInternalNote ? "bg-[#8B5D23] hover:bg-[#704B1C] text-white" : ""
                                    )}
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        isInternalNote ? 'Add Note' : 'Send Reply'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Customer and Ticket Details Sidebar */}
            <ResizablePanel defaultSize={25}>
                <div className="h-full overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Customer Info */}
                        <div>
                            <h3 className="font-semibold mb-4">Customer Info</h3>
                            <div className="flex flex-col items-center mb-4">
                                <Avatar
                                    name={ticket.customer?.name || 'Customer'}
                                    email={ticket.customer?.email || ''}
                                    avatarUrl={ticket.customer?.avatarUrl}
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
                                {(ticket.customer as { organization?: string })?.organization && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span>{(ticket.customer as { organization?: string })?.organization}</span>
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
                                    <span>{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : 'No date'}</span>
                                </div>
                                {ticket.sla_deadline && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>SLA: {ticket.sla_deadline ? new Date(ticket.sla_deadline).toLocaleString() : 'No date'}</span>
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
            </ResizablePanel>

            {/* Image Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] min-w-[400px] min-h-[300px] p-0 border-0 bg-black/30 backdrop-blur-sm">
                    <DialogHeader className="absolute top-2 right-2 z-50">
                        <DialogClose className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white border-0">
                            <X className="h-4 w-4" />
                        </DialogClose>
                    </DialogHeader>
                    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-8">
                        {previewUrl && (
                            <div className="relative max-w-full max-h-[85vh] min-w-[300px] min-h-[200px] bg-black/20 rounded-lg overflow-hidden">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    width={1200}
                                    height={800}
                                    className="object-contain w-full h-full"
                                    style={{ width: 'auto', height: 'auto', minWidth: '300px', minHeight: '200px' }}
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </ResizablePanelGroup>
    )
}
