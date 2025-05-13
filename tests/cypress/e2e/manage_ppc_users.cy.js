import { checkRoleAndSearch } from '../support/common';

describe('Sticky Side Bar', () => {
  const permits_url = '/applications';
  const new_tros_url = '/create-application/TROS';
  const new_trow_url = '/create-application/TROW';
  
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];

  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
  const company_sa = 'Test Transport Inc.';

  function viewManagePpcUsersAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);
    
    }

    assertionFn();

  }

  const expectResultViewManagePpcUsers = () => {
    switch (user_role) {
      case 'sa':
        expectSuccessViewManagePpcUsers();
        break;
      default:
        expectFailureViewManagePpcUsers();
        break;
    }
  }

  const expectSuccessViewManagePpcUsers = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('exist');
  }
  
  const expectFailureViewManagePpcUsers = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('not.exist');
  }

  // Update PPC User role
  function updatePpcUserRoleAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      // TBD
    
    }

    assertionFn();

  }

  const expectResultUpdatePpcUserRole = () => {
    switch (user_role) {
      case 'sa':
        expectSuccessUpdatePpcUserRole();
        break;
      default:
        expectFailureUpdatePpcUserRole();
        break;
    }
  }

  const expectSuccessUpdatePpcUserRole = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('exist');
  }
  
  const expectFailureUpdatePpcUserRole = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('not.exist');
  }

  // Remove PPC User
  function removePpcUserAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input[type="checkbox"]').last().click();
      cy.wait(wait_time);

      cy.get('button.trash-btn--active').click({force: true});
      cy.wait(wait_time);

      cy.get('button.delete-confirmation-dialog__btn--delete').click({force: true});
      cy.wait(wait_time);
    
    }

    assertionFn();

  }

  const expectResultRemovePpcUser = () => {
    switch (user_role) {
      case 'sa':
        expectSuccessRemovePpcUser();
        break;
      default:
        expectFailureRemovePpcUser();
        break;
    }
  }

  const expectSuccessRemovePpcUser = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('exist');
  }
  
  const expectFailureRemovePpcUser = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('not.exist');
  }

  // Add new PPC User
  function addNewPpcUserAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click({force: true});
      cy.wait(wait_time);

      cy.contains('button', 'Add User').click({force: true});
      cy.wait(wait_time);

      cy.get('input[name="userName"]').type('BCEID1234');
      cy.wait(wait_time);

      // add the first user as admin
      cy.get('input[type="radio"][value="ORGADMIN"]').check({ force: true });
      cy.wait(wait_time);

      cy.contains('button', 'Add User').click();
      cy.wait(wait_time);
    
    }

    assertionFn();

  }

  const expectResultAddNewPpcUser = () => {
    switch (user_role) {
      case 'sa':
        expectSuccessAddNewPpcUser();
        break;
      default:
        expectFailureAddNewPpcUser();
        break;
    }
  }

  const expectSuccessAddNewPpcUser = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('exist');
  }
  
  const expectFailureAddNewPpcUser = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('not.exist');
  }

  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('Should View Manage PPC Users Screen', () => {
    viewManagePpcUsersAs(user_role, expectResultViewManagePpcUsers);
  });

  it('Should Add new PPC User', () => {
    addNewPpcUserAs(user_role, expectResultAddNewPpcUser);
  });

  it('Should Update PPC User Role', () => {
    updatePpcUserRoleAs(user_role, expectResultUpdatePpcUserRole);
  });

  it('Should Remove PPC User', () => {
    removePpcUserAs(user_role, expectResultRemovePpcUser);
  });

});



