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
  // Test 1
  it('Ensure all info fields are displayed', () => {
    // TODO: Implement test for: Ensure all info fields are displayed
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 2', () => {
  // Test 1
  it('Ensure no records found result shows when no applications in the queue', () => {
    // TODO: Implement test for: Ensure no records found result shows when no applications in the queue
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 3', () => {
  // Test 1
  it('Ensure no records found result shows when no applications in the queue', () => {
    // TODO: Implement test for: Ensure no records found result shows when no applications in the queue
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 4', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 5', () => {
  // Test 1
  it('Ensure applications are displayed in the order they were submitted by default', () => {
    // TODO: Implement test for: Ensure applications are displayed in the order they were submitted by default
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 6', () => {
  // Test 1
  it('Ensure manual queue update works', () => {
    // TODO: Implement test for: Ensure manual queue update works
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 7', () => {
  // Test 1
  it('Ensure screen updates automatically every 30 seconds', () => {
    // TODO: Implement test for: Ensure screen updates automatically every 30 seconds
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 8', () => {
  // Test 1
  it('Ensure user can claim an unclaimed application', () => {
    // TODO: Implement test for: Ensure user can claim an unclaimed application
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 9', () => {
  // Test 1
  it('Ensure user can claim an already claimed application', () => {
    // TODO: Implement test for: Ensure user can claim an already claimed application
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 10', () => {
  // Test 1
  it('Ensure user can claim an already claimed application when claiming after another staff member but before screen refresh', () => {
    // TODO: Implement test for: Ensure user can claim an already claimed application when claiming after another staff member but before screen refresh
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 11', () => {
  // Test 1
  it('Ensure user can cancel claim to already claimed application', () => {
    // TODO: Implement test for: Ensure user can cancel claim to already claimed application
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 12', () => {
});

describe('Scenario 13', () => {
  // Test 1
  it('Ensure user can cancel claim to already claimed application', () => {
    // TODO: Implement test for: Ensure user can cancel claim to already claimed application
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 14', () => {
  // Test 1
  it('Ensure items are paginated at 25 items by default', () => {
    // TODO: Implement test for: Ensure items are paginated at 25 items by default
    cy.skip('Test implementation needed');
    
  });
});

