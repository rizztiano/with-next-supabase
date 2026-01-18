'use server'

import { formNull, formUndefined } from '@/constants/form'
import { createClient } from '@/lib/supabase/server'
import { TypedFormData } from '@/types/forms'
import { revalidatePath } from 'next/cache'
import { v4 } from 'uuid'

/**
 * 0 = undefined
 * 1 = null
 */
type createFormData = TypedFormData<{
   title: string
   content: string
   image: File | typeof formUndefined | typeof formNull
}>

export const createBlog = async (formData: createFormData) => {
   const supabase = await createClient()

   const user = await supabase
      .from('profile')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id as string)
      .single()

   const image = formData.get('image') as File
   const filename = image instanceof File ? `${v4()}.${image.name.split('.').pop()}` : undefined

   const { error } = await supabase.from('blogs').insert({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      image: filename,
      created_by: user.data?.id as string,
      updated_at: new Date().toISOString()
   })

   if (error) {
      throw new Error(error.message)
   }

   if (filename) {
      const { error } = await supabase.storage.from('blog-feature').upload(filename, image, {
         cacheControl: 'no-cache',
         upsert: true,
         contentType: image.type
      })

      if (error) {
         throw new Error(error.message)
      }
   }

   revalidatePath('/blogs')

   return {
      message: 'The blog has been created successfully.'
   }
}

/**
 * 0 = undefined
 * 1 = null
 */
type updateFormData = TypedFormData<{
   title?: string
   content?: string
   image: File | '0' | '1'
}>

export const updateBlog = async (id: string, formData: updateFormData) => {
   const supabase = await createClient()

   const {
      data: { user }
   } = await supabase.auth.getUser()

   const { data: blog } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .eq('created_by', user?.id as string)
      .single()

   if (blog === null) {
      throw new Error('Unauthorized')
   }

   const image = formData.get('image') as File
   const filename =
      image instanceof File ? blog.image || `${v4()}.${image.name.split('.').pop()}` : undefined

   const { error } = await supabase
      .from('blogs')
      .update({
         title: formData.get('title') as string,
         content: formData.get('content') as string,
         image: filename,
         updated_at: new Date().toISOString()
      })
      .eq('id', id)

   if (error) throw new Error(error.message)

   if (filename) {
      const { error } = await supabase.storage.from('blog-feature').upload(filename, image, {
         cacheControl: 'no-cache',
         upsert: true,
         contentType: image.type
      })

      if (error) {
         throw new Error(error.message)
      }
   }

   if (formData.get('image') == formNull && blog.image) {
      const file = supabase.storage.from('blog-feature')
      const { data: exists } = await file.exists(blog.image as string)

      if (exists) {
         const { error } = await file.remove([blog.image as string])

         if (error) {
            throw new Error(error.message)
         }
      }
   }

   revalidatePath('/blogs')
   revalidatePath(`/blogs/${id}`)

   return {
      message: 'The blog has been updated successfully.'
   }
}

export const deleteBlog = async (id: string) => {
   const supabase = await createClient()
   const {
      data: { user }
   } = await supabase.auth.getUser()

   const { data: blog } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .eq('created_by', user?.id as string)
      .single()

   if (blog === null) {
      throw new Error('Unauthorized')
   }

   const { error } = await supabase.from('blogs').delete().eq('id', id)

   if (error) throw new Error(error.message)

   if (blog.image) {
      const file = supabase.storage.from('blog-feature')
      const { data: exists } = await file.exists(blog.image as string)

      if (exists) {
         const { error } = await file.remove([blog.image as string])

         if (error) {
            throw new Error(error.message)
         }
      }
   }

   revalidatePath('/blogs')

   return {
      message: 'The blog has been deleted successfully.'
   }
}
