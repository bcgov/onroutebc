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
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 2', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 3', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
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
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 6', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 7', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 8', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 9', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 10', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 11', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 12', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 13', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 14', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 15', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 16', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 17', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 18', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 19', () => {
  // Test 1
  it('', () => {
    // TODO: Implement test for: 
    cy.skip('Test implementation needed');
    
  });
});

