'use server'

import { createClient } from '@/lib/supabase/server'
import { TypedFormData } from '@/types/forms'
import { Database } from '@/types/supabase'
import { revalidatePath } from 'next/cache'
import { v4 } from 'uuid'

export interface IGetComments {
   comment: Database['public']['Tables']['blog_interactions']['Row'] & {
      blog_interaction_attachments: (Database['public']['Tables']['blog_interaction_attachments']['Row'] & {
         attachmentLink?: string
      })[]
   } & {
      profile: Database['public']['Tables']['profile']['Row'] | null
   }
}

export const getComments = async (id: string) => {
   const supabase = await createClient()

   const baseInstance = supabase.from('blog_interactions')

   const { count } = await baseInstance
      .select('*', { count: 'exact', head: true })
      .eq('blog_id', id)

   const { data } = await baseInstance
      .select('*, blog_interaction_attachments (*), profile (*)')
      .eq('blog_id', id)
      .order('created_at', { ascending: false })

   const commentsWithAttachmentLinks = await Promise.all(
      (data ?? []).map(async (comment) => {
         const newData: IGetComments['comment'] = { ...comment }

         newData.blog_interaction_attachments = await Promise.all(
            newData.blog_interaction_attachments.map(async (attachment) => {
               if (attachment.key) {
                  const file = supabase.storage.from('blog-feature')
                  const { data: exists } = await file.exists(attachment.key)

                  if (exists) {
                     attachment.attachmentLink = (
                        await supabase.storage
                           .from('blog-feature')
                           .createSignedUrl(attachment.key, 86400)
                     ).data?.signedUrl
                  }
               }

               return attachment
            })
         )

         return newData
      })
   )

   return {
      data: commentsWithAttachmentLinks,
      count: count ?? 0
   }
}

/**
 * 0 = undefined
 * 1 = null
 */
type createFormData = TypedFormData<{
   blogId: string
   content: string
   attachments: File[]
}>

export const createComment = async (id: string, formData: createFormData) => {
   const supabase = await createClient()

   const { data, error } = await supabase
      .from('blog_interactions')
      .insert({
         blog_id: id,
         content: formData.get('content') as string,
         created_by: (await supabase.auth.getUser()).data.user?.id || null
      })
      .select('*')
      .single()

   if (error) {
      throw new Error(error.message)
   }

   if (formData.has('attachments')) {
      ;(formData.getAll('attachments') as File[]).forEach(async (file) => {
         const filename = `${v4()}.${file.name.split('.').pop()}`

         const { error: createError } = await supabase.from('blog_interaction_attachments').insert({
            blog_interaction_id: data.id,
            key: filename
         })

         if (createError) {
            throw new Error(createError.message)
         }

         const { error } = await supabase.storage.from('blog-feature').upload(filename, file, {
            cacheControl: 'no-cache',
            upsert: true,
            contentType: file.type
         })

         if (error) {
            throw new Error(error.message)
         }
      })
   }

   revalidatePath(`/blogs/${id}`)

   return {
      message: 'The comment has been added successfully.'
   }
}
