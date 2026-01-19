'use client'

import { createComment } from '@/actions/blog-interactions'
import { AutosizeTextarea } from '@/components/ui/autosize-textarea'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom'
import { BlogSingleContext } from '@/contexts/blog-single-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, SendHorizonal, X } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const schema = z.object({
   content: z.string().min(1, 'Content is required.')
})

type formSchema = z.infer<typeof schema>

interface IBlogNewCommentProps {
   toggleNewComment: (value: boolean) => void
}

const BlogNewComment = ({ toggleNewComment }: IBlogNewCommentProps) => {
   const { id } = useContext(BlogSingleContext)
   const form = useForm<formSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
         content: ''
      },
      mode: 'onSubmit'
   })

   const [selectedFiles, setSelectedFiles] = useState<File[]>([])
   const fileInputRef = useRef<HTMLInputElement>(null)

   const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return

      const files = Array.from(event.target.files)
      setSelectedFiles(files)
   }

   const handleAttachmentClick = () => {
      fileInputRef.current?.click()
   }

   const createCommentAction = async () => {
      const formData = new FormData()
      formData.append('content', form.getValues('content'))

      selectedFiles.forEach((file) => {
         formData.append('attachments', file)
      })

      try {
         const create = await createComment(id, formData)

         toast.info(create.message)
      } catch (e: unknown) {
         toast.error((e as Error).message)
      }

      toggleNewComment(false)
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(createCommentAction)}>
            <div className='flex flex-col gap-3'>
               {selectedFiles.length > 0 && (
                  <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1'>
                     {selectedFiles.map((file, index) => {
                        return (
                           <ImageZoom
                              key={index}
                              className='relative h-20 overflow-hidden rounded-md shadow-lg [&:hover_.close-button]:opacity-100'
                           >
                              <Button
                                 className='close-button opacity-0 absolute right-2 top-2 z-10 bg-red-600/80 hover:bg-red-700 shadow-lg p-0 h-6 w-6'
                                 onClick={() => {
                                    setSelectedFiles((prev) =>
                                       prev.filter((prevFile) => prevFile !== file)
                                    )
                                 }}
                              >
                                 <X size={12} />
                              </Button>

                              <Image
                                 className='object-cover'
                                 fill
                                 alt={file.name}
                                 src={URL.createObjectURL(file)}
                                 unoptimized
                              />
                           </ImageZoom>
                        )
                     })}
                  </div>
               )}
               <FormField
                  control={form.control}
                  name={'content'}
                  render={({ field }) => (
                     <FormItem className='grid gap-2'>
                        <FormControl>
                           <AutosizeTextarea
                              className='resize-none text-base'
                              minHeight={0}
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className='flex justify-end w-full gap-2'>
                  <div className='flex justify-end w-full items-center gap-4'>
                     <div className='flex items-center'>
                        <div className='flex gap-2 cursor-pointer' onClick={handleAttachmentClick}>
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
                     <Separator orientation='vertical' />
                     <Button
                        type='submit'
                        size={'icon-sm'}
                        className='w-12 bg-blue-500 hover:bg-blue-600/90'
                     >
                        <SendHorizonal />
                     </Button>
                  </div>
               </div>
            </div>
         </form>
      </Form>
   )
}

export default BlogNewComment
