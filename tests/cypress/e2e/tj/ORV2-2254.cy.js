import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_ca = Cypress.env('user_ca');
  let user_role = user_ca['user_role'];

const loginLogoutAs = (user_role, assertionFn)=> {
    let username = null;
    let password = null;
    switch (user_role) {
      case 'ca':
        username = user_ca['username'];
        password = user_ca['password'];
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

const startSTOSApplication = () => {
    cy.contains('a', 'Single Trip Oversize (STOS)').click();
    cy.wait(wait_time);
    cy.contains('button', 'Start New Application').click();
    cy.wait(wait_time);
}

describe('Scenario 1a', () => {
  // Test 1
  it('should only allow power unit vehicle type for STOS permits', () => {
    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    startSTOSApplication();

    // Enter required fields to get to vehicle section
    cy.get('[data-cy="commodity-type"]').select('None');
    cy.wait(wait_time);

    cy.get('[data-cy="add-power-unit"]').click();
    cy.wait(wait_time);

    // Verify header says "Add Power Unit" and no vehicle type field exists
    cy.get('.vehicle-header').should('contain', 'Add Power Unit');
    cy.get('[data-cy="vehicle-type"]').should('not.exist');

  });

});

describe('Scenario 1b', () => {
  // Test 1
  it('should not allow recalling trailers for STOS permits', () => {
    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    startSTOSApplication();

    // Enter required fields to get to vehicle section
    cy.get('[data-cy="commodity-type"]').select('None');
    cy.wait(wait_time);

    cy.get('[data-cy="add-power-unit"]').click();
    cy.wait(wait_time);

    // Check trailer dropdown - should be empty
    cy.get('[data-cy="trailer-dropdown"]').click();
    cy.get('[role="option"]').should('have.length', 0);

  });

});

describe('Scenario 2', () => {
  // Test 1
  it('should only allow permit durations of 1-7 days for STOS permits', () => {
    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    startSTOSApplication();

    // Check permit duration options
    cy.get('[data-cy="permit-duration"]').click();
    cy.wait(wait_time);

    const expectedDurations = ['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days'];
    
    expectedDurations.forEach(duration => {
        cy.contains('[role="option"]', duration).should('exist');
    });

    // Verify no other durations are available
    cy.contains('[role="option"]', '8 days').should('not.exist');
    cy.contains('[role="option"]', '30 days').should('not.exist');

  });

});

describe('Scenario 3', () => {
  // Test 1
  it('should attach CVSE Forms 1000 and 1070 by default to STOS permits', () => {
    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    startSTOSApplication();

    // Complete application and check attached forms
    cy.get('[data-cy="commodity-type"]').select('None');
    cy.wait(wait_time);

    cy.get('[data-cy="add-power-unit"]').click();
    cy.wait(wait_time);

    // Fill required vehicle details
    cy.get('[data-cy="vehicle-make"]').type('Test Make');
    cy.get('[data-cy="vehicle-model"]').type('Test Model');
    cy.get('[data-cy="vehicle-year"]').type('2023');
    cy.wait(wait_time);

    // Check attached forms
    cy.get('.attached-forms').within(() => {
        cy.contains('CVSE Form 1000').should('exist');
        cy.contains('CVSE Form 1070').should('exist');
    });

  });

});