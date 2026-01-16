import { IBlogPageProps } from '@/app/blogs/page'
import BlogDialog from '@/components/blog/blog-dialog'
import BlogList from '@/components/blog/blog-list'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Suspense, use } from 'react'

const Page = ({ searchParams }: IBlogPageProps) => {
   const key = use(searchParams).page

   return (
      <div className='flex-1 w-full flex flex-col gap-8'>
         <div className='flex'>
            <BlogDialog
               button={<Button className='bg-green-600 hover:bg-green-700'>Create</Button>}
            />
         </div>
         <div className='flex'>
            <Suspense
               key={key}
               fallback={
                  <div className='flex gap-2 items-center'>
                     <Spinner /> <span>Getting blogs</span>
                  </div>
               }
            >
               <BlogList mine searchParams={searchParams} />
            </Suspense>
         </div>
      </div>
   )
}

export default Page
