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
  it('Ensure navigating to BCFT when acting as company drops company context', () => {
    // TODO: Implement test for: Ensure navigating to BCFT when acting as company drops company context
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure navigating to BCFT when not acting as company works without issue', () => {
    // TODO: Implement test for: Ensure navigating to BCFT when not acting as company works without issue
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 2', () => {
  // Test 1
  it('Ensure BFCT available for PPC Clerk', () => {
    // TODO: Implement test for: Ensure BFCT available for PPC Clerk
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure BCFT available for System Admin', () => {
    // TODO: Implement test for: Ensure BCFT available for System Admin
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('Ensure BFCT available for CTPO', () => {
    // TODO: Implement test for: Ensure BFCT available for CTPO
    cy.skip('Test implementation needed');
    
  });
  // Test 4
  it('Ensure BFCT available for Enforcement Officer', () => {
    // TODO: Implement test for: Ensure BFCT available for Enforcement Officer
    cy.skip('Test implementation needed');
    
  });
  // Test 5
  it('Ensure BFCT available for HQ Admin', () => {
    // TODO: Implement test for: Ensure BFCT available for HQ Admin
    cy.skip('Test implementation needed');
    
  });
  // Test 6
  it('Ensure BFCT NOT available for Finance', () => {
    // TODO: Implement test for: Ensure BFCT NOT available for Finance
    cy.skip('Test implementation needed');
    
  });
  // Test 7
  it('Ensure BFCT NOT available for Company Admin', () => {
    // TODO: Implement test for: Ensure BFCT NOT available for Company Admin
    cy.skip('Test implementation needed');
    
  });
  // Test 8
  it('Ensure BFCT NOT available for Permit Applicant', () => {
    // TODO: Implement test for: Ensure BFCT NOT available for Permit Applicant
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 3', () => {
  // Test 1
  it('Ensure information box displays with prescribed wording', () => {
    // TODO: Implement test for: Ensure information box displays with prescribed wording
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 4', () => {
  // Test 1
  it('Ensure vehicle configuration diagram is displayed', () => {
    // TODO: Implement test for: Ensure vehicle configuration diagram is displayed
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 5', () => {
  // Test 1
  it('Ensure parameter input table appears as described', () => {
    // TODO: Implement test for: Ensure parameter input table appears as described
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 6', () => {
  // Test 1
  it('Ensure parameter input table appears as with default two axle units', () => {
    // TODO: Implement test for: Ensure parameter input table appears as with default two axle units
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 7', () => {
  // Test 1
  it('Ensure parameter input table appears as with default 1 interaxle spacing column', () => {
    // TODO: Implement test for: Ensure parameter input table appears as with default 1 interaxle spacing column
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 8', () => {
  // Test 1
  it('Ensure parameter input table adds an additional interaxle spacing column each time an axle unit is added', () => {
    // TODO: Implement test for: Ensure parameter input table adds an additional interaxle spacing column each time an axle unit is added
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 9', () => {
  // Test 1
  it('Ensure axle spread is available for 2 axles', () => {
    // TODO: Implement test for: Ensure axle spread is available for 2+ axles
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 10', () => {
  // Test 1
  it('Ensure axle spread is not available for 1 axles', () => {
    // TODO: Implement test for: Ensure axle spread is not available for 1 axles
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure axle spread is wiped when axles updated from 1 to 1', () => {
    // TODO: Implement test for: Ensure axle spread is wiped when axles updated from >1 to 1
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('Ensure axle spread is wiped when axles updated from blank to 1', () => {
    // TODO: Implement test for: Ensure axle spread is wiped when axles updated from blank to 1
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 11', () => {
  // Test 1
  it('Ensure axle spread is available when axles is blank', () => {
    // TODO: Implement test for: Ensure axle spread is available when axles is blank
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 12', () => {
  // Test 1
  it('Ensure active field moves to next row at end of row when tabbing through fields', () => {
    // TODO: Implement test for: Ensure active field moves to next row at end of row when tabbing through fields
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 13', () => {
  // Test 1
  it('Ensure active field remains in row when not at end of row when tabbing through fields', () => {
    // TODO: Implement test for: Ensure active field remains in row when not at end of row when tabbing through fields
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 14', () => {
  // Test 1
  it('Ensure users can add additional axle units to the end of the table', () => {
    // TODO: Implement test for: Ensure users can add additional axle units to the end of the table
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 15', () => {
  // Test 1
  it('Ensure that newly added axle unit columns are empty', () => {
    // TODO: Implement test for: Ensure that newly added axle unit columns are empty
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 16', () => {
  // Test 1
  it('Ensure user has no option to remove an axle when only 2 axle units exist', () => {
    // TODO: Implement test for: Ensure user has no option to remove an axle when only 2 axle units exist
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure user has option to remove an axle when 3 or more axle units exist', () => {
    // TODO: Implement test for: Ensure user has option to remove an axle when 3 or more axle units exist
    cy.skip('Test implementation needed');
    
  });
  // Test 3
  it('Ensure warning is displayed when user attempts to remove an axle unit', () => {
    // TODO: Implement test for: Ensure warning is displayed when user attempts to remove an axle unit
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 17', () => {
  // Test 1
  it('Ensure screen refreshes and axle unit is removed when user confirms removal after warning', () => {
    // TODO: Implement test for: Ensure screen refreshes and axle unit is removed when user confirms removal after warning
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('ensure remove axle unit can be canceled from warning', () => {
    // TODO: Implement test for: ensure remove axle unit can be canceled from warning
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 18', () => {
  // Test 1
  it('Ensure tooltip exists for remove axle unit option', () => {
    // TODO: Implement test for: Ensure tooltip exists for remove axle unit option
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 19', () => {
  // Test 1
  it('Ensure that columns are renumbered to remain sequential when an axle unit is removed from the middle of the sequence', () => {
    // TODO: Implement test for: Ensure that columns are renumbered to remain sequential when an axle unit is removed from the middle of the sequence
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 20', () => {
  // Test 1
  it('Ensure parameter table input fields only accept numeric inputs', () => {
    // TODO: Implement test for: Ensure parameter table input fields only accept numeric inputs
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 21', () => {
  // Test 1
  it('Ensure all length parameter fields display 2 decimal places', () => {
    // TODO: Implement test for: Ensure all length parameter fields display 2 decimal places
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 22', () => {
  // Test 1
  it('Ensure all length parameter fields display 2 decimal places', () => {
    // TODO: Implement test for: Ensure all length parameter fields display 2 decimal places
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure all length parameter fields only accept a maximum of 2 decimal places', () => {
    // TODO: Implement test for: Ensure all length parameter fields only accept a maximum of 2 decimal places
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 23', () => {
  // Test 1
  it('Ensure all weight parameters round up when fraction portion 05', () => {
    // TODO: Implement test for: Ensure all weight parameters round up when fraction portion >= 0.5
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 24', () => {
  // Test 1
  it('Ensure all weight parameters round down when fraction portion 05', () => {
    // TODO: Implement test for: Ensure all weight parameters round down when fraction portion < 0.5
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 25', () => {
  // Test 1
  it('Ensure error thrown when calculating including a 0 in a parameter', () => {
    // TODO: Implement test for: Ensure error thrown when calculating including a 0 in a parameter
    cy.skip('Test implementation needed');
    
  });
  // Test 2
  it('Ensure error thrown when calculating including a negative number in a parameter', () => {
    // TODO: Implement test for: Ensure error thrown when calculating including a negative number in a parameter
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 26', () => {
  // Test 1
  it('Ensure error thrown when calculating and no data is entered', () => {
    // TODO: Implement test for: Ensure error thrown when calculating and no data is entered
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 27', () => {
  // Test 1
  it('Ensure BCW calculated is sum of all axle spreads and interaxle spacings of included axle groups', () => {
    // TODO: Implement test for: Ensure BCW calculated is sum of all axle spreads and interaxle spacings of included axle groups
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 28', () => {
  // Test 1
  it('Ensure BF max weight allowed by permit 30xBCWcm 18000kg', () => {
    // TODO: Implement test for: Ensure BF (max weight allowed by permit) = 30x(BCWcm) + 18,000kg
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 29', () => {
  // Test 1
  it('12 13 14 15 23 24 25 34 35 45', () => {
    // TODO: Implement test for: 1-2, 1-3, 1-4, 1-5, 2-3, 2-4, 2-5, 3-4, 3-5, 4-5.
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 30', () => {
  // Test 1
  it('Ensure individual axle groups can fail bridge calculation', () => {
    // TODO: Implement test for: Ensure individual axle groups can fail bridge calculation
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 31', () => {
  // Test 1
  it('Ensure single failed axle group is clearly indicated', () => {
    // TODO: Implement test for: Ensure single failed axle group is clearly indicated
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 32', () => {
  // Test 1
  it('Ensure multiple failed axle groups are clearly indicated', () => {
    // TODO: Implement test for: Ensure multiple failed axle groups are clearly indicated
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 33', () => {
  // Test 1
  it('Ensure failed axle group results are displayed', () => {
    // TODO: Implement test for: Ensure failed axle group results are displayed
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 34', () => {
  // Test 1
  it('Ensure results indicate when all calculations pass', () => {
    // TODO: Implement test for: Ensure results indicate when all calculations pass
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 35', () => {
  // Test 1
  it('Ensure user has option to reset inputted data and is displayed warning when attempting reset', () => {
    // TODO: Implement test for: Ensure user has option to reset inputted data and is displayed warning when attempting reset
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 36', () => {
  // Test 1
  it('Ensure that continuing after warning allows user to reset data in parameter table', () => {
    // TODO: Implement test for: Ensure that continuing after warning allows user to reset data in parameter table
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 37', () => {
  // Test 1
  it('na covered by scenario 2', () => {
    // TODO: Implement test for: n/a (covered by scenario 2)
    cy.skip('Test implementation needed');
    
  });
});

describe('Scenario 38', () => {
  // Test 1
  it('na covered by scenario 2', () => {
    // TODO: Implement test for: n/a (covered by scenario 2)
    cy.skip('Test implementation needed');
    
  });
});

