import BlogCard from '@/components/blog/blog-card'
import { sbServerIsAuthenticated } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'

const BlogList = async ({ mine }: { mine: boolean }) => {
   const supabase = await createClient()
   const authenticated = await sbServerIsAuthenticated()

   let query = supabase.from('blogs').select('*')

   if (authenticated && mine) {
      query = query.eq('created_by', (await supabase.auth.getUser()).data.user?.id)
   }

   const { data } = await query.order('created_at', { ascending: false })

   return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full'>
         {data?.map((blog) => {
            return (
               <div key={blog.id}>
                  <BlogCard blog={blog} authenticated={authenticated} />
               </div>
            )
         })}
      </div>
   )
}

export default BlogList
