import { defineConfig } from 'cypress';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';
import mochawesome from 'cypress-mochawesome-reporter/plugin';

const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const API_BASE_URL = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';
const isMobile = process.env.MOBILE === '1';

export default defineConfig({
  // Pixel 7 sized viewport for the mobile run. Cypress resizes the viewport only:
  // no touch events, device pixel ratio or mobile user agent (see ADR 0003).
  viewportWidth: isMobile ? 412 : 1280,
  viewportHeight: isMobile ? 915 : 800,
  defaultCommandTimeout: 5_000,
  retries: { runMode: 1, openMode: 0 },
  video: false,
  screenshotOnRunFailure: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/html',
    reportPageTitle: 'Cypress QA Showcase',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  expose: {
    apiUrl: API_BASE_URL,
    isMobile,
  },
  e2e: {
    baseUrl: UI_BASE_URL,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    testIsolation: true,
    setupNodeEvents(on, config) {
      mochawesome(on);
      on('task', {
        // Prints to the terminal (and CI log), used for axe violation summaries.
        log(message: string) {
          console.log(message);
          return null;
        },
      });
      cypressGrepPlugin(config);
      return config;
    },
  },
});
