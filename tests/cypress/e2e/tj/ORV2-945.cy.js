import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_sa = Cypress.env('user_sa');
  const user_hqa = Cypress.env('user_hqa');
  const user_ppc = Cypress.env('user_ppc');
  const user_ca = Cypress.env('user_ca');
  let user_role = user_sa['user_role'];


const loginLogoutAs = (user_role, assertionFn)=> {
    let username = null;
    let password = null;
    switch (user_role) {
      case 'sa':
        username = user_sa['username'];
        password = user_sa['password'];
        break;
      case 'hqa':
        username = user_hqa['username'];
        password = user_hqa['password'];
        break;
      case 'ppc':
        username = user_ppc['username'];
        password = user_ppc['password'];
        break;
      case 'ca':
        username = user_ca['username'];
        password = user_ca['password'];
        break;
      case 'pa':
        username = user_pa['username'];
        password = user_pa['password'];
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

describe('Scenario 1', () => {
});

describe('Scenario 2', () => {
  // Test 1
  it('Initial log in', () => {
    // TODO: Implement test for: Initial log in:
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 3', () => {
});

describe('Scenario 4', () => {
  // Test 1
  it('Attempt to log in with a bad IDIR', () => {
    // TODO: Implement test for: Attempt to log in with a bad IDIR
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Attempt to log in with a good IDIR with a wrong password', () => {
    // TODO: Implement test for: Attempt to log in with a good IDIR with a wrong password
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 5', () => {
});

describe('Scenario 6', () => {
  // Test 1
  it('change IDIR information and log in to see if login updates info', () => {
    // TODO: Implement test for: change IDIR information and log in to see if login updates info
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 7', () => {
});

describe('Scenario 8', () => {
  // Test 1
  it('attempt to log in with an IDIR that isnt stored in either the IDIR user or pending IDIR user table', () => {
    // TODO: Implement test for: attempt to log in with an IDIR that isn’t stored in either the IDIR user or pending IDIR user table
    cy.skip('Test implementation needed');
    
  });
});

