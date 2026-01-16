import { IBlogCard } from '@/components/blog/blog-card'
import BlogInteraction from '@/components/blog/blog-interaction'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import Image from 'next/image'

const BlogSingle = async ({ slug }: { slug: string }) => {
   const supabase = await createClient()
   const {
      data: { user }
   } = await supabase.auth.getUser()

   const { data } = await supabase.from('blogs').select('*, profile (*)').eq('id', slug).single()
   const blog = data as IBlogCard['blog']

   if (!blog) {
      return <h1 className='text-red-800'>Blog not found!</h1>
   }

   if (blog.image) {
      const file = supabase.storage.from('blog-feature')
      const { data: exists } = await file.exists(blog.image)

      if (exists) {
         blog.imageUrl = (
            await supabase.storage.from('blog-feature').createSignedUrl(blog.image, 86400)
         ).data?.signedUrl
      }
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
         {blog.imageUrl && (
            <div className='relative h-80 w-full shadow-lg shrink-0 rounded-lg overflow-hidden'>
               <Image
                  objectFit='cover'
                  fill
                  alt={`${blog?.id} - ${blog?.title}`}
                  src={blog.imageUrl}
                  unoptimized
               />
            </div>
         )}
         <div className='prose' dangerouslySetInnerHTML={{ __html: blog.content }}></div>
         <BlogInteraction />
      </div>
   )
}

export default BlogSingle
