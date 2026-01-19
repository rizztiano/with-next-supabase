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
   experimental: {
      serverActions: {
         bodySizeLimit: '20mb'
      }
   }
}

export default nextConfig
