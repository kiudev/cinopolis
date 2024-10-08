/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      unoptimized: true,
      remotePatterns: [
         {
            protocol: "https",
            hostname: "image.tmdb.org",
         },
         {
            protocol: "https",
            hostname: "i0.wp.com",
         },
      ],
   },
};

export default nextConfig;
