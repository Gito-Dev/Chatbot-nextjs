/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sportensklad.bg',
        pathname: '/**',
      },
      // Add more patterns if needed, for example:
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/images/**',
      // }
    ],
  },
  // ... any other existing config
}

module.exports = nextConfig 