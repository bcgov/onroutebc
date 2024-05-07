import { defineConfig } from "cypress";
 
export default defineConfig({
  e2e: {
    // baseUrl: 'http://localhost:3000',
    baseUrl: 'https://onroutebc-1327-frontend.apps.silver.devops.gov.bc.ca',
    // baseUrl: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
    experimentalWebKitSupport: true,
  },
  // bruce test
  env: {
    // baseUrl: 'http://localhost:3000/',
 
    // test url
    // baseUrl: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/',
    baseUrl: 'https://onroutebc-1327-frontend.apps.silver.devops.gov.bc.ca/',
    // baseUrl: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/',
    LOGIN_URL: 'https://logontest7.gov.bc.ca',
    PAYBC_URL: 'https://www.beanstream.com',
    CC_NUMBER: '4030000010001234',
    CC_CVD: '123',
    CC_EXPMONTH: '12',
    CC_EXPYEAR: '25',
 
    // DEV
    TEST_USER: 'Tomstrucking',
    TEST_PASSWORD: 'Orbc123#',
 
    // // TEST
    // TEST_USER: 'ORBCTST1',
    // TEST_PASSWORD: 'orbcTST2023+',
 
 
    // TEST
    // TEST_USER: 'ORBCTST3',
    // TEST_PASSWORD: 'orbcTST+2023',
 
    SELECT_VEHICLE: '61',
    // SELECT_VEHICLE: 'MCL36',
   
  }
});