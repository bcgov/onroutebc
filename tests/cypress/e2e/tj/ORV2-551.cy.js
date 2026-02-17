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
  it('verify values in drop down list', () => {
    // TODO: Implement test for: verify values in drop down list
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 2', () => {
  // Test 1
  it('verify values in drop down', () => {
    // TODO: Implement test for: verify values in drop down
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 3', () => {
  // Test 1
  it('ensure all fields available to be filled', () => {
    // TODO: Implement test for: ensure all fields available to be filled
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure all numeric fields reject bad inputs letters in field', () => {
    // TODO: Implement test for: ensure all numeric fields reject bad inputs (letters in field)
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('ensure all filled fields are saved to application on save', () => {
    // TODO: Implement test for: ensure all filled fields are saved to application on save
    cy.skip('Test implementation needed');
    
  });
  // Test 4
  it('ensure all filled fields are saved to application on continue', () => {
    // TODO: Implement test for: ensure all filled fields are saved to application on continue
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 4', () => {
  // Test 1
  it('ensure mandatory fields are mandatory', () => {
    // TODO: Implement test for: ensure mandatory fields are mandatory
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure optional fields are optional', () => {
    // TODO: Implement test for: ensure optional fields are optional
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 5', () => {
  // Test 1
  it('Ensure new vehicle is saved to inventory if option selected', () => {
    // TODO: Implement test for: Ensure new vehicle is saved to inventory if option selected
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure new vehicle is not saved to inventory if option not selected', () => {
    // TODO: Implement test for: Ensure new vehicle is not saved to inventory if option not selected
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 6', () => {
  // Test 1
  it('ensure valid power unit is available when searching by unit number', () => {
    // TODO: Implement test for: ensure valid power unit is available when searching by unit number
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure valid trailer is available when searching by unit number', () => {
    // TODO: Implement test for: ensure valid trailer is available when searching by unit number
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('ensure invalid power unit is not available when searching by unit number', () => {
    // TODO: Implement test for: ensure invalid power unit is not available when searching by unit number
    cy.skip('Test implementation needed');
    
  });
  // Test 4
  it('ensure invalid trailer is not available when searching by unit number', () => {
    // TODO: Implement test for: ensure invalid trailer is not available when searching by unit number
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 7', () => {
  // Test 1
  it('ensure valid power unit is available when searching by plate number', () => {
    // TODO: Implement test for: ensure valid power unit is available when searching by plate number
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure valid trailer is available when searching by plate number', () => {
    // TODO: Implement test for: ensure valid trailer is available when searching by plate number
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('ensure invalid power unit is not available when searching by plate number', () => {
    // TODO: Implement test for: ensure invalid power unit is not available when searching by plate number
    cy.skip('Test implementation needed');
    
  });
  // Test 4
  it('ensure invalid trailer is not available when searching by plate number', () => {
    // TODO: Implement test for: ensure invalid trailer is not available when searching by plate number
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 8', () => {
  // Test 1
  it('ensure existing vehicle updated with changes when option selected', () => {
    // TODO: Implement test for: ensure existing vehicle updated with changes when option selected
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure existing vehicle not updated with changes when option not selected', () => {
    // TODO: Implement test for: ensure existing vehicle not updated with changes when option not selected
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('ensure that new vehicle created if VIN is changed when option selected', () => {
    // TODO: Implement test for: ensure that new vehicle created if VIN is changed when option selected
    cy.skip('Test implementation needed');
    
  });
  // Test 4
  it('ensure that new vehicle is not created if VIN is changed when option not selected', () => {
    // TODO: Implement test for: ensure that new vehicle is not created if VIN is changed when option not selected
    cy.skip('Test implementation needed');
    
  });
});

