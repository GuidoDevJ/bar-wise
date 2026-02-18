import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'tiendaabrasadorencasa.com' },
      { hostname: 'cdn7.kiwilimon.com' },
      { hostname: 'aiejxpvrpgiclnjhhcot.supabase.co' },
      { hostname: 'airescriollos.com.ar' },
      { hostname: 'www.infobae.com' },
      { hostname: 'cookpad.com' },
      { hostname: 'a-manger.com' },
      { hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
