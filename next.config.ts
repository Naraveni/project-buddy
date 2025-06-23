import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
   NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vsmfojarkowcnfobdgze.supabase.co', // your Supabase project hostname
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
