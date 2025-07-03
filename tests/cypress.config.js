const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca',
    env: {
      username: '', 
      password: '',
      rolesToCompanies: {
        pc: 'Herman, Pfannerstill and Huels Trucking',
        sa: 'Test Transport Inc.',
        train: 'Rodriguez-Kertzmann Trucking',
        fin: "Abshire, Rempel and O'Keefe Trucking",
        ctpo: 'Kemmer-Stiedemann Trucking',
        eo: 'Grimes-Spinka Trucking',
        hqa: 'Bartell and Sons Trucking'
      }
    },
  },
});
