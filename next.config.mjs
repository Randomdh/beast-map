/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.akidcalledbeast.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://129.158.41.81:3100/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
