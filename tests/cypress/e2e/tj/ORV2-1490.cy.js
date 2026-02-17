import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_ca = Cypress.env('user_ca');
  const user_pa = Cypress.env('user_pa');
  let user_role = user_ca['user_role'];

const loginLogoutAs = (user_role, assertionFn)=> {
    let username = null;
    let password = null;
    switch (user_role) {
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

const startPermitApplication = (permit_type) => {
    cy.contains('a', permit_type).click();
    cy.wait(wait_time);
    cy.contains('button', 'Start New Application').click();
    cy.wait(wait_time);
  }

const checkLCVVehicleOptions = (should_exist = true) => {
    cy.get('.vehicle-section').within(() => {
      cy.get('[data-cy="add-power-unit"]').click();
      cy.wait(wait_time);
      
      cy.get('[data-cy="vehicle-sub-type"]').click();
      cy.wait(wait_time);
      
      if (should_exist) {
        cy.contains('[role="option"]', 'Long Combination Vehicles (LCV) - Rocky Mountain Doubles').should('exist');
        cy.contains('[role="option"]', 'Long Combination Vehicles (LCV) - Turnpike Doubles').should('exist');
      } else {
        cy.contains('[role="option"]', 'Long Combination Vehicles (LCV) - Rocky Mountain Doubles').should('not.exist');
        cy.contains('[role="option"]', 'Long Combination Vehicles (LCV) - Turnpike Doubles').should('not.exist');
      }
    });
  }

describe('Scenario 1', () => {
  // Test 1
  it('should show LCV vehicle options for LCV-enabled companies - TROS', () => {
    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    startPermitApplication('Term Oversize (TROS)');

    checkLCVVehicleOptions(true);

  });

  // Test 2
  it('should show LCV vehicle options for LCV-enabled companies - TROW', () => {
    user_role = user_pa['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    startPermitApplication('Term Overweight (TROW)');

    checkLCVVehicleOptions(true);

  });

});

describe('Scenario 2', () => {
  // Test 1
  it('should not show LCV vehicle options for companies without LCV designation - TROS', () => {
    // This would need a user from a company without LCV designation
    // For now, we'll simulate by checking a non-LCV company
    cy.loginAs('non_lcv_ca', 'non_lcv_user', 'password');
    cy.wait(wait_time);

    startPermitApplication('Term Oversize (TROS)');

    checkLCVVehicleOptions(false);

  });

  // Test 2
  it('should not show LCV vehicle options for companies without LCV designation - TROW', () => {
    cy.loginAs('non_lcv_pa', 'non_lcv_user', 'password');
    cy.wait(wait_time);

    startPermitApplication('Term Overweight (TROW)');

    checkLCVVehicleOptions(false);

  });

});