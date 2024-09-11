/** @type {import('next').NextConfig} */
// https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started
import withPWAInit from "@ducanh2912/next-pwa";
import defaultSwCache from "@/swcache";

const withPWA = withPWAInit({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      ...defaultSwCache,
      {
        urlPattern:
          /^https:\/\/data\.ninjakiwi\.com\/btd6\/maps\/map\/[A-Z]{7}\/preview$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "btd6-map-previews",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https:\/\/static-api\.nkstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "btd6-static-assets",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https:\/\/mediabtd6maplist\.sarto\.dev\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "maplist-static-images",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: ({ url }) =>
          process.env.NEXT_PUBLIC_API_URL.startsWith(url.origin),
        handler: "NetworkFirst",
        options: {
          cacheName: "maplist-api",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60,
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
});

const nextConfig = {
  output: "standalone",
};

export default withPWA(nextConfig);
