const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca',
    env: {
      username: '', 
      password: '',
      update_term_oversize_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/applications/581', 
      new_tros_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/create-application/TROS', 
      new_trow_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/create-application/TROW', 
      new_power_unit_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles/add-powerunit',
      update_power_unit_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles/power-units/106',
      manage_vehicle_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles',
      new_trailer_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles/add-trailer',
      update_trailer_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles/trailers/106',
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
