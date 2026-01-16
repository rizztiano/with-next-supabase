import BlogList from '@/components/blog/blog-list'
import { Spinner } from '@/components/ui/spinner'
import { Suspense, use } from 'react'

export interface IBlogPageProps {
   searchParams: Promise<{ page: string }>
}

const Page = ({ searchParams }: IBlogPageProps) => {
   const key = use(searchParams).page

   return (
      <div className='flex-1 w-full flex flex-col'>
         <div className='flex'></div>
         <div className='flex'>
            <Suspense
               key={key}
               fallback={
                  <div className='flex gap-2 items-center'>
                     <Spinner /> <span>Getting blogs</span>
                  </div>
               }
            >
               <BlogList mine={false} searchParams={searchParams} />
            </Suspense>
         </div>
      </div>
   )
}

export default Page
