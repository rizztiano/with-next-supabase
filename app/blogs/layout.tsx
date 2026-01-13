import { AuthButton } from '@/components/auth-button'
import { EnvVarWarning } from '@/components/env-var-warning'
import { Separator } from '@/components/ui/separator'
import { hasEnvVars } from '@/lib/utils'
import Link from 'next/link'
import { Suspense } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <main className='min-h-screen flex flex-col items-center'>
         <div className='flex-1 w-full flex flex-col gap-3'>
            <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
               <div className='w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm'>
                  <div className='flex gap-3 items-center font-semibold'>
                     <Link href={'/blogs'}>Home</Link>
                     <Separator orientation='vertical' className='self-stretch !h-[unset]' />
                     <Link className='font-normal text-green-700' href={'/blogs/mine'}>
                        My Blogs
                     </Link>
                     {/* <ThemeSwitcher /> */}
                  </div>
                  {!hasEnvVars ? (
                     <EnvVarWarning />
                  ) : (
                     <Suspense>
                        <AuthButton />
                     </Suspense>
                  )}
               </div>
            </nav>
            <div className='w-full flex justify-center'>
               <div className='flex-1 flex flex-col gap-10 max-w-5xl p-5'>
                  <Suspense>{children}</Suspense>
               </div>
            </div>
         </div>
      </main>
   )
}
