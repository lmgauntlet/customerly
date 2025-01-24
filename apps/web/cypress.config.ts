import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3002',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  retries: {
    runMode: 2,
    openMode: 0
  },
  defaultCommandTimeout: 10000,
  viewportWidth: 1280,
  viewportHeight: 720,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
