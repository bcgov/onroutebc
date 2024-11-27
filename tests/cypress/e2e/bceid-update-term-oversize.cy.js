describe('Login Test for OnRouteBC', () => {
  it('Should navigate to the login page, find the login button, and enter credentials', () => {
    // Retrieve the environment variables
    const username = Cypress.env('bceid_username');
    const password = Cypress.env('bceid_password');
    // const update_term_oversize_url = Cypress.env('update_term_oversize_url');

    // Step 1: Visit the base URL
    cy.visit('/');

    // Step 2: Find and click the login button by its idir
    cy.get('#login-bceid').click();
    cy.wait(5000);

    // Step 3: Enter credentials
    cy.get('#user').type(username); 
    cy.get('#password').type(password);
    cy.wait(5000);

    // Step 4: Submit the login form
    cy.get('[name="btnSubmit"]').click();
    cy.wait(5000);

    cy.visit('/applications/12');
    cy.wait(5000);

    // update phone ext
    cy.get('[name="permitData.contactDetails.phone1Extension"]').clear().type('0003');
    cy.wait(5000);

    // save updates
    cy.get('[data-testid="save-application-button"]').click();
    cy.wait(5000);
  });
});
