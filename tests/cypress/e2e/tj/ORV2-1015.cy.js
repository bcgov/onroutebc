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

    const lcvNotExist = (user_role, role_type) => {
    loginLogoutAs(user_role, expectResultLoginLogout);
    if(role_type == 'idir'){
      navigateToSpecialAuth('idir');
    }
    else if(role_type == 'bceid'){
      navigateToSpecialAuth('bceid');
    }
    

    cy.get('.lcv-section')
    .find('.lcv-section__header')
    .within(() => {
      cy.get('.lcv-section__title').should('contain', 'Long Combination Vehicle (LCV)');

      cy.get('input.MuiSwitch-input')
        .should('not.exist');
    });
    cy.wait(wait_time);

  }

describe('Scenario 1', () => {
  // Test 1
  it('ensure that HQA can designate LCV for a company', () => {
    user_role = user_hqa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir')

    cy.get('.lcv-section')
    .find('.lcv-section__header')
    .within(() => {
      cy.get('.lcv-section__title').should('contain', 'Long Combination Vehicle (LCV)');
 
      cy.get('input.MuiSwitch-input')
        .should('exist')
        .and('have.attr', 'type', 'checkbox');
    });
    cy.wait(wait_time);

    cy.contains('.lcv-section__title', 'Long Combination Vehicle (LCV)')
    .closest('.lcv-section__header') // Ensures we are in the right container
    .find('input[type="checkbox"]')
    .check({ force: true }) // 'force: true' is usually required for MUI hidden inputs
    .should('be.checked');

    cy.wait(wait_time);

    // Navigate away
    cy.visit('/');
    cy.wait(wait_time);

    navigateToSpecialAuth('idir');

    cy.get('.lcv-section')
    .find('.lcv-section__header')
    .within(() => {
      cy.get('.lcv-section__title').should('contain', 'Long Combination Vehicle (LCV)');
      
      cy.get('input.MuiSwitch-input')
        .should('exist')
        .and('have.attr', 'type', 'checkbox').should('be.checked');
    });
    cy.wait(wait_time);

  });

  // Test 2
  it('ensure that SA can designate LCV for a company', () => {
    user_role = user_sa['user_role'];
    loginLogoutAs(user_role, expectResultLoginLogout);

    navigateToSpecialAuth('idir');

    cy.get('.lcv-section')
    .find('.lcv-section__header')
    .within(() => {
      cy.get('.lcv-section__title').should('contain', 'Long Combination Vehicle (LCV)');

      cy.get('input.MuiSwitch-input')
        .should('exist')
        .and('have.attr', 'type', 'checkbox');
    });
    cy.wait(wait_time);

  });

});

describe('Scenario 2', () => {
  // Test 1
  it('ensure that PPC Clerk cannot designate LCV', () => {
    
    user_role = user_ppc['user_role'];
    lcvNotExist(user_role, 'idir');

  });

  // Test 2
  it('ensure that Trainee cannot designate LCV', () => {
    
    user_role = user_trainee['user_role'];
    lcvNotExist(user_role, 'idir');
  });

  // Test 3
  it('ensure that CTPO cannot designate LCV', () => {
    user_role = user_ctpo['user_role'];
    lcvNotExist(user_role, 'idir');

  });

  // Test 4
  it('ensure that eo cannot designate LCV', () => {
    user_role = user_eo['user_role'];
    lcvNotExist(user_role, 'idir');

  });

   // Test 5
  it('ensure that Finance cannot designate LCV', () => {
    user_role = user_fin['user_role'];
    lcvNotExist(user_role, 'idir');

  });

});

describe('Scenario 3', () => {
  // Test 1
  it('ensure that Company Admin cannot see LCV option when not designated LCV', () => {
    user_role = user_ca['user_role'];
    lcvNotExist(user_role, 'bceid');

  });

  // Test 2
  it('ensure that Permit Applicant cannot see LCV option when not designated LCV', () => { 
    user_role = user_ca['user_role'];
    lcvNotExist(user_role, 'bceid');

  });

});

