import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_ca = Cypress.env('user_ca');
  const user_pa = Cypress.env('user_pa');
  let user_role = user_ca['user_role'];


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
});

describe('Scenario 3', () => {
  // Test 1
  it('ensure manually saving saves all changes', () => {
    // TODO: Implement test for: ensure manually saving saves all changes
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure manually saving generates number and adds to applications in progress list', () => {
    // TODO: Implement test for: ensure manually saving generates number and adds to applications in progress list
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('ensure last updated timestamp reflects date and time of save', () => {
    // TODO: Implement test for: ensure “last updated” timestamp reflects date and time of save
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 4', () => {
  // Test 1
  it('ensure application can be saved when mandatory fields are still blank', () => {
    // TODO: Implement test for: ensure application can be saved when mandatory fields are still blank
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 5', () => {
  // Test 1
  it('ensure application is saved on continue', () => {
    // TODO: Implement test for: ensure application is saved on continue
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 6', () => {
  // Test 1
  it('ensure application prevents continue when mandatory fields are still blank', () => {
    // TODO: Implement test for: ensure application prevents continue when mandatory fields are still blank
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure application allows continue when mandatory fields are populated with valid values and optional fields left blank', () => {
    // TODO: Implement test for: ensure application allows continue when mandatory fields are populated with valid values and optional fields left blank
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 7', () => {
  // Test 1
  it('this was tested under ORV2550 Scenario 4 All tests passed See ORV2550 BVT task for test journal', () => {
    // TODO: Implement test for: this was tested under ORV2-550, Scenario 4. All tests passed. See ORV2-550 BVT task for test journal.
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 8', () => {
  // Test 1
  it('ensure vehicle mandatory fields enforced', () => {
    // TODO: Implement test for: ensure vehicle mandatory fields enforced.
    cy.skip('Test implementation needed');
    
  });
});

