import { createStaticFetch } from '@/lib/supabase/server'
import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'

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
