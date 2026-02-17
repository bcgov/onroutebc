import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_sa = Cypress.env('user_sa');
  let user_role = user_sa['user_role'];

const loginLogoutAs = (user_role, assertionFn)=> {
    let username = null;
    let password = null;
    switch (user_role) {
      case 'sa':
        username = user_sa['username'];
        password = user_sa['password'];
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
  it('should show only suspend option for company never suspended', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    navigateToCompanySettings('never_suspended_company');

    cy.get('.suspension-section').within(() => {
        cy.get('[data-cy="suspend-company-toggle"]').should('exist');
        cy.get('.suspension-history').should('not.exist');
    });

  });

});

describe('Scenario 2', () => {
  // Test 1
  it('should show suspend option and history table for previously suspended company', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    navigateToCompanySettings('previously_suspended_company');

    cy.get('.suspension-section').within(() => {
        cy.get('[data-cy="suspend-company-toggle"]').should('exist');
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

describe('Scenario 3', () => {
  // Test 1
  it('should show suspension confirmation popup with required fields', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    navigateToCompanySettings('active_company');

    cy.get('[data-cy="suspend-company-toggle"]').click();
    cy.wait(wait_time);

    cy.get('.suspension-confirmation').within(() => {
        cy.get('[data-cy="confirm-suspend"]').should('exist');
        cy.get('[data-cy="cancel-suspend"]').should('exist');
        cy.get('[data-cy="suspension-reason"]').should('exist');
    });

  });

});

describe('Scenario 4', () => {
  // Test 1
  it('should suspend company and redirect to suspend details', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    navigateToCompanySettings('active_company');

    cy.get('[data-cy="suspend-company-toggle"]').click();
    cy.wait(wait_time);

    cy.get('.suspension-confirmation').within(() => {
        cy.get('[data-cy="suspension-reason"]').type('Test suspension reason');
        cy.get('[data-cy="confirm-suspend"]').click();
    });

    cy.wait(wait_time);

    cy.url().should('include', '/suspension-details');
    cy.get('.suspension-status').should('contain', 'Suspended');

  });

});