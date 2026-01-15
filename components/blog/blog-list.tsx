import { IBlogPageProps } from '@/app/blogs/page'
import BlogCard from '@/components/blog/blog-card'
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious
} from '@/components/ui/pagination'
import { sbServerIsAuthenticated } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'

const BlogList = async ({
   mine,
   searchParams
}: {
   mine: boolean
   searchParams: IBlogPageProps['searchParams']
}) => {
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

   const perPage = 9
   const page = parseInt(searchParams.page) || 1

   const start = (page - 1) * perPage
   const end = page * perPage - 1

   const { count } = await supabase.from('blogs').select('*', { count: 'exact', head: true })
   const totalPages = Math.ceil((count || 0) / perPage)

   const { data: blogs } = await query.order('created_at', { ascending: false }).range(start, end)

   const maxPagesPerPage = totalPages >= 4 ? 4 : totalPages

   const asStart =
      page === 1
         ? 1
         : totalPages - page >= maxPagesPerPage - 1
           ? page
           : totalPages - (maxPagesPerPage - 1)

   const hasPrevious = asStart !== 1
   const hasNext = totalPages - page > maxPagesPerPage - 1

   const paginationRange = Array.from({ length: maxPagesPerPage }, (_, i) => i + asStart)

   return (
      <div className='flex flex-col w-full gap-16'>
         {(blogs?.length as number) > 0 ? (
            <>
               <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
                  {blogs?.map((blog) => {
                     return (
                        <div key={blog.id}>
                           <BlogCard blog={blog} belongsToAuthUser={blog.created_by === user?.id} />
                        </div>
                     )
                  })}
               </div>
               <Pagination>
                  <PaginationContent>
                     <PaginationItem>
                        <PaginationPrevious
                           href={`/blogs/?page=${page - 1}`}
                           className={page <= 1 ? `pointer-events-none opacity-50` : ``}
                        />
                     </PaginationItem>
                     {hasPrevious && (
                        <PaginationItem>
                           <PaginationEllipsis />
                        </PaginationItem>
                     )}
                     {paginationRange.map((thisPage) => {
                        return (
                           <PaginationItem key={thisPage}>
                              <PaginationLink
                                 isActive={thisPage == page}
                                 href={`/blogs/?page=${thisPage}`}
                              >
                                 {thisPage}
                              </PaginationLink>
                           </PaginationItem>
                        )
                     })}
                     {hasNext && (
                        <PaginationItem>
                           <PaginationEllipsis />
                        </PaginationItem>
                     )}
                     <PaginationItem>
                        <PaginationNext
                           href={`/blogs/?page=${page + 1}`}
                           className={page >= totalPages ? `pointer-events-none opacity-50` : ``}
                        />
                     </PaginationItem>
                  </PaginationContent>
               </Pagination>
            </>
         ) : (
            <h1 className='text-orange-700'>No blog entry! make one</h1>
         )}
      </div>
   )
}

export default BlogList
