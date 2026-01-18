'use client'

import BlogNewComment from '@/components/blog/interaction/blog-new-comment'
import { Button } from '@/components/ui/button'
import { useCallback, useState } from 'react'

const BlogInteraction = ({ count }: { count: number }) => {
   const [newComment, setNewComment] = useState<boolean>(false)

   const toggleNewComment = useCallback((value: boolean) => {
      setNewComment((prev) => !prev)
   }, [])

   return (
      <>
         <div className='flex items-center justify-between'>
            <h3 className='text-xl font-medium'>Comments ({count})</h3>
            <Button
               onClick={() => toggleNewComment(true)}
               className={`bg-green-600 hover:bg-green-700`}
            >
               {newComment ? `Cancel comment` : `Add comment`}
            </Button>
         </div>
         {newComment && (
            <div className='flex flex-col'>
               <BlogNewComment toggleNewComment={toggleNewComment} />
            </div>
         )}
      </>
   )
}

export default BlogInteraction
