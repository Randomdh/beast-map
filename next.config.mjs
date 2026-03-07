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
};

export default nextConfig;
