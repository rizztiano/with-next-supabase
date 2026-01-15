import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   cacheComponents: true,
   compiler: {
      removeConsole: false
   }
}

export default nextConfig
