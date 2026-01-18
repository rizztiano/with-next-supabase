import { getComments } from '@/actions/blog-interactions'
import BlogInteraction from '@/components/blog/interaction/blog-interaction'
import { Badge } from '@/components/ui/badge'
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom'
import { User } from 'lucide-react'
import Image from 'next/image'

const BlogInteractionList = async ({ id }: { id: string }) => {
   const comments = await getComments(id)

   return (
      <div className='flex flex-col w-full gap-6'>
         <BlogInteraction count={comments.count} />
         <div className='flex flex-col gap-10'>
            {comments.data?.map((comment) => {
               return (
                  <div className='flex gap-2' key={comment.id}>
                     <div className='shrink-0'>
                        <User
                           className={`fill-current ${comment.profile?.name ? `text-blue-500/80` : `text-neutral-900`}`}
                        />
                     </div>
                     <div className='flex-col flex w-full gap-2'>
                        <Badge
                           className={`self-start ${comment.profile?.name && `bg-blue-500/80`}`}
                        >
                           {comment.profile?.name || 'Anonymous'}
                        </Badge>
                        <div className='w-full flex flex-col p-2 bg-blue-50 rounded-md gap-3'>
                           {comment.blog_interaction_attachments.length > 0 && (
                              <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1'>
                                 {comment.blog_interaction_attachments
                                    .filter((file) => file.attachmentLink !== undefined)
                                    .map((attachment, index) => {
                                       return (
                                          <ImageZoom
                                             key={index}
                                             className='relative h-20 overflow-hidden rounded-md shadow-lg'
                                          >
                                             <Image
                                                className='object-cover'
                                                fill
                                                alt={attachment.id}
                                                src={attachment.attachmentLink as string}
                                                unoptimized
                                             />
                                          </ImageZoom>
                                       )
                                    })}
                              </div>
                           )}
                           <div className='w-full'>{comment.content}</div>
                        </div>
                     </div>
                  </div>
               )
            })}
         </div>
      </div>
   )
}

export default BlogInteractionList
