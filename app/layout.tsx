import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist } from 'next/font/google'
import './globals.css'

const defaultUrl = process.env.VERCEL_URL
   ? `https://${process.env.VERCEL_URL}`
   : 'http://localhost:3000'

export const metadata: Metadata = {
   metadataBase: new URL(defaultUrl),
   title: 'Blog App',
   description: 'A nice blog app'
}

const geistSans = Geist({
   variable: '--font-geist-sans',
   display: 'swap',
   subsets: ['latin']
})

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang='en' suppressHydrationWarning>
         <body className={`${geistSans.className} antialiased`}>
            <ThemeProvider
               attribute='class'
               defaultTheme='light'
               enableSystem
               disableTransitionOnChange
            >
               <Toaster
                  position='top-center'
                  toastOptions={{
                     classNames: {
                        success:
                           '!border-green-200 !bg-green-50 !text-green-800 [&_svg]:!text-green-600 [&>*>svg]:!text-green-600',
                        error: '!border-red-200 !bg-red-50 !text-red-800 [&_svg]:!text-red-500 [&>*>svg]:!text-red-500',
                        warning:
                           '!border-orange-400 !bg-orange-50 !text-orange-500 [&_svg]:!text-orange-500 [&>*>svg]:!text-orange-500',
                        info: '!border-blue-200 !bg-blue-50 !text-blue-800 [&_svg]:!text-blue-500 [&>*>svg]:!text-blue-500'
                     }
                  }}
               />
               {children}
            </ThemeProvider>
         </body>
      </html>
   )
}
