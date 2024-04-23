/// <reference types="cypress" />

import cypress from "cypress";

  describe('Login and start application till payment complete', () => {
    it('should complete an application from scratch with an existing test acount', () => {
    const baseUrl = Cypress.env('baseUrl');
    const url = baseUrl + 'applications'
    cy.visit(url)
    cy.url().as('url')
    // cy.get('@url').should('eq', url)
    cy.wait(5000);
    // cy.contains('Start Application').should('exist');
    cy.contains('Log in with BCeID').click();
      cy.url().then((url) => {
      cy.log('Current URL:', url);
      // expect(url).to.include(baseUrl);
      });

    // // Visit the login page and log in with credentials
    // const loginUrl = Cypress.env('LOGIN_URL');
    // cy.log('bruce test 1: ', loginUrl);
    // cy.origin(loginUrl, () => {
    //   cy.get("#user").should('exist'); 
    //   const testUser = Cypress.env('TEST_USER');
    //   const testPassword = Cypress.env('TEST_PASSWORD');
    //   cy.get('#user').type(testUser)
    //   cy.get('#password').type(testPassword)
    //   cy.get('.btn-primary').click()
    // })


    cy.get("#user").should('exist'); 
      const testUser = Cypress.env('CYPRESS_USERNAME');
      const testPassword = Cypress.env('CYPRESS_PASSWORD');
      cy.get('#user').type(testUser)
      cy.get('#password').type(testPassword)
      cy.get('.btn-primary').click()

      cy.url().then((url) => {
        cy.log('Current URL:', url);
        // expect(url).to.include('applications');
        cy.contains('onRouteBC').should('exist');
        cy.contains('Start Application').should('exist');
        // cy.contains('Start Application').should('be.visible').click();
        });

        cy.url().as('url')
        // cy.get('@url').should('include', 'applications')
        cy.wait(5000)
        cy.url().then((url) => {
        expect(url).to.include(baseUrl);

        // click start application button
        cy.get('.start-application-action__btn').first().click({ force: true });
        
        // select vehicle
        cy.get('[data-testid="select-vehicle-autocomplete"]').invoke('attr', 'value', '61');
        const selectVehicle = Cypress.env('CYPRESS_SELECT_VEHICLE')
        cy.get('[data-testid="select-vehicle-autocomplete"]').type(selectVehicle);
        cy.get('[data-testid="select-vehicle-autocomplete"]').trigger('mousemove', { clientX: 0, clientY: 50 }).click().type('{enter}');
        cy.contains(selectVehicle).click();
        cy.get('[data-testid="continue-application-button"]').click();

        // enable checkboxes
        cy.get('[data-testid="permit-attestation-checkbox"]').each(($checkbox) => {
          cy.wrap($checkbox).click();
        });

        // process to pay
        cy.get('[data-testid="continue-btn"]').click();

        // //pay now click
        cy.contains('Pay Now').should('exist');
        cy.contains('Pay Now').click();

        cy.wait(5000);
        // redirect to pay bc
        // cy.url().should('include', 'https://'); 
        const paybcUrl = Cypress.env('CYPRESS_PAYBC_URL');
        cy.origin(paybcUrl, () => {
          const trnCardNumber = Cypress.env('CYPRESS_CC_NUMBER');
          const trnExpMonth = Cypress.env('CYPRESS_CC_EXPMONTH');
          const trnExpYear = Cypress.env('CYPRESS_CC_EXPYEAR');
          const trnCardCvd = Cypress.env('CYPRESS_CC_CVD');
          cy.get("#trnCardNumber").type(trnCardNumber);
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
