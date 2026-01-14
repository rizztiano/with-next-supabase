import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { use } from 'react'

const Page = ({ params }: { params: Promise<{ slug: string }> }) => {
   const { slug } = use(params)

   const supabase = use(createClient())
   const {
      data: { user }
   } = use(supabase.auth.getUser())

   const { data: blog } = use(
      supabase.from('blogs').select('*, profile (*)').eq('id', slug).single()
   )

   if (!blog) {
      return <h1 className='text-red-800'>Blog not found!</h1>
   }

   const belongsToAuthUser = blog.created_by === user?.id

   return (
      <div className='flex flex-col gap-10 items-center'>
         <div className='flex flex-col justify-center items-center w-full gap-1'>
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
            <h1 className='text-xl font-semibold'>{blog.title}</h1>
         </div>
         <div className='prose' dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </div>
   )
}

export default Page
