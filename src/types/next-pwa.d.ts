declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: any[];
    buildExcludes?: string[];
    scope?: string;
    sw?: string;
    fallbacks?: {
      document?: string;
      image?: string;
      font?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
  }

  type WithPWA = (config?: PWAConfig) => (nextConfig: NextConfig) => NextConfig;

  const withPWA: WithPWA;

  export default withPWA;
} 