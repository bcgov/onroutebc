import { checkRoleAndSearch } from '../support/common';

describe('Sticky Side Bar', () => {
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];

  function viewManagePpcUsersAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time); 
    }
    if(user_role === 'sa'){
      
      // not implemented yet for SA, should be upated to exist once the feature is implemented
      // cy.get('button[aria-label="Manage PPC User"]').click();
      // cy.wait(wait_time);
    
    }

    assertionFn();

  }

  const expectResult = () => {
    switch (user_role) {
      case 'sa':
        expectSuccess();
        break;
      default:
        expectFailure();
        break;
    }
  }

  const expectSuccess = () => {
    // not implemented yet for SA, should be upated to exist once the feature is implemented
    cy.get('button[aria-label="Manage PPC User"]').should('not.exist');
  }
  
  const expectFailure = () => {
    cy.get('button[aria-label="Manage PPC User"]').should('not.exist');
  }

  // Update PPC User role
  function updatePpcUserRoleAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time); 
    }
    if(user_role === 'sa') {
      // not implemented yet for SA, should be upated to exist once the feature is implemented
      // cy.get('button[aria-label="Manage PPC User"]').click();
      // cy.wait(wait_time);
    
    }

    assertionFn();

  }


  // Remove PPC User
  function removePpcUserAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time); 
    }
    if(user_role === 'sa') {
      // not implemented yet for SA, should be upated to exist once the feature is implemented
      // cy.get('button[aria-label="Manage PPC User"]').click();
      // cy.wait(wait_time);
    
    }

    assertionFn();

  }

  // Add new PPC User
  function addNewPpcUserAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time); 
    }
    if(user_role === 'sa') {
      // not implemented yet for SA, should be upated to exist once the feature is implemented
      // cy.get('button[aria-label="Manage PPC User"]').click();
      // cy.wait(wait_time);
    
    }

    assertionFn();

  }
  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('Should View Manage PPC Users Screen', () => {
    viewManagePpcUsersAs(user_role, expectResult);
  });

  it('Should Add new PPC User', () => {
    addNewPpcUserAs(user_role, expectResult);
  });

  it('Should Update PPC User Role', () => {
    updatePpcUserRoleAs(user_role, expectResult);
  });

  it('Should Remove PPC User', () => {
    removePpcUserAs(user_role, expectResult);
  });

});



