import { checkRoleAndSearch } from '../../support/common';

describe('login as role 1, logout and login as role 2', () => {
  const wait_time = Cypress.env('wait_time');
  const user_ca = Cypress.env('user_ca');
  const user_pa = Cypress.env('user_pa');
  let user_role = user_ca['user_role'];  
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];

  function loginLogoutAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
    }

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
        expectSuccessLoginLogout();
        break;
      default:
        expectFailureLoginLogout();
        break;
    }
  }

  const expectSuccessLoginLogout = () => {
    cy.get('.start-application-action__btn').should('exist');

  }
  
  const expectFailureLoginLogout = () => {
    cy.get('.start-application-action__btn').should('not.exist');

  }


  it('Should login and logout with different roles', () => {
    cy.loginAs(user_role, user_ca['username'], user_ca['password']);
    loginLogoutAs(user_role, expectResultLoginLogout);

    cy.get('button.logout-button').click();
    cy.wait(wait_time);

    user_role = user_pa['user_role'];
    cy.loginAs(user_role, user_pa['username'], user_pa['password']);
    loginLogoutAs(user_role, expectResultLoginLogout);
  });

});



