const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca',
    env: {
      idir_username: '', 
      idir_password: ''  
    },
  },
});
