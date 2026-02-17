import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_hqa = Cypress.env('user_hqa');
  const user_sa = Cypress.env('user_sa');
  const user_ppc = Cypress.env('user_ppc');
  const user_trainee = Cypress.env('user_trainee');
  const user_ctpo = Cypress.env('user_ctpo');
  const user_eo = Cypress.env('user_eo');
  const user_fin = Cypress.env('user_fin');
  const user_ca = Cypress.env('user_ca');
  const user_pa = Cypress.env('user_pa');
  let company_name = user_hqa['company_name'] 
  let user_role = user_hqa['user_role'];

const loginLogoutAs = (user_role, assertionFn)=> {
    let username = null;
    let password = null;
    switch (user_role) {
      case 'ppc':
        username = user_ppc['username'];
        password = user_ppc['password'];
        break;
      case 'sa':
        username = user_sa['username'];
        password = user_sa['password'];
        break;
      case 'trainee':
        username = user_trainee['username'];
        password = user_trainee['password'];
        break;
      case 'ctpo':
        username = user_ctpo['username'];
        password = user_ctpo['password'];
        break;
      case 'fin':
        username = user_fin['username'];
        password = user_fin['password'];
        break;
      case 'eo':
        username = user_eo['username'];
        password = user_eo['password'];
        break;
      case 'hqa':
        username = user_hqa['username'];
        password = user_hqa['password'];
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

const navigateToSpecialAuth = (role_type) => {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
    }

    if(role_type == 'idir') {
      cy.contains('a', 'Settings').click();

    }
    else if(role_type == 'bceid'){
      cy.contains('a', 'Profile').click();

    }
    cy.wait(wait_time);

    cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
    cy.wait(wait_time);
  }

const expectResultLoginLogout = () => {
    // TBD
    
  }

  const expectSuccessLoginLogout = () => {
    // TBD

  }
  
  const expectFailureLoginLogout = () => {
    // TBD

  }

    const noFeePermitNotExist = (user_role, role_type) => {
    loginLogoutAs(user_role, expectResultLoginLogout);
    if(role_type == 'idir'){
      navigateToSpecialAuth('idir');
    }
    else if(role_type == 'bceid'){
      navigateToSpecialAuth('bceid');
    }
    

    cy.get('.no-fee-permits-section')
    .find('.no-fee-permits-section__header')
    .within(() => {
      cy.get('.no-fee-permits-section__title').should('contain', 'No Fee Permits');

      cy.get('input.MuiSwitch-input')
        .should('not.exist');
    });
    cy.wait(wait_time);

  }

  const setNoFeePermitFlag = (client_type = null) => {
    cy.get('.no-fee-permits-section')
    .find('.no-fee-permits-section__header')
    .within(() => {
      cy.get('.no-fee-permits-section__title').should('contain', 'No Fee Permits');
 
      cy.get('input.MuiSwitch-input')
        .should('exist')
        .and('have.attr', 'type', 'checkbox');
    });
    cy.wait(wait_time);

    cy.contains('.no-fee-permits-section__title', 'No Fee Permits')
    .closest('.no-fee-permits-section__header')
    .find('input[type="checkbox"]')
    .check({ force: true })
    .should('be.checked');

    cy.wait(wait_time);

  }

  const verifyNoFeePermitDesignation = (is_checked = true, client_type = null) => {
    cy.get('.no-fee-permits-section')
    .find('.no-fee-permits-section__header')
    .within(() => {
      cy.get('.no-fee-permits-section__title').should('contain', 'No Fee Permits');
      
      cy.get('input.MuiSwitch-input')
        .should('exist')
        .and('have.attr', 'type', 'checkbox');
        
      if(is_checked) {
        cy.get('input.MuiSwitch-input').should('be.checked');
      } else {
        cy.get('input.MuiSwitch-input').should('not.be.checked');
      }
    });
    cy.wait(wait_time);
  }

describe('Scenario 1', () => {
  // Test 1
  it('ensure that SA can set no fee permit flag', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir');

    setNoFeePermitFlag('The government of Canada or any province or territory');

    cy.visit('/');
    cy.wait(wait_time);

    navigateToSpecialAuth('idir');

    verifyNoFeePermitDesignation(true, 'The government of Canada or any province or territory');

  });

  // Test 2
  it('ensure that HQA can set no fee permit flag', () => {
    user_role = user_hqa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir');

    setNoFeePermitFlag('A municipality');

    cy.visit('/');
    cy.wait(wait_time);

    navigateToSpecialAuth('idir');

    verifyNoFeePermitDesignation(true, 'A municipality');

  });

});

