/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['picsum.photos', 'squareupsandbox.com'],
    },
    // You can add more configurations here
  };

export default nextConfig;
