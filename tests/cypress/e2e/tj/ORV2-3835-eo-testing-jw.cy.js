import { checkRoleAndSearch } from '../../support/common';

describe('login as role 1, logout and login as role 2', () => {
  const wait_time = Cypress.env('wait_time');
  const user_fin = Cypress.env('user_fin');
  let user_role = user_fin['user_role'];  
  function loginLogoutAs(user_role, assertionFn) {
    cy.loginAs(user_role, user_fin['username'], user_fin['password']);

    assertionFn();

  }

  const expectResultLoginLogout = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
      case 'ca':
      case 'pa':
        // expectSuccessLoginLogout();
        break;
      default:
        // expectFailureLoginLogout();
        break;
    }
  }

  const expectSuccessLoginLogout = () => {
    // TBD

  }
  
  const expectFailureLoginLogout = () => {
    // TBD

  }


  it('Should login and logout with different roles', () => {
    loginLogoutAs(user_role, expectResultLoginLogout);
  });

});



