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
      bceid_username: 'ORBCTST1', 
      bceid_password: 'orbcTST2023+',
      update_term_oversize_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/applications/581', 
      new_tros_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/create-application/TROS', 
      new_trow_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/create-application/TROW', 
    },
  },
});
