const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // 👈 tells Cypress where your app is running
    setupNodeEvents(on, config) {
      // node event listeners (you can leave this empty for now)
    },
    env: {
      NEXT_PUBLIC_USE_FIREBASE_EMULATOR: "true", // 👈 forces your frontend to use emulator
    },
  },
});
