/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: true,
  },
  // Skip database validation during build time
  env: {
    SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION || "true",
    NEXT_PUBLIC_SHOW_MOCK_DATA: process.env.NEXT_PUBLIC_SHOW_MOCK_DATA || "true",
  }
};

module.exports = nextConfig;