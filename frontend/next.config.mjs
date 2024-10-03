/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from any remote source
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // Allow any hostname
        port: "",
        pathname: "**", // Allow any path
      },
      {
        protocol: "http",
        hostname: "*", // Allow any hostname
        port: "",
        pathname: "**", // Allow any path
      },
    ],
  },
};

export default nextConfig;
