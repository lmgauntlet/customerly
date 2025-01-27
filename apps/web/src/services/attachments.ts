import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export interface Attachment {
    id: string
    bucketPath: string
    fileName: string
    originalName: string
    contentType: string
    size: number
    entityType: string
    ticketId?: string
    messageId?: string
    uploaderId: string
    created_at?: string
}

export type EntityType = 'ticket' | 'message'

export const attachmentService = {
    /**
     * Upload a file to Supabase storage and create an attachment record
     */
    async upload({
        file,
        entityType,
        entityId,
        uploaderId,
        isInternal = false
    }: {
        file: File
        entityType: EntityType
        entityId: string
        uploaderId: string
        isInternal?: boolean
    }): Promise<Attachment> {
        try {
            const id = `att_${uuidv4()}`
            const fileExt = file.name.split('.').pop()
            const timestamp = new Date().getTime()
            const fileName = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${entityType}s/${entityId}/${fileName}`.replace(/^\/+|\/+$/g, '')

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('customerly')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type,
                    duplex: 'half',
                    metadata: {
                        entity_type: entityType,
                        entity_id: entityId,
                        uploader_id: uploaderId,
                        is_internal: isInternal,
                        original_name: file.name
                    }
                })

            if (uploadError) throw uploadError

            // Create attachment record in database with the correct field mapping
            const attachmentData = {
                id,
                bucket_path: filePath,
                filename: fileName,
                original_name: file.name,
                content_type: file.type,
                size: file.size,
                entity_type: entityType,
                uploader_id: uploaderId,
                // Map entity_id to the correct field based on type
                ...(entityType === 'ticket' ? { ticket_id: entityId } : {}),
                ...(entityType === 'message' ? { message_id: entityId } : {})
            }

            const { data, error: attachmentError } = await supabase
                .from('attachments')
                .insert(attachmentData)
                .select()
                .single()

            if (attachmentError) throw attachmentError

            return {
                ...data,
                bucketPath: data.bucket_path,
                fileName: data.filename,
                originalName: data.original_name,
                contentType: data.content_type,
                entityType: data.entity_type,
                ticketId: data.ticket_id,
                messageId: data.message_id,
                uploaderId: data.uploader_id
            }
        } catch (error) {
            console.error('Error uploading attachment:', error)
            throw error
        }
    },

    /**
     * Get a signed URL for downloading a file
     */
    async getDownloadUrl(bucketPath: string, expiresIn = 60): Promise<string> {
        const { data, error } = await supabase.storage
            .from('customerly')
            .createSignedUrl(bucketPath, expiresIn)

        if (error) throw error
        if (!data?.signedUrl) throw new Error('Failed to generate download URL')

        return data.signedUrl
    },

    /**
     * Get a signed URL for previewing a file (longer expiration for viewing)
     */
    async getPreviewUrl(bucketPath: string): Promise<string> {
        return this.getDownloadUrl(bucketPath, 300) // 5 minutes for preview
    },

    /**
     * Download a file
     */
    async download(bucketPath: string, originalName: string): Promise<void> {
        const signedUrl = await this.getDownloadUrl(bucketPath)

        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = signedUrl
        link.download = originalName // Use original filename for download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    },

    /**
     * Delete an attachment
     */
    async delete(attachment: Attachment): Promise<void> {
        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from('customerly')
            .remove([attachment.bucketPath])

        if (storageError) throw storageError

        // Delete from database
        const { error: dbError } = await supabase
            .from('attachments')
            .delete()
            .match({ id: attachment.id })

        if (dbError) throw dbError
    },

    /**
     * Get attachments for an entity
     */
    async getForEntity(entityType: EntityType, entityId: string): Promise<Attachment[]> {
        const { data, error } = await supabase
            .from('attachments')
            .select('*')
            .match({ entity_type: entityType, entity_id: entityId })
            .order('created_at', { ascending: true })

        if (error) throw error
        return data as Attachment[]
    }
} 