/// <reference types="cypress" />

describe('Default Page Test', () => {
    it('Visits the default page and checks for "onRouteBC"', () => {
      const baseUrl = Cypress.env('CYPRESS_baseUrl');
      if (!baseUrl) {
        throw new Error('Base URL is not defined in environment variables');
      }
      const path = '/';
      const url = baseUrl + path;
      cy.visit(url); 
      cy.contains('onRouteBC').should('exist');
      cy.contains('Log in with BCeID').should('exist');
      cy.contains('Log in with IDIR').should('exist');
    });
  });

  describe('Log in with BCeID button', () => {
    it('Redirects to another page when "Log in with BCeID" button is clicked', () => {
      cy.visit(baseUrl);
      cy.contains('Log in with BCeID').click();
      cy.url().then((url) => {
      cy.log('Current URL:', url);
      expect(url).to.include(baseUrl);
      });
    });
  });

  
