import BlogList from '@/components/blog/blog-list'
import { Spinner } from '@/components/ui/spinner'
import { sbServerIsAuthenticated } from '@/lib/supabase/helpers'
import { Suspense } from 'react'

export interface IBlogPageProps {
   searchParams: { page: string }
}

const Page = async ({ searchParams }: IBlogPageProps) => {
   const authenticated = await sbServerIsAuthenticated()

   return (
      <div className='flex-1 w-full flex flex-col'>
         <div className='flex'></div>
         <div className='flex'>
            <Suspense
               fallback={
                  <div className='flex gap-2 items-center'>
                     <Spinner /> <span>Getting blogs</span>
                  </div>
               }
            >
               <BlogList mine={false} searchParams={await searchParams} />
            </Suspense>
         </div>
      </div>
   )
}

export default Page
