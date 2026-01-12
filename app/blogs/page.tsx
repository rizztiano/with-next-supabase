import { createClient } from '@/lib/supabase/server'
import { UserIdentity } from '@supabase/supabase-js'

export default async function ProtectedPage() {
   const supabase = await createClient()
   const {
      data: { user }
   } = await supabase.auth.getUser()

   console.log(user)

   return (
      <div className="flex-1 w-full flex flex-col gap-12">
         hoy! {(user?.identities as UserIdentity[])[0].identity_data?.display_name}
      </div>
   )
}
