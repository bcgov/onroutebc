/// <reference types="cypress" />

import cypress from "cypress";

  describe('Login and start application till payment complete with pay bc', () => {
    it('should complete an application from scratch with an existing test acount', () => {
    cy.visit('applications')
    cy.url().as('url')
    // cy.get('@url').should('eq', url)
    cy.wait(5000);
    // cy.contains('Start Application').should('exist');
    cy.contains('Log in with BCeID').click();
      cy.url().then((url) => {
      cy.log('Current URL:', url);
      // expect(url).to.include(baseUrl);
      });

    // Visit the login page and log in with credentials
    const loginUrl = Cypress.env('LOGIN_URL');
    cy.get("#user").should('exist'); 
      const testUser = Cypress.env('TEST_USER');
      const testPassword = Cypress.env('TEST_PASSWORD');
      cy.log('testUser:',testUser);
      cy.log('testPassword:',testPassword);
      cy.get('#user').type(testUser)
      cy.get('#password').type(testPassword)
      cy.get('.btn-primary').click()

      cy.url().then((url) => {
        cy.log('Current URL:', url);
        cy.contains('onRouteBC').should('exist');
        cy.contains('Start Application').should('exist');
        });

        cy.url().as('url')
        cy.wait(5000)
        cy.url().then((url) => {
        expect(url).to.include(Cypress.config().baseUrl);

        // click start application button
        cy.get('.start-application-action__btn').first().click({ force: true });
        
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

        // //pay now click
        cy.contains('Pay Now').should('exist');
        cy.contains('Pay Now').click();

        // cy.wait(3000);


        // // Get the paybc url after the redirect
        // cy.location().then(location => {
        //   const paybcUrl = location.href;
        //   // Use the new URL as needed
        //   cy.log('paybc URL:', paybcUrl);

        //   cy.visit(paybcUrl);

        //   // After visiting the new URL, you can access the body contents
        //   cy.get('body').then($body => {
        //     // Do something with the body contents
        //     cy.log('Body contents:', $body.text());
        //   });
        // });

        cy.wait(5000);
        // redirect to pay bc
        // cy.url().should('include', 'https://'); 
        const paybcUrl = Cypress.env('PAYBC_URL');
        cy.origin(paybcUrl, () => {
          const trnCardNumber = Cypress.env('CC_NUMBER');
          const trnExpMonth = Cypress.env('CC_EXPMONTH');
          const trnExpYear = Cypress.env('CC_EXPYEAR');
          const trnCardCvd = Cypress.env('CC_CVD');
          cy.get('[name="trnCardNumber"]').type(trnCardNumber);
          cy.get('[name="trnExpMonth"]').select(trnExpMonth);
          cy.get('[name="trnExpYear"]').select(trnExpYear);
          cy.get('#trnCardCvd').type(trnCardCvd);
          cy.get('[name="submitButton"]').click();     
        })

        // verify if payment succeeded
        cy.contains('Success').should('exist');
      });
  })

});
