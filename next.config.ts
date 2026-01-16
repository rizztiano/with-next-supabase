import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   cacheComponents: true,
   images: {
      domains: [process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '')]
      // or, if you already use remotePatterns, use that instead (see below)
   },
   experimental: {
      serverActions: {
         bodySizeLimit: '20mb'
      }
   }
}

export default nextConfig
