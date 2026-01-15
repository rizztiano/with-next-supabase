'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ICreateBlog {
   title: string
   content: string
}

export const createBlog = async (data: ICreateBlog) => {
   const supabase = await createClient()
   const user = await supabase
      .from('profile')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id as string)
      .single()

   const { error } = await supabase.from('blogs').insert({
      title: data.title,
      content: data.content,
      created_by: user.data?.id as string
   })

   if (error) {
      throw new Error(error.message)
   }

   revalidatePath('/blogs')

   return {
      message: 'The blog has been created successfully.'
   }
}

interface IUpdateBlog {
   title?: string
   content?: string
}

export const updateBlog = async (id: string, data: IUpdateBlog) => {
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

   const { error } = await supabase
      .from('blogs')
      .update({
         title: data.title,
         content: data.content
      })
      .eq('id', id)

   if (error) throw new Error(error.message)

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

   revalidatePath('/blogs')

   return {
      message: 'The blog has been deleted successfully.'
   }
}
