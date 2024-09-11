/** @type {import('next').NextConfig} */
// https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started
import withPWAInit from "@ducanh2912/next-pwa";

const defaultSwCache = [
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

  //   {
  //     urlPattern: /\.(?:mp3|wav|ogg)$/i,
  //     handler: "CacheFirst",
  //     options: {
  //       rangeRequests: true,
  //       cacheName: "static-audio-assets",
  //       expiration: {
  //         maxEntries: 32,
  //         maxAgeSeconds: 24 * 60 * 60, // 24 hours
  //       },
  //     },
  //   },

  //   {
  //     urlPattern: /\.(?:mp4)$/i,
  //     handler: "CacheFirst",
  //     options: {
  //       rangeRequests: true,
  //       cacheName: "static-video-assets",
  //       expiration: {
  //         maxEntries: 32,
  //         maxAgeSeconds: 24 * 60 * 60, // 24 hours
  //       },
  //     },
  //   },

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

  // {
  //   urlPattern: ({ url }) => {
  //     const isSameOrigin = self.origin === url.origin;
  //     if (!isSameOrigin) return false;
  //     const pathname = url.pathname;
  //     // Exclude /api/auth/callback/* to fix OAuth workflow in Safari without impact other environment
  //     // Above route is default for next-auth, you may need to change it if your OAuth workflow has a different callback route
  //     // Issue: https://github.com/shadowwalker/next-pwa/issues/131#issuecomment-821894809
  //     if (pathname.startsWith("/api/auth/")) return false;
  //     if (pathname.startsWith("/api/")) return true;
  //     return false;
  //   },

  //   handler: "NetworkFirst",
  //   method: "GET",
  //   options: {
  //     cacheName: "apis",
  //     expiration: {
  //       maxEntries: 16,
  //       maxAgeSeconds: 24 * 60 * 60, // 24 hours
  //     },
  //     networkTimeoutSeconds: 10, // fall back to cache if api does not response within 10 seconds
  //   },
  // },

  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin;
      const { searchParams, pathname } = url;
      return (
        !searchParams.get("_rsc") &&
        isSameOrigin &&
        !pathname.startsWith("/api/")
      );
    },
    handler: "NetworkFirst",
    options: {
      cacheName: "others",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      networkTimeoutSeconds: 10,
    },
  },

  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin;
      const { searchParams, pathname } = url;
      return (
        searchParams.get("_rsc") &&
        isSameOrigin &&
        !pathname.startsWith("/api/")
      );
    },
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "others-prefetch",
      expiration: {
        maxEntries: 128,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },

  // {
  //   urlPattern: ({ url }) => {
  //     const isSameOrigin = self.origin === url.origin;
  //     return !isSameOrigin;
  //   },
  //   handler: "NetworkFirst",
  //   options: {
  //     cacheName: "cross-origin",
  //     expiration: {
  //       maxEntries: 32,
  //       maxAgeSeconds: 60 * 60, // 1 hour
  //     },
  //     networkTimeoutSeconds: 10,
  //   },
  // },
];

const withPWA = withPWAInit({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  reloadOnOnline: false,
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
            maxEntries: 64,
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
            maxEntries: 64,
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
            maxEntries: 32,
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
