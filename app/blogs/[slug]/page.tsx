import BlogSingle from '@/components/blog/blog-single'
import { Spinner } from '@/components/ui/spinner'
import { Suspense, use } from 'react'

const Page = ({ params }: { params: Promise<{ slug: string }> }) => {
   const { slug } = use(params)

   return (
      <Suspense
         fallback={
            <div className='flex gap-2 items-center'>
               <Spinner /> <span>Retrieving the blog</span>
            </div>
         }
      >
         <BlogSingle slug={slug} />
      </Suspense>
   )
}

export default Page
