'use client'

import { Button } from '@/components/ui/button'
import { createWebClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function LogoutButton() {
   const router = useRouter()

   const logout = async () => {
      const supabase = createWebClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
      toast.info('Successfully logged out')
   }

   return <Button onClick={logout}>Logout</Button>
}
