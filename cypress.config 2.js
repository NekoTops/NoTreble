module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    env: {
      TEST_EMAIL: process.env.TEST_EMAIL,
      TEST_PASSWORD: process.env.TEST_PASSWORD,
      NEXT_PUBLIC_USE_FIREBASE_EMULATOR: "true"
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
