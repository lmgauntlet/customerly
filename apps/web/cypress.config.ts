import { defineConfig } from 'cypress'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3002',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // Add env variables from process.env
      config.env = {
        ...config.env,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
        TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
        NODE_ENV: 'test'
      }
      
      // Set environment variables for the app
      process.env = {
        ...process.env,
        NODE_ENV: 'test'
      }
      
      return config
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
