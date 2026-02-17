import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_eo = Cypress.env('user_eo');
  let user_role = user_eo['user_role'];

const loginLogoutAs = (user_role, assertionFn)=> {
    let username = null;
    let password = null;
    switch (user_role) {
      case 'eo':
        username = user_eo['username'];
        password = user_eo['password'];
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
  
  const expectFailureLoginLogout = () => {
    // TBD
  }

describe('Scenario 1', () => {
  // Test 1
  it('should log in using valid IDIR credentials and store user information', () => {
    user_role = user_eo['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    cy.url().should('include', '/search');
    cy.get('.user-info').should('contain', 'IDIR');
    
    cy.get('.sticky-sidebar').should('be.visible');
    cy.get('.search-icon').should('be.visible');

    cy.request('/api/user').then((response) => {
      expect(response.body).to.have.property('idir_user_guid');
      expect(response.body).to.have.property('idir_username');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('email');
    });

  });

});

describe('Scenario 2', () => {
  // Test 1
  it('should show error message with invalid IDIR credentials', () => {
    cy.visit('/login');
    
    cy.get('[data-cy="idir-login"]').click();
    
    cy.get('[data-cy="username"]').type('invalid_idir');
    cy.get('[data-cy="password"]').type('invalid_password');
    cy.get('[data-cy="login-button"]').click();
    
    cy.get('.error-message').should('contain', 'The username or password you entered is incorrect');
    cy.url().should('include', '/login');

  });

  // Test 2
  it('should show error message with valid IDIR but wrong password', () => {
    cy.visit('/login');
    
    cy.get('[data-cy="idir-login"]').click();
    
    cy.get('[data-cy="username"]').type(user_eo['username']);
    cy.get('[data-cy="password"]').type('wrong_password');
    cy.get('[data-cy="login-button"]').click();
    
    cy.get('.error-message').should('contain', 'The username or password you entered is incorrect');
    cy.url().should('include', '/login');

  });

});

describe('Scenario 3', () => {
  // Test 1
  it('should update IDIR information in onRouteBC when changed', () => {
    // This test is marked as <<can't test>> in the requirements
    // Skipping as it requires external IDIR system changes
    cy.skip('Test requires external IDIR system changes - cannot be automated');

  });

});

describe('Scenario 4', () => {
  // Test 1
  it('should handle valid IDIR with invalid onRouteBC credentials', () => {
    // This scenario appears to be incomplete in the requirements
    // Testing the case where IDIR is valid but onRouteBC role/permissions are invalid
    cy.visit('/login');
    
    cy.get('[data-cy="idir-login"]').click();
    
    // Login with valid IDIR but user doesn't have EO role
    cy.get('[data-cy="username"]').type('valid_idir_no_role');
    cy.get('[data-cy="password"]').type('valid_password');
    cy.get('[data-cy="login-button"]').click();
    
    cy.get('.error-message').should('contain', 'Access denied');
    cy.url().should('include', '/login');

  });

});