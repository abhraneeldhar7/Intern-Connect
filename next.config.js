/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['utfs.io', 'uploadthing.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore optional MongoDB dependencies that aren't needed
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(aws4|mongodb-client-encryption|kerberos|@mongodb-js\/zstd|snappy|gcp-metadata|mongodb-connection-string-url)$/,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;

