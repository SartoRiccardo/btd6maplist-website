/** @type {import('next').NextConfig} */
// https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static-api.nkstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "data.ninjakiwi.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/list",
        destination: "/maplist",
        permanent: true,
      },
      {
        source: "/experts",
        destination: "/expert-list",
        permanent: true,
      },
      {
        source: "/list/leaderboard",
        destination: "/leaderboard",
        permanent: true,
      },
    ];
  },
};

const runtimeCaching = [
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts-webfonts",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },

  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "google-fonts-stylesheets",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },

  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-font-assets",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },

  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-image-assets",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },

  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "next-image",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },

  {
    urlPattern: /\.(?:js)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-js-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },

  {
    urlPattern: /\.(?:css|less)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-style-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },

  {
    urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "next-data",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },

  {
    urlPattern: /\.(?:json|xml|csv)$/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "static-data-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },

  {
    urlPattern: ({ event, url }) => {
      const isSameOrigin = self.origin === url.origin;
      const { pathname } = url;
      return (
        !event.request.headers.get("Next-Router-Prefetch") &&
        isSameOrigin &&
        !pathname.startsWith("/api/")
      );
    },
    handler: "NetworkFirst",
    options: {
      cacheName: "others",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60,
      },
      networkTimeoutSeconds: 10,
    },
  },

  {
    urlPattern: ({ url, event }) => {
      const isSameOrigin = self.origin === url.origin;
      const { pathname } = url;
      return (
        event.request.headers.get("Next-Router-Prefetch") &&
        isSameOrigin &&
        !pathname.startsWith("/api/")
      );
    },
    handler: "CacheFirst",
    options: {
      cacheName: "others-prefetch",
      expiration: {
        maxEntries: 128,
        maxAgeSeconds: 60,
      },
    },
  },

  {
    urlPattern:
      /^https:\/\/data\.ninjakiwi\.com\/btd6\/maps\/map\/[A-Z]{7}\/preview$/i,
    handler: "CacheFirst",
    options: {
      cacheName: "btd6-map-previews",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },

  {
    urlPattern: /^https:\/\/static-api\.nkstatic\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "btd6-static-assets",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },

  {
    urlPattern: /^https:\/\/mediabtd6maplist\.sarto\.dev\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "maplist-static-images",
      expiration: {
        maxEntries: 16,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
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
        maxAgeSeconds: 24 * 60 * 60,
      },
      networkTimeoutSeconds: 10,
    },
  },
];

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: false,
  reloadOnOnline: false,
  workboxOptions: { runtimeCaching },
});

export default withPWA(nextConfig);
