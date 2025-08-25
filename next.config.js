/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⚠️ Only ignores ESLint on Vercel/production builds.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
