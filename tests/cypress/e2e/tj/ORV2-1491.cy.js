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

const startPermitApplication = (permit_type) => {
    cy.contains('a', permit_type).click();
    cy.wait(wait_time);
    cy.contains('button', 'Start New Application').click();
    cy.wait(wait_time);
}

const verifyFeeSummaryIsZero = () => {
    cy.get('.fee-summary').within(() => {
        cy.contains('Total').should('exist');
        cy.contains('$0').should('exist');
    });
}

const testPermitDurations = (permit_type) => {
    const durations = ['30 days', '60 days', '90 days', '120 days', '150 days', '180 days', 
                       '210 days', '240 days', '270 days', '300 days', '330 days', '1 year'];
    
    durations.forEach((duration, index) => {
        if (index > 0) {
            cy.get('[data-cy="edit-application"]').click();
            cy.wait(wait_time);
        }
        
        cy.get('[data-cy="permit-duration"]').select(duration);
        cy.get('[data-cy="continue"]').click();
        cy.wait(wait_time);
        
        verifyFeeSummaryIsZero();
    });
}

describe('Scenario 1', () => {
  // Test 1
  it('should show $0 in fee summary for all TROS permit durations', () => {
    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    startPermitApplication('Term Oversize (TROS)');

    testPermitDurations('TROS');

  });

  // Test 2
  it('should show $0 in fee summary for all TROW permit durations', () => {
    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectSuccessLoginLogout);

    startPermitApplication('Term Overweight (TROW)');

    testPermitDurations('TROW');

  });

});