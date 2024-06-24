import { defineConfig } from "cypress";
 
export default defineConfig({
  e2e: {
    baseUrl: 'https://onroutebc-1327-frontend.apps.silver.devops.gov.bc.ca',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
    experimentalWebKitSupport: true,
  },
  
  env: {
    baseUrl: 'https://onroutebc-1327-frontend.apps.silver.devops.gov.bc.ca/',
    LOGIN_URL: 'https://logontest7.gov.bc.ca',
    PAYBC_URL: 'https://www.beanstream.com',
  }
});