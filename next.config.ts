import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline'
  },
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  sw: 'sw.js',
  buildExcludes: ['middleware-manifest.json']
});

export default pwaConfig(nextConfig);
