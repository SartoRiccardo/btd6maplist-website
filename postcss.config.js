const purgeCssConf =
  process.env.NODE_ENV === "development"
    ? []
    : [
        "@fullhuman/postcss-purgecss",
        {
          content: ["./src/**/*.{js,jsx,ts,tsx}"],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          safelist: {
            standard: [
              /* Preset */
              /html/,
              /body/,

              /* Dynamic */
              // UserEntry
              /fs-(?:\w\w-)4$/,
              /d-(?:\w\w-)?(?:block|none)$/,

              /* React-Bootstrap */
              // Toasts
              /bg-(?:danger|success)$/,
              /toast$/,
              /toast-(?:body)$/, // Components
              // Modals
              /modal$/,
              /modal-(?:backdrop|content|body|dialog)$/, // Components
              /modal-(?:lg)$/, // Sizes
              /modal-dialog-(?:centered)$/, // Dialog
              // Tooltips
              /tooltip$/,
              /tooltip-(?:arrow|inner)$/, // Components
              /bs-tooltip-(?:top)$/, // Placements
              // Collapse
              /collapse$/,
              /collapsing$/,
              // Offcanvas
              /offcanvas$/,
              /offcanvas-(?:header|body)$/, // Components
              /offcanvas-(?:md)$/, // Responsiveness
              /offcanvas-(?:top)$/, // Direction
            ],
            deep: [],
            greedy: [
              /* Transitions */
              /fade/,
              /show/,
            ],
          },
        },
      ];

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
    purgeCssConf,
  ],
};
