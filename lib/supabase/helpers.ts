import { createWebClient } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'
import { UserIdentity } from '@supabase/supabase-js'

export const sbGetDisplayName = async (): Promise<string | undefined> => {
   const supabase = await createClient()

   const {
      data: { user }
   } = await supabase.auth.getUser()

   return (user?.identities as UserIdentity[])[0].identity_data?.display_name
}

export const sbServerIsAuthenticated = async (): Promise<boolean> => {
   const supabase = await createClient()

   const {
      data: { user }
   } = await supabase.auth.getUser()

   return user !== null
}

export const sbClientIsAuthenticated = async (): Promise<boolean> => {
   const supabase = createWebClient()

   const {
      data: { user }
   } = await supabase.auth.getUser()

   return user !== null
}
