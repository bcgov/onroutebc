import { checkRoleAndSearch } from '../../support/common';

describe('login as role 1, logout and login as role 2', () => {
  const wait_time = Cypress.env('wait_time');
  const user_ca = Cypress.env('user_ca');
  const user_pa = Cypress.env('user_pa');
  let user_role = user_ca['user_role'];  
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];

  function navigateToTheAddManageUsersAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
    }

    assertionFn();

  }

  const expectResultNavigateToTheAddManageUsers = () => {
    // TBD
  }




  it('Should navigate to Add/Manage users tab for editing user scenario', () => {
    cy.loginAs(user_role, user_ca['username'], user_ca['password']);
    navigateToTheAddManageUsersAs(user_role, expectResultNavigateToTheAddManageUsers);
    
      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

          
      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

          cy.get('[id="actions-button"]').last().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='Edit']").click();
    cy.wait(wait_time);

    cy.get('[name="phone1Extension"]').clear().type('111');
  cy.wait(wait_time);

  cy.get('[value="PAPPLICANT"]').click();
  cy.wait(wait_time);

  cy.contains('button', 'Save').should('exist').click();
  cy.wait(wait_time);

  cy.get('[id="actions-button"]').last().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='Edit']").click();
    cy.wait(wait_time);

    cy.get('[name="phone1Extension"]').should('have.value', '111')
    cy.wait(wait_time);

    cy.get('[value="ORGADMIN"]').click();
  cy.wait(wait_time);

    cy.contains('button', 'Save').should('exist').click();
  cy.wait(wait_time);

  cy.get('[id="actions-button"]').last().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='Edit']").click();
    cy.wait(wait_time);

    cy.get('[value="ORGADMIN"]').should('be.checked')
    cy.wait(wait_time);

  });

  

});



