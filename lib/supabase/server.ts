import { Database } from '@/types/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */

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

export async function createRawClient(key: 'anon' | 'secret' = 'secret') {
   const cookieStore = await cookies()

   let secret = ''
   switch (key) {
      case 'anon':
         secret = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
         break
      case 'secret':
         secret = process.env.SUPABASE_SECRET_KEY!
         break
   }

   return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, secret, {
      cookies: {
         getAll() {
            return cookieStore.getAll()
         },
         setAll(cookiesToSet) {
            try {
               cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
               )
            } catch {
               // The `setAll` method was called from a Server Component.
               // This can be ignored if you have proxy refreshing
               // user sessions.
            }
         }
      }
   })
}

export const createClient = cache(() => createRawClient())
