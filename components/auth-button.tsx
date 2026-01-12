import { sbGetDisplayName } from '@/lib/supabase/helpers'
import Link from 'next/link'
import { LogoutButton } from './logout-button'
import { Button } from './ui/button'

export async function AuthButton() {
   const name = await sbGetDisplayName()

   return name ? (
      <div className="flex items-center gap-4">
         Hey, {name}!
         <LogoutButton />
      </div>
   ) : (
      <div className="flex gap-2">
         <Button asChild size="sm" variant={'outline'}>
            <Link href="/auth/login">Sign in</Link>
         </Button>
         <Button asChild size="sm" variant={'default'}>
            <Link href="/auth/sign-up">Sign up</Link>
         </Button>
      </div>
   )
}
