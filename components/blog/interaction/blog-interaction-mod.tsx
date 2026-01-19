'use client'

import { deleteComment, IGetComments } from '@/actions/blog-interactions'
import BlogEditComment from '@/components/blog/interaction/blog-edit-comment'
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
import { Spinner } from '@/components/ui/spinner'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const BlogInteractionMod = ({ comment }: { comment: IGetComments['comment'] }) => {
   const [openDelete, setOpenDelete] = useState<boolean>(false)
   const [loading, setLoading] = useState<boolean>(false)

   const deleteCommmentAction = async () => {
      setLoading(true)

      try {
         const del = await deleteComment(comment.id)
         toast.info(del.message)
      } catch (e: unknown) {
         toast.error((e as Error).message)
      }

      setOpenDelete(false)
      setLoading(false)
   }

   return (
      <div className='flex gap-1'>
         <BlogEditComment comment={comment} />
         <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogTrigger>
               <Trash className='cursor-pointer text-red-700/80' size={18} />
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                     This action cannot be undone. This will permanently delete your comment.
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
                     onClick={deleteCommmentAction}
                  >
                     {loading && <Spinner />}
                     Delete
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}

export default BlogInteractionMod
