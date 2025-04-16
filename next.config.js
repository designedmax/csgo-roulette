/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MARKET_CSGO_API_KEY: process.env.MARKET_CSGO_API_KEY
  },
  images: {
    domains: ['market.csgo.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'market.csgo.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://telegram.org'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 