import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { hostname: 'tiendaabrasadorencasa.com' },
      { hostname: 'cdn7.kiwilimon.com' },
      { hostname: 'aiejxpvrpgiclnjhhcot.supabase.co' },
      { hostname: 'ofgwoszaxtwwuvkvzqon.supabase.co' },
      { hostname: 'airescriollos.com.ar' },
      { hostname: 'www.infobae.com' },
      { hostname: 'cookpad.com' },
      { hostname: 'a-manger.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
