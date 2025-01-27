import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { type Attachment, attachmentService } from '@/services/attachments'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogClose
} from "@/components/ui/dialog"
import { X } from 'lucide-react'

interface Props {
    attachments: Attachment[]
    onDelete?: (attachment: Attachment) => Promise<void>
    className?: string
}

export function AttachmentList({ attachments, onDelete, className }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handlePreview = async (attachment: Attachment) => {
        try {
            const url = await attachmentService.getPreviewUrl(attachment.bucketPath)
            setPreviewUrl(url)
            setPreviewOpen(true)
        } catch (error) {
            setError('Failed to load preview')
        }
    }

    const handleDownload = async (attachment: Attachment) => {
        try {
            await attachmentService.download(attachment.bucketPath, attachment.originalName)
        } catch (error) {
            setError('Failed to download file')
        }
    }

    const isImage = (attachment: Attachment) => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.fileName)

    if (!attachments.length) return null

    return (
        <div className={cn("space-y-2", className)}>
            {error && (
                <div className="text-sm text-red-600 mb-2">
                    {error}
                </div>
            )}
            {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-2">
                    <button
                        onClick={() => isImage(attachment) ? handlePreview(attachment) : handleDownload(attachment)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {decodeURIComponent(attachment.originalName)}
                    </button>
                    <button
                        onClick={() => handleDownload(attachment)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Download"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(attachment)}
                            className="p-1 hover:bg-gray-100 rounded text-red-600 hover:text-red-800"
                            title="Delete"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            ))}

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
        </div>
    )
} 