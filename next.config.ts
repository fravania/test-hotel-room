import type { NextConfig } from "next";

// Define environment variables with default values for the API URL
const API_URL = process.env.API_URL || 'https://lotus-hms.vercel.app/frontend_api';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL,
  },
  // Make API_URL available on the client side
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: API_URL,
  },
};

export default nextConfig;