describe('Scenario 2', () => {
  // Test 1
  it('ensure that PPC Clerk cannot set no fee permit flag', () => {
    
    user_role = user_ppc['user_role'];
    noFeePermitNotExist(user_role, 'idir');

  });

  // Test 2
  it('ensure that Trainee cannot set no fee permit flag', () => {
    
    user_role = user_trainee['user_role'];
    noFeePermitNotExist(user_role, 'idir');
  });

  // Test 3
  it('ensure that CTPO cannot set no fee permit flag', () => {
    user_role = user_ctpo['user_role'];
    noFeePermitNotExist(user_role, 'idir');

  });

  // Test 4
  it('ensure that EO cannot set no fee permit flag', () => {
    user_role = user_eo['user_role'];
    noFeePermitNotExist(user_role, 'idir');

  });

   // Test 5
  it('ensure that Finance cannot set no fee permit flag', () => {
    user_role = user_fin['user_role'];
    noFeePermitNotExist(user_role, 'idir');

  });

});

describe('Scenario 3', () => {
  // Test 1
  it('ensure that flag cannot be set without choosing client type', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir');

    cy.get('.no-fee-permits-section')
    .find('.no-fee-permits-section__header')
    .within(() => {
      cy.get('.no-fee-permits-section__title').should('contain', 'No Fee Permits');
 
      cy.get('input.MuiSwitch-input')
        .should('exist')
        .and('have.attr', 'type', 'checkbox');
    });
    cy.wait(wait_time);

    cy.contains('.no-fee-permits-section__title', 'No Fee Permits')
    .closest('.no-fee-permits-section__header')
    .find('input[type="checkbox"]')
    .check({ force: true })
    .should('be.checked');

    cy.wait(wait_time);

    cy.get('.client-type-select').should('exist').click();
    cy.wait(wait_time);

    cy.get('[role="option"]').should('have.length.greaterThan', 0);
    
    cy.get('[role="option"]').first().should('be.selected');

  });

  // Test 2
  it('ensure all client type options are available', () => {
    user_role = user_hqa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir');

    setNoFeePermitFlag();

    cy.get('.client-type-select').click();
    cy.wait(wait_time);

    const expectedOptions = [
      'The government of Canada or any province or territory',
      'A municipality',
      'A school district outside of BC (S. 9 Commercial Transport Act)',
      'The government of the United States of America',
      'The government of any state or county in the United States of America'
    ];

    expectedOptions.forEach(option => {
      cy.contains('[role="option"]', option).should('exist');
    });

  });

});

describe('Scenario 4', () => {
  // Test 1
  it('ensure that CV Client can see no fee permit flag when set but cannot edit', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir');

    setNoFeePermitFlag('The government of Canada or any province or territory');

    cy.wait(wait_time);

    cy.logout();
    cy.wait(wait_time);

    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('bceid');

    verifyNoFeePermitDesignation(true, 'The government of Canada or any province or territory');

    cy.get('.no-fee-permits-section')
    .find('.no-fee-permits-section__header')
    .within(() => {
      cy.get('input.MuiSwitch-input').should('be.disabled');
    });

    cy.get('.client-type-display').should('exist');
    cy.get('.client-type-select').should('not.exist');

  });

});

describe('Scenario 5', () => {
  // Test 1
  it('ensure that CV Client does not see no fee permit section when flag is not set', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir');

    cy.get('.no-fee-permits-section')
    .find('.no-fee-permits-section__header')
    .within(() => {
      cy.get('input.MuiSwitch-input')
        .should('exist')
        .and('not.be.checked');
    });

    cy.wait(wait_time);

    cy.logout();
    cy.wait(wait_time);

    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('bceid');

    cy.get('.no-fee-permits-section').should('not.exist');

  });

});

describe('Scenario 6', () => {
  // Test 1
  it('ensure that CV Client does not see special authorization tab if they have no active special authorizations', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir');

    cy.get('.no-fee-permits-section')
    .find('.no-fee-permits-section__header')
    .within(() => {
      cy.get('input.MuiSwitch-input')
        .should('exist')
        .and('not.be.checked');
    });

    cy.wait(wait_time);

    cy.logout();
    cy.wait(wait_time);

    user_role = user_ca['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    cy.contains('a', 'Profile').click();
    cy.wait(wait_time);

    cy.contains('.tab__label', 'Special Authorizations').should('not.exist');

  });

});