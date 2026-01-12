import { createClient } from '@/lib/supabase/server'
import { UserIdentity } from '@supabase/supabase-js'

export const sbGetDisplayName = async (): Promise<string | undefined> => {
   const supabase = await createClient()

   const {
      data: { user }
   } = await supabase.auth.getUser()

   return (user?.identities as UserIdentity[])[0].identity_data?.display_name
}
