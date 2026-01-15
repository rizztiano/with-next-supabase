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
import { zodResolver } from '@hookform/resolvers/zod'
import DOMPurify from 'dompurify'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface IBlogDialog {
   button: React.ReactNode
   blog?: any
}

const MAX_SIZE = 10 * 1024 * 1024

const schema = z.object({
   title: z.string().min(1, 'Title is required.'),
   image: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_SIZE, 'File size must be 3MB or smaller')
      .refine((file) => /^image\/.+/.test(file.type), 'Only image files allowed')
      .optional(),
   content: z.string().min(1, 'Content is required.')
})

type formSchema = z.infer<typeof schema>

const BlogDialog = ({ button, blog }: IBlogDialog) => {
   const [loading, setLoading] = useState<boolean>(false)
   const [open, setOpen] = useState<boolean>(false)
   const [imageName, setImageName] = useState<string>('')

   const form = useForm<formSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
         title: '',
         image: undefined,
         content: ''
      },
      mode: 'onSubmit'
   })

   useEffect(() => {
      if (blog) {
         form.reset({
            title: blog.title,
            content: blog.content
         })
      }
   }, [blog, form])

   const createBlogAction = async () => {
      setLoading(true)

      try {
         const create = await createBlog({
            title: form.getValues('title'),
            content: DOMPurify.sanitize(form.getValues('content'))
         })
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

      try {
         const update = await updateBlog(blog.id, {
            title: form.getValues('title'),
            content: DOMPurify.sanitize(form.getValues('content'))
         })

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
         <DialogContent onInteractOutside={(e) => e.preventDefault()} className='sm:max-w-150'>
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
                              <Input
                                 {...fieldProps}
                                 id='image'
                                 type='file'
                                 accept='image/*'
                                 value={undefined}
                                 className='file:text-blue-500 file:text-sm file:font-medium text-sm align-middle pt-1.5'
                                 onChange={async (e) => {
                                    const files = e.target.files
                                    onChange(files && files[0])
                                 }}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name={'content'}
                     render={({ field }) => (
                        <FormItem className='grid gap-2'>
                           <FormLabel>Content</FormLabel>
                           <FormControl>
                              <RichTextEditor
                                 className='[&_.ProseMirror]:max-h-50 [&_.ProseMirror]:overflow-auto text-neutral-950'
                                 value={field.value}
                                 onChange={(e) => field.onChange(e)}
                              ></RichTextEditor>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
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
