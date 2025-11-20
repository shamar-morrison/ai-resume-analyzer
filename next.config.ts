import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    typedEnv: true,
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

export default nextConfig
