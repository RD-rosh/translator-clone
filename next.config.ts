import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'links.papareact.com',
          //port: '',
          //pathname: '/account123/**',
          //search: '',
        },
      ],
    },
  //}
};

export default nextConfig;
