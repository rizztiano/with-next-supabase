import { AutosizeTextarea } from '@/components/ui/autosize-textarea'
import { Button } from '@/components/ui/button'
import { CircleArrowRight, Link } from 'lucide-react'

const BlogInteraction = () => {
   return (
      <div className='flex flex-col w-full gap-6'>
         <div className='flex items-center justify-between'>
            <h3 className='text-xl font-medium'>Comments (1)</h3>
            <Button className='bg-green-600 hover:bg-green-700'>Add comment</Button>
         </div>
         <div className='flex flex-col'>
            <div className='flex flex-col gap-3'>
               <AutosizeTextarea className='resize-none text-base' minHeight={0} />
               <div className='flex justify-end w-full gap-2'>
                  <div className='flex justify-end w-full items-center gap-1'>
                     <div className='flex gap-2'>
                        <Link size={20} className='text-orange-600' />
                     </div>
                     <CircleArrowRight size={24} className='text-blue-500 cursor-pointer' />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default BlogInteraction
