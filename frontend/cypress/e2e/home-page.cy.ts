/// <reference types="cypress" />

describe('Default Page Test', () => {
    it('Visits the default page and checks for "onRouteBC"', () => {
      cy.visit('/'); 
      cy.contains('onRouteBC').should('exist');
      cy.contains('Log in with BCeID').should('exist');
      cy.contains('Log in with IDIR').should('exist');
    });
  });

  describe('Log in with BCeID button', () => {
    it('Redirects to another page when "Log in with BCeID" button is clicked', () => {
      cy.visit('/');
      cy.contains('Log in with BCeID').click();
      cy.url().then((url) => {
      cy.log('Current URL:', url);
      });
    });
  });

  
