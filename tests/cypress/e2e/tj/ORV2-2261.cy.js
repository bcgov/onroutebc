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
  // Test 1
  it('Ensure if a company has no LOAs that no option to use LOAs appears on TROS permits', () => {
    // TODO: Implement test for: Ensure if a company has no LOAs that no option to use LOAs appears on TROS permits
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure if a company has no LOAs that no option to use LOAs appears on TROW permits', () => {
    // TODO: Implement test for: Ensure if a company has no LOAs that no option to use LOAs appears on TROW permits
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('Ensure if a company has expired LOAs but no active LOAs that no option to use LOAs appears on TROS permits', () => {
    // TODO: Implement test for: Ensure if a company has expired LOAs but no active LOAs that no option to use LOAs appears on TROS permits
    cy.skip('Test implementation needed');
    
  });
  // Test 4
  it('Ensure if a company has expired LOAs but no active LOAs that no option to use LOAs appears on TROW permits', () => {
    // TODO: Implement test for: Ensure if a company has expired LOAs but no active LOAs that no option to use LOAs appears on TROW permits
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 2', () => {
  // Test 1
  it('Ensure that if a company has active TROS LOAs that they appear on TROS permit applications', () => {
    // TODO: Implement test for: Ensure that if a company has active TROS LOAs that they appear on TROS permit applications
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure that if a company has active TROW LOAs that they appear on TROW permit applications', () => {
    // TODO: Implement test for: Ensure that if a company has active TROW LOAs that they appear on TROW permit applications
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('Ensure that nonTROS LOAs do NOT appear on TROS permit applications', () => {
    // TODO: Implement test for: Ensure that non-TROS LOAs do NOT appear on TROS permit applications
    cy.skip('Test implementation needed');
    
  });
  // Test 4
  it('Ensure that nonTROW LOAs do NOT appear on TROW permit applications', () => {
    // TODO: Implement test for: Ensure that non-TROW LOAs do NOT appear on TROW permit applications
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 3', () => {
  // Test 1
  it('Ensure that if a company has an active LOA that it can apply for a TROS permit without selecting an LOA', () => {
    // TODO: Implement test for: Ensure that if a company has an active LOA that it can apply for a TROS permit without selecting an LOA
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure that if a company has an active LOA that it can apply for a TROW permit without selecting an LOA', () => {
    // TODO: Implement test for: Ensure that if a company has an active LOA that it can apply for a TROW permit without selecting an LOA
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 4', () => {
  // Test 1
  it('covered by scenario 2 tests', () => {
    // TODO: Implement test for: covered by scenario 2 tests.
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 5', () => {
  // Test 1
  it('covered by scenario 2 tests', () => {
    // TODO: Implement test for: covered by scenario 2 tests.
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 6', () => {
  // Test 1
  it('Ensure if start date is after currently active TROS LOAs expiry date that that LOA does not appear on the TROS permit application', () => {
    // TODO: Implement test for: Ensure if start date is after (currently active) TROS LOA’s expiry date that that LOA does not appear on the TROS permit application
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 7', () => {
  // Test 1
  it('Ensure that an active TROS LOA that expires within 30 days of the current date is visible but not selectable', () => {
    // TODO: Implement test for: Ensure that an active TROS LOA that expires within 30 days of the current date is visible but not selectable.
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure that an active TROW LOA that expires within 30 days of the current date is visible but not selectable', () => {
    // TODO: Implement test for: Ensure that an active TROW LOA that expires within 30 days of the current date is visible but not selectable.
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 8', () => {
  // Test 1
  it('covered', () => {
    // TODO: Implement test for: covered.
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 9', () => {
  // Test 1
  it('ensure that valid durations for TROS are limited by selected LOAs', () => {
    // TODO: Implement test for: ensure that valid durations for TROS are limited by selected LOAs
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure that valid durations for TROW are limited by selected LOAs', () => {
    // TODO: Implement test for: ensure that valid durations for TROW are limited by selected LOAs
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
  it('this scenario and the next according to GITHUB specs seem to not match the rule Testing rule The chosen LOA vehicle cannot be edited or saved to the vehicle inventory', () => {
    // TODO: Implement test for: this scenario and the next according to GITHUB specs seem to not match the rule. Testing rule “The chosen LOA vehicle cannot be edited or saved to the vehicle inventory”
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 14', () => {
  // Test 1
  it('scenario above has been covered by other tests See note from scenario 13', () => {
    // TODO: Implement test for: scenario above has been covered by other tests. See note from scenario 13.
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
  it('PASS Deleting an LOA doesnt revoke an active permit', () => {
    // TODO: Implement test for: PASS. Deleting an LOA doesn’t revoke an active permit.
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

