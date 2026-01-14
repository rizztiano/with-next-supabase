'use client'

import { deleteBlog } from '@/actions/blog'
import BlogDialog from '@/components/blog/blog-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Database } from '@/types/supabase'
import { format } from 'date-fns'
import { Edit, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface IBlogCard {
   blog: Database['public']['Tables']['blogs']['Row'] & {
      profile: Database['public']['Tables']['profile']['Row']
   }
   belongsToAuthUser?: boolean
}

const BlogCard = ({ blog, belongsToAuthUser }: IBlogCard) => {
   const [loading, setLoading] = useState<boolean>(false)
   const [openDelete, setOpenDelete] = useState<boolean>(false)

   const deleteBlogAction = async () => {
      setLoading(true)

      try {
         const del = await deleteBlog(blog.id)
         toast.info(del.message)
      } catch (e: unknown) {
         toast.error((e as Error).message)
      }

      setOpenDelete(false)
      setLoading(false)
   }

   return (
      <Card className='overflow-auto cursor-pointer gap-2 h-full'>
         <CardHeader>
            <CardTitle className='flex flex-col gap-1'>
               <div className='flex justify-start gap-2 [&>*]:shrink-0'>
                  <div className='text-xs font-medium text-blue-500'>
                     {blog.profile.name}&nbsp;
                     <span className='text-blue-500 font-bold'>
                        {belongsToAuthUser ? '(You)' : ''}
                     </span>
                  </div>
                  <Separator orientation='vertical' className='h-[unset]!' />
                  <div className='text-xs font-normal text-neutral-500'>
                     {format(blog.created_at, 'MMM dd, yyyy')}
                  </div>
               </div>
               <div>{blog.title}</div>
            </CardTitle>
            {belongsToAuthUser !== undefined && belongsToAuthUser && (
               <CardAction className='flex items-center gap-1'>
                  <BlogDialog
                     button={<Edit className='text-green-700/80' size={18} />}
                     blog={blog}
                  />
                  <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                     <DialogTrigger>
                        <Trash className='cursor-pointer text-red-600/80' size={18} />
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Are you absolutely sure?</DialogTitle>
                           <DialogDescription>
                              This action cannot be undone. This will permanently delete your blog.
                           </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                           <DialogClose asChild>
                              <Button variant='outline'>Cancel</Button>
                           </DialogClose>
                           <Button
                              disabled={loading}
                              className='bg-red-600/80 hover:bg-red-600'
                              type='button'
                              onClick={deleteBlogAction}
                           >
                              {loading && <Spinner />}
                              Delete
                           </Button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               </CardAction>
            )}
         </CardHeader>
         <CardContent className='flex flex-col h-full justify-center py-3 bg-blue-50/40 border-t border-b'>
            <div
               className='line-clamp-6 text-neutral-600 text-sm'
               dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
         </CardContent>
      </Card>
   )
}

export default BlogCard
