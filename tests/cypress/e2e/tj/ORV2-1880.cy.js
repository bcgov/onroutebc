import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_ppc = Cypress.env('user_ppc');
  let user_role = user_ppc['user_role'];

const loginLogoutAs = (user_role, assertionFn)=> {
    let username = null;
    let password = null;
    switch (user_role) {
      case 'ppc':
        username = user_ppc['username'];
        password = user_ppc['password'];
        break;
    }
    cy.loginAs(user_role, username, password);
    assertionFn();
  }

const expectResultLoginLogout = () => {
    // TBD
  }

  const expectSuccessLoginLogout = () => {
    // TBD
  }

const navigateToCompanySettings = (company_name) => {
    cy.search(company_name);
    cy.wait(wait_time);
    cy.contains('a', company_name).click();
    cy.wait(wait_time);
    cy.contains('a', 'Settings').click();
    cy.wait(wait_time);
}

describe('Scenario 1', () => {
  // Test 1
  it('should allow PPC Clerk to view suspension history for suspended company', () => {
    user_role = user_ppc['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    navigateToCompanySettings('suspended_company');

    cy.get('.suspension-section').within(() => {
        cy.get('.suspension-history').should('exist');
        
        cy.get('.history-table').within(() => {
            cy.contains('th', 'IDIR').should('exist');
            cy.contains('th', 'Date').should('exist');
            cy.contains('th', 'Reason').should('exist');
            cy.contains('th', 'Status').should('exist');
        });
    });

  });

});

describe('Scenario 2', () => {
  // Test 1
  it('should allow PPC Clerk to view suspension history for previously suspended but active company', () => {
    user_role = user_ppc['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    navigateToCompanySettings('previously_suspended_company');

    cy.get('.suspension-section').within(() => {
        cy.get('.suspension-history').should('exist');
        
        cy.get('.history-table').within(() => {
            cy.contains('th', 'IDIR').should('exist');
            cy.contains('th', 'Date').should('exist');
            cy.contains('th', 'Reason').should('exist');
            cy.contains('th', 'Status').should('exist');
        });
    });

  });

});