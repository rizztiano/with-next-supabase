import { AutosizeTextarea } from '@/components/ui/autosize-textarea'
import { Button } from '@/components/ui/button'

const BlogInteraction = () => {
   return (
      <div className='flex flex-col w-full gap-6'>
         <div className='flex justify-between'>
            <h3 className='text-xl font-medium'>Comments (1)</h3>
            <Button className='bg-green-600 hover:bg-green-700'>Add comment</Button>
         </div>
         <div className='flex flex-col'>
            <AutosizeTextarea className='resize-none' minHeight={0} />
         </div>
      </div>
   )
}

export default BlogInteraction
