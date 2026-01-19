'use client'

import { IGetComments, updateComment } from '@/actions/blog-interactions'
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
import { Edit, Link, X } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { v4 } from 'uuid'
import { z } from 'zod'

interface IBlogDialog {
   comment: IGetComments['comment']
}

const MAX_SIZE = 10 * 1024 * 1024

const schema = z.object({
   content: z.string().min(1, 'Content is required.')
})

type formSchema = z.infer<typeof schema>

/**
 * 0 = deleted
 * 1 = added
 */
export interface IImageFile {
   id: string
   mode: 0 | 1
   file?: File
   new: boolean
}

export interface IImageUrl {
   id: string
   url: string
   new: boolean
}

const BlogEditComment = ({ comment }: IBlogDialog) => {
   const [loading, setLoading] = useState<boolean>(false)
   const [open, setOpen] = useState<boolean>(false)

   const [imageFiles, setImageFiles] = useState<IImageFile[]>([])
   const [imageUrls, setImageUrls] = useState<IImageUrl[]>([])

   const form = useForm<formSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
         content: ''
      },
      mode: 'onSubmit'
   })

   useEffect(() => {
      if (comment) {
         form.reset({
            content: comment.content
         })

         setImageUrls(
            comment.blog_interaction_attachments.map((attachment) => ({
               id: attachment.id,
               url: attachment.attachmentLink || '',
               new: false
            }))
         )
      }
   }, [comment, form, open])

   const fileInputRef = useRef<HTMLInputElement>(null)

   const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return

      const files = Array.from(event.target.files)

      files.forEach((file) => {
         const newId = v4()

         setImageFiles((prev) => [
            ...prev,
            {
               id: newId,
               file: file,
               mode: 1,
               new: true
            }
         ])

         setImageUrls((prev) => [
            ...prev,
            {
               id: newId,
               url: URL.createObjectURL(file),
               new: true
            }
         ])
      })
   }

   const handleAttachmentClick = () => {
      fileInputRef.current?.click()
   }

   const updateCommentAction = async () => {
      setLoading(true)

      const formData = new FormData()

      formData.append('content', DOMPurify.sanitize(form.getValues('content')))

      if (imageFiles.length > 0) {
         formData.append(
            'attachmentsMetadata',
            JSON.stringify(
               imageFiles.map((file) => ({
                  id: file.id,
                  mode: file.mode,
                  new: file.new
               }))
            )
         )

         imageFiles.forEach((file) => {
            formData.append('attachments', file.file ?? 'null')
         })
      }

      try {
         const update = await updateComment(comment?.id as string, formData)
         toast.info(update.message)
      } catch (e: unknown) {
         toast.error((e as Error).message)
      }

      // cleanup
      setOpen(false)
      form.reset()
      setLoading(false)
   }

   const onEditRemoveAction = (url: IImageUrl) => {
      setImageUrls((prev) => prev.filter((prevUrl) => prevUrl.id !== url.id))

      if (url.new) {
         setImageFiles((prev) => prev.filter((prevFile) => prevFile.id !== url.id))
      } else {
         setImageFiles((prev) => [
            ...prev,
            {
               id: url.id,
               mode: 0,
               new: false
            }
         ])
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Edit className='text-green-700/80 cursor-pointer' size={18} />
         </DialogTrigger>
         <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className='sm:max-w-150 rounded-lg'
         >
            <Form {...form}>
               <form
                  className='gap-6 flex flex-col'
                  onSubmit={form.handleSubmit(updateCommentAction)}
               >
                  <DialogHeader>
                     <DialogTitle>{'Update your comment'}</DialogTitle>
                     <DialogDescription>{'Keep your comment fresh'}</DialogDescription>
                  </DialogHeader>
                  <div className='gap-6 flex flex-col max-h-[60vh] overflow-auto p-1 pr-4'>
                     {imageUrls.length > 0 && (
                        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1'>
                           {imageUrls.map((url, index) => {
                              return (
                                 <div
                                    key={index}
                                    className='relative h-20 overflow-hidden rounded-md shadow-lg [&:hover_.close-button]:opacity-100'
                                 >
                                    <Button
                                       type='button'
                                       className='close-button opacity-0 absolute right-2 top-2 z-10 bg-red-600/80 hover:bg-red-700 shadow-lg p-0 h-6 w-6'
                                       onClick={() => onEditRemoveAction(url)}
                                    >
                                       <X size={12} />
                                    </Button>

                                    <Image
                                       className='object-cover'
                                       fill
                                       alt={url.id ?? v4()}
                                       src={url.url}
                                       unoptimized
                                    />
                                 </div>
                              )
                           })}
                        </div>
                     )}
                     <FormField
                        control={form.control}
                        name={'content'}
                        render={({ field }) => (
                           <FormItem className='grid gap-2'>
                              <FormLabel>Comment</FormLabel>
                              <FormControl>
                                 <Input id='comment' type='text' {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className='flex justify-end w-full gap-2'>
                     <div className='flex justify-end w-full items-center gap-4'>
                        <div className='flex items-center'>
                           <div
                              className='flex gap-2 cursor-pointer'
                              onClick={handleAttachmentClick}
                           >
                              <Link size={20} className='text-neutral-700' />
                              <p className='text-sm font-medium text-neutral-700'>Attachment</p>
                           </div>
                           <input
                              ref={fileInputRef}
                              type='file'
                              multiple
                              onChange={handleFileSelect}
                              className='hidden'
                              accept='image/*'
                           />
                        </div>
                     </div>
                  </div>
                  <DialogFooter>
                     <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                     </DialogClose>
                     <Button disabled={loading} type='submit'>
                        {loading && <Spinner />}
                        Edit
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

export default BlogEditComment
