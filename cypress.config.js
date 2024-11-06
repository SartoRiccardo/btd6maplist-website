const { defineConfig } = require("cypress");
const { cloudPlugin } = require("cypress-cloud/plugin");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return cloudPlugin(on, config);
    },
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 10_000,
    retries: { runMode: 3, openMode: 0 },
  },
});
