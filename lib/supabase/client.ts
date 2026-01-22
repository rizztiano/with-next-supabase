import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'

export function createStaticFetch(options: Pick<RequestInit, 'next' | 'cache'> = {}) {
   return (url: string | URL | Request, init?: RequestInit) =>
      fetch(url, {
         ...init,
         next: {
            revalidate: 3600,
            tags: ['blogs'],
            ...options.next
         },
         cache: options.cache ?? 'force-cache'
      })
}

export function createWebClient() {
   return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
         global: {
            fetch: createStaticFetch()
         }
      }
   )
}
