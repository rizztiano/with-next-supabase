import BlogNewComment from '@/components/blog/interaction/blog-new-comment'
import { Button } from '@/components/ui/button'

const BlogInteraction = () => {
   return (
      <div className='flex flex-col w-full gap-6'>
         <div className='flex items-center justify-between'>
            <h3 className='text-xl font-medium'>Comments (1)</h3>
            <Button className='bg-green-600 hover:bg-green-700'>Add comment</Button>
         </div>
         <div className='flex flex-col'>
            <BlogNewComment />
         </div>
      </div>
   )
}

export default BlogInteraction
