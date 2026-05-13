import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

};

module.exports = {
  // other Next.js configuration options...
  turbopack: {
    root: './app', // specify the root directory for Turbopack
  },
};

export default nextConfig;
