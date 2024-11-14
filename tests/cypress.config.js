const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca',
    env: {
      idir_username: '', 
      idir_password: '',
      bceid_username: '', 
      bceid_password: '',
      update_term_oversize_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/applications/581',  
    },
  },
});
