'use client'

import { createBlog, updateBlog } from '@/actions/blog'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Database } from '@/types/supabase'
import { zodResolver } from '@hookform/resolvers/zod'
import DOMPurify from 'dompurify'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface IBlogDialog {
   button: React.ReactNode
   blog?: Database['public']['Tables']['blogs']['Row'] & {
      imageUrl?: string
   }
}

const MAX_SIZE = 10 * 1024 * 1024

const schema = z.object({
   title: z.string().min(1, 'Title is required.'),
   image: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_SIZE, 'File size must be 10MB or smaller')
      .refine((file) => /^image\/.+/.test(file.type), 'Only image files allowed')
      .optional()
      .nullable(),
   content: z.string().min(1, 'Content is required.')
})

type formSchema = z.infer<typeof schema>

const BlogDialog = ({ button, blog }: IBlogDialog) => {
   const [loading, setLoading] = useState<boolean>(false)
   const [open, setOpen] = useState<boolean>(false)
   const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

   const form = useForm<formSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
         title: '',
         image: undefined,
         content: ''
      },
      mode: 'onSubmit'
   })

   const imageFile = useWatch({
      control: form.control,
      name: 'image'
   })

   useEffect(() => {
      setImageUrl(imageFile ? URL.createObjectURL(imageFile) : undefined)
   }, [imageFile])

   useEffect(() => {
      if (blog) {
         form.reset({
            title: blog.title,
            content: blog.content
         })

         setImageUrl(blog.imageUrl)
      }
   }, [blog, form, open])

   const createBlogAction = async () => {
      setLoading(true)

      const formData = new FormData()
      formData.append('title', form.getValues('title'))
      formData.append('content', DOMPurify.sanitize(form.getValues('content')))

      const image = form.getValues('image') as File
      if (image) {
         formData.append('image', image)
      }

      try {
         const create = await createBlog(formData)
         toast.info(create.message)
      } catch (e: unknown) {
         toast.error((e as Error).message)
      }

      // cleanup
      setOpen(false)
      form.reset()

      setLoading(false)
   }

   const updateBlogAction = async () => {
      setLoading(true)

      const formData = new FormData()
      formData.append('title', form.getValues('title'))
      formData.append('content', DOMPurify.sanitize(form.getValues('content')))

      const image = form.getValues('image') as File
      if (image) {
         formData.append('image', image)
      }

      try {
         const update = await updateBlog(blog?.id as string, formData)

         toast.info(update.message)
      } catch (e: unknown) {
         toast.error((e as Error).message)
      }

      // cleanup
      setOpen(false)
      form.reset()

      setLoading(false)
   }

   function isButtonComponent(node: React.ReactNode): boolean {
      return React.isValidElement(node) && node.type === 'button'
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild={isButtonComponent(button)}>{button}</DialogTrigger>
         <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className='sm:max-w-150 rounded-lg'
         >
            <Form {...form}>
               <form
                  className='gap-6 flex flex-col'
                  onSubmit={form.handleSubmit(blog ? updateBlogAction : createBlogAction)}
               >
                  <DialogHeader>
                     <DialogTitle>{blog ? 'Update your blog' : 'Create a blog'}</DialogTitle>
                     <DialogDescription>
                        {blog
                           ? 'Keep your blog fresh'
                           : 'Launch a blog and start sharing content in minutes.'}
                     </DialogDescription>
                  </DialogHeader>
                  <div className='gap-6 flex flex-col max-h-[60vh] overflow-auto p-1 pr-4'>
                     <FormField
                        control={form.control}
                        name={'title'}
                        render={({ field }) => (
                           <FormItem className='grid gap-2'>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <Input
                                    id='title'
                                    type='text'
                                    placeholder='Beatiful blog'
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name={'image'}
                        render={({ field: { onChange, ...fieldProps } }) => (
                           <FormItem className='grid gap-2'>
                              <FormLabel>Image</FormLabel>
                              <FormControl>
                                 <div className='flex justify-between items-center gap-3'>
                                    <Input
                                       {...fieldProps}
                                       id='image'
                                       type='file'
                                       accept='image/*'
                                       value={undefined}
                                       className='file:text-blue-500 file:text-sm file:font-medium text-sm align-middle pt-1.75'
                                       onChange={async (e) => {
                                          const files = e.target.files
                                          onChange(files && files[0])
                                       }}
                                    />
                                    {imageUrl && (
                                       <Trash
                                          size={20}
                                          className='text-red-700/80 cursor-pointer'
                                          onClick={() => {
                                             setImageUrl('')
                                             form.setValue('image', null)
                                          }}
                                       />
                                    )}
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {imageUrl && (
                        <div className='relative h-52 rounded-md overflow-hidden shrink-0'>
                           <Image
                              className='object-cover'
                              fill
                              alt={`${blog?.id} - ${blog?.title}`}
                              src={imageUrl}
                              unoptimized
                           />
                        </div>
                     )}
                     <FormField
                        control={form.control}
                        name={'content'}
                        render={({ field }) => (
                           <FormItem className='grid gap-2'>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                 <RichTextEditor
                                    // [&_.ProseMirror]:max-h-50
                                    className='[&_.ProseMirror]:overflow-auto text-neutral-950'
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                 ></RichTextEditor>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <DialogFooter>
                     <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                     </DialogClose>
                     <Button disabled={loading} type='submit'>
                        {loading && <Spinner />}
                        {blog ? 'Edit' : 'Create'}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

export default BlogDialog
