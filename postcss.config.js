module.exports = {
  plugins: [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],
    [
      "@fullhuman/postcss-purgecss",
      {
        content: ["./src/**/*.{js,jsx,ts,tsx}"],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: [
            /html/,
            /body/,
            // Toasts
            /bg-danger$/,
            /bg-success$/,
            // Modals
            /modal(?:-(?:backdrop|content|body|lg))?$/,
            /modal-dialog(?:-(?:centered))?$/,
          ],
          deep: [
            // UserEntry
            /fs-(?:\w\w-)4$/,
            /d-(?:\w\w-)?(?:block|none)$/,
          ],
          greedy: [/tooltip/, /toast/, /fade/, /offcanvas/, /collaps/, /show/],
        },
      },
    ],
  ],
};
