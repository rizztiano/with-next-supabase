import BlogCard from '@/components/blog/blog-card'
import { createClient } from '@/lib/supabase/server'

const BlogList = async () => {
   const supabase = await createClient()

   const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('created_by', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false })

   return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
         {data?.map((blog) => {
            return (
               <div key={blog.id}>
                  <BlogCard blog={blog} />
               </div>
            )
         })}
      </div>
   )
}

export default BlogList
