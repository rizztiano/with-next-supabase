'use server'

import { createClient } from '@/lib/supabase/server'
import { AuthResponse } from '@supabase/supabase-js'

export const createProfile = async (user: AuthResponse['data']['user']) => {
   const supabase = await createClient()

   const { error } = await supabase.from('profile').insert({
      id: user?.id,
      email: user?.email as string,
      name: user?.user_metadata.display_name
   })

   if (error) throw new Error(error.message)
}
