/** @type {import('next').NextConfig} */
const prefix = process.env.NEXT_PUBLIC_PREFIX;
const nextConfig = {
  basePath: prefix || "",
  assetPrefix: prefix || "",
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-notification",
    "rc-tooltip",
    "rc-input",
    "rc-table",
  ],
  eslint: { ignoreDuringBuilds: process.env.NODE_ENV !== "production" },
  rewrites: async () => {
    if (process.env.NEXT_PUBLIC_ENV !== "local") return [];
    
    return [
      // กัน NextAuth
      {
        source: '/api/auth/:slug*',
        destination: `/api/auth/:slug*`,
      },
      
      // API ไป backend
      {
        source: "/api/:slug*",
        destination: `${process.env.NEXT_PUBLIC_BASE_API}/api/:slug*`,
        basePath: false,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;
