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
      user_role: 'eo', // pc, sa, train, fin, ctpo, eo, hqa
      wait_time: 500,
      rolesToCompanies: {
        pc: 'Herman, Pfannerstill and Huels Trucking',
        sa: 'Test Transport Inc.',
        train: 'Rodriguez-Kertzmann Trucking',
        fin: "Abshire, Rempel and O'Keefe Trucking",
        ctpo: 'Kemmer-Stiedemann Trucking',
        eo: 'Grimes-Spinka Trucking',
        hqa: 'Bartell and Sons Trucking'
      },

      // for bceid login testing
      user_ca: { 
        username: '', 
        password: '2025#',
        user_role: 'ca',
        company_name: 'Test Transport Inc.'
       },

      user_pa: { 
        username: '', 
        password: '',
        user_role: 'pa',    
        company_name: 'Herman, Pfannerstill and Huels Trucking'
      },

      // for idir login testing
      user_fin: { 
        username: '', 
        password: '',
        user_role: 'fin',
        company_name: 'Test Transport Inc.'
       },

      user_eo: { 
        username: '', 
        password: '',
        user_role: 'eo',
        company_name: 'Test Transport Inc.'
       },

      user_hqa: { 
        username: '', 
        password: '',
        user_role: 'hqa',
        company_name: 'Test Transport Inc.'
       },

      user_sa: { 
        username: '', 
        password: '',
        user_role: 'sa',
        company_name: 'Test Transport Inc.'
       },

      user_ppc: { 
        username: '', 
        password: '',
        user_role: 'ppc',
        company_name: 'Test Transport Inc.'
       },

      user_trainee: { 
        username: '', 
        password: '',
        user_role: 'trainee',
        company_name: 'Test Transport Inc.'
       },

      user_ctpo: { 
        username: '', 
        password: '',
        user_role: 'ctpo',
        company_name: 'Test Transport Inc.'
       },
    },
  },
});
