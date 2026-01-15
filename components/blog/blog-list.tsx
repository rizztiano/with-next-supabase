import BlogCard from '@/components/blog/blog-card'
import { sbServerIsAuthenticated } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'

const BlogList = async ({ mine }: { mine: boolean }) => {
   const supabase = await createClient()
   const authenticated = await sbServerIsAuthenticated()
   const {
      data: { user }
   } = await supabase.auth.getUser()

   let query = supabase.from('blogs').select(`
      *,
      profile (*)
   `)

   if (authenticated && mine) {
      query = query.eq('created_by', (await supabase.auth.getUser()).data.user?.id as string)
   }

   const { data: blogs } = await query.order('created_at', { ascending: false })

   return (
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
         {blogs?.map((blog) => {
            return (
               <div key={blog.id}>
                  <BlogCard blog={blog} belongsToAuthUser={blog.created_by === user?.id} />
               </div>
            )
         })}
      </div>
   )
}

export default BlogList
