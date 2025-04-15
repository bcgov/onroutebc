const wait_time = Cypress.env('wait_time');

Cypress.Commands.add('userLoginBceid', () => {
    const wait_time = Cypress.env('wait_time');
    const username = Cypress.env('bceid_username');
    const password = Cypress.env('bceid_password');
    // Step 1: Visit the base URL
    cy.visit('/');

    // Step 2: Find and click the login button by its idir
    cy.get('#login-bceid').click();
    cy.wait(wait_time);

    // Step 3: Enter credentials
    cy.get('#user').type(username); 
    cy.get('#password').type(password);
    cy.wait(wait_time);

    // Step 4: Submit the login form
    cy.get('[name="btnSubmit"]').click();
    cy.wait(wait_time);

  });

  Cypress.Commands.add('userLoginIdir', () => {
    const wait_time = Cypress.env('wait_time');
    const username = Cypress.env('idir_username');
    const password = Cypress.env('idir_password');
    // Step 1: Visit the base URL
    cy.visit('/');

    // Step 2: Find and click the login button by its idir
    cy.get('#login-idir').click();
    cy.wait(wait_time);

    // Step 3: Enter credentials
    cy.get('#user').type(username); 
    cy.get('#password').type(password);
    cy.wait(wait_time);

    // Step 4: Submit the login form
    cy.get('[name="btnSubmit"]').click();
    cy.wait(wait_time);

  });

  Cypress.Commands.add('loginAs', (user_role) => {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.userLoginBceid();
    }
    else{
      cy.userLoginIdir();
    }
  });

  Cypress.Commands.add('search', (company_name) => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_name);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

  });
  