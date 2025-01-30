const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // baseUrl: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca',
    baseUrl: 'https://onroutebc-uat-frontend.apps.silver.devops.gov.bc.ca',
    // baseUrl: 'https://onroutebc-1725-frontend.apps.silver.devops.gov.bc.ca',
    // baseUrl: 'https://onroutebc-1729-frontend.apps.silver.devops.gov.bc.ca',
    env: {
      idir_username: 'TRORBCT1', 
      idir_password: 'ydYa,GWCus4q5eGjuPoJ',
      // DEV
      // bceid_username: 'Tomstrucking', 
      // bceid_password: 'Orbc123#',
      // TEST
      // bceid_username: 'ORBCTST1', 
      // bceid_password: 'orbcTST2023+',
      // UAT
      bceid_username: 'ORBCBLANE', 
      bceid_password: 'Ilmylilmm-Dn8',
      
      update_term_oversize_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/applications/581', 
      new_tros_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/create-application/TROS', 
      new_trow_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/create-application/TROW', 
      new_power_unit_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles/add-powerunit',
      update_power_unit_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles/power-units/106',
      manage_vehicle_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles',
      new_trailer_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles/add-trailer',
      update_trailer_url: 'https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca/manage-vehicles/trailers/106',
      wait_time: 5000,
    },
  },
});
