import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   cacheComponents: true,
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', ''),
            pathname: '/**'
         }
      ]
   },
   logging: {
      fetches: {
         fullUrl: true
      }
   },
   experimental: {
      serverActions: {
         bodySizeLimit: '20mb'
      },
      useCache: true
   }
}

export default nextConfig
