/// <reference types="cypress" />

import cypress from "cypress";

  describe('Login and start application till payment complete', () => {
    it('should complete an application from scratch with an existing test acount', () => {
    cy.visit('applications')
    cy.url().as('url')
    cy.wait(5000);

    // test with IDIR, go for ice pay
    cy.contains('Log in with IDIR').click();
      cy.url().then((url) => {
      cy.log('Current URL:', url);
      });

    // Interact with a different origin using cy.origin()
    cy.origin('https://logontest7.gov.bc.ca', () => {
      // Commands to be run against the new origin
      const loginUrl = Cypress.env('LOGIN_URL');
      cy.get("#user").should('exist'); 
      const testUser = Cypress.env('TEST_USER');
      const testPassword = Cypress.env('TEST_PASSWORD');
      cy.log('testUser:',testUser);
      cy.log('testPassword:',testPassword);
      cy.get('#user').type(testUser)
      cy.get('#password').type(testPassword)
      cy.get('.btn-primary').click()  
    });

      cy.url().then((url) => {
        cy.log('Current URL:', url);
        cy.contains('onRouteBC').should('exist');
        cy.wait(5000);
        cy.get('.search-button').click();
        cy.get('[value="companies"]').click();
        cy.get('.MuiInputBase-input').eq(1).type('pa');
        cy.get('.search-by__search').click();
        cy.wait(3000);
        cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link')
          .contains('Parisian LLC Trucking')
          .scrollIntoView()
          .should('be.visible')
          .click();
        });

        cy.url().as('url')
        cy.wait(5000)
        cy.url().then((url) => {
        expect(url).to.include(Cypress.config().baseUrl);

        // click start application button
        cy.get('.start-application-action__btn').first().click({ force: true });

        cy.get('[data-testid="input-permitData.contactDetails.firstName"]').type('Bruce');
        cy.get('[data-testid="input-permitData.contactDetails.lastName"]').type('Wang');
        cy.get('[name="permitData.contactDetails.phone1"]').type('+1 (250) 986-6235');
        
        // select vehicle
        cy.get('[data-testid="select-vehicle-autocomplete"]').invoke('attr', 'value', '61');
        const selectVehicle = Cypress.env('SELECT_VEHICLE')
        cy.get('[data-testid="select-vehicle-autocomplete"]').type(selectVehicle);
        cy.get('[data-testid="select-vehicle-autocomplete"]').trigger('mousemove', { clientX: 0, clientY: 50 }).click().type('{enter}');
        cy.contains(selectVehicle).click();

        cy.wait(3000)
        cy.get('[data-testid="continue-application-button"]').wait(1000).click();

        cy.wait(10000)
        // enable checkboxes
        cy.get('[data-testid="permit-attestation-checkbox"]').each(($checkbox) => {
          cy.wrap($checkbox).click();
        });

        // process to pay
        cy.get('[data-testid="continue-btn"]').click();

        cy.get('[role="combobox"]').contains('Select').click();
        cy.get('[data-value="VI"]').contains('Visa').click();
        cy.get('[name="transactionId"]').type('123456');

        //pay now click
        cy.contains('Pay Now').should('exist');
        cy.contains('Pay Now').click();

        // verify if payment succeeded
        cy.contains('Success').should('exist');
        
      });
  })

});
