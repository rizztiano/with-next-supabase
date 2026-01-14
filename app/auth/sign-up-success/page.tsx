import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Page() {
   return (
      <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
         <div className='w-full max-w-sm'>
            <div className='flex flex-col gap-6'>
               <Card>
                  <CardHeader>
                     <CardTitle className='text-2xl'>Thank you for signing up!</CardTitle>
                     <CardDescription>
                        You can now <Link className='text-green-600' href={'/auth/login'}>login</Link>.
                     </CardDescription>
                  </CardHeader>
               </Card>
            </div>
         </div>
      </div>
   )
}
