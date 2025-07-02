import { checkRoleAndSearch } from '../../support/common';

describe('Staff Home Screen', () => {
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];

// View Shopping Cart
function viewShoppingCartAs(user_role, assertionFn) {
  if(user_role !== 'ca' && user_role !== 'pa'){
    cy.search(company_name);
    cy.wait(wait_time);

    


  }
  

  assertionFn();
}

const expectResultViewShoppingCart = () => {
  switch (user_role) {
    case 'ca':
    case 'pa':
    case 'pc':
    case 'sa':
    case 'train':
    case 'ctpo':
      expectSuccessViewShoppingCart();
      break;
    default:
      expectFailureViewShoppingCart();
      break;
  }
}

const expectSuccessViewShoppingCart = () => {
  cy.get('button[aria-label="cart"]').should('exist');
  cy.get('button[aria-label="cart"]').click();
  cy.wait(wait_time);
}

const expectFailureViewShoppingCart = () => {
  cy.get('button[aria-label="cart"]').should('not.exist');
}

// View own created applications
function viewOwnCreatedApplicationsAs(user_role, assertionFn) {
  if(user_role !== 'ca' && user_role !== 'pa'){
    cy.search(company_name);
    cy.wait(wait_time);

  }
  

  assertionFn();
  
}

const expectResultViewOwnCreatedApplications = () => {
  switch (user_role) {
    case 'ca':
    case 'pa':
    case 'pc':
    case 'sa':
    case 'train':
    case 'ctpo':
      expectSuccessViewOwnCreatedApplications();
      break;
    default:
      expectFailureViewOwnCreatedApplications();
      break;
  }
}

const expectSuccessViewOwnCreatedApplications = () => {
  // cy.get('span.MuiFormControlLabel-label').contains('My applications').should('exist');
  cy.get('button[aria-label="cart"]').click();
  cy.wait(wait_time);
  cy.get('[data-testid="pay-now-btn"]').should('exist');

}

const expectFailureViewOwnCreatedApplications = () => {
  cy.get('button[aria-label="cart"]').should('not.exist');
  cy.get('[data-testid="pay-now-btn"]').should('not.exist');
}

// View Applications From Whole Company
function  viewApplicationsFromCompanyAs(user_role, assertionFn) {
  if(user_role !== 'ca' && user_role !== 'pa'){
    cy.search(company_name);
    cy.wait(wait_time);

  }
  
    

  
  assertionFn();
}

const expectResultViewApplicationsFromCompany = () => {
  switch (user_role) {
    case 'ca':
    case 'pc':
    case 'sa':
    case 'train':
    case 'ctpo':
      expectSuccessViewApplicationsFromCompany();
      break;
    default:
      expectFailureViewApplicationsFromCompany();
      break;
  }
}

const expectSuccessViewApplicationsFromCompany = () => {
  cy.get('button[aria-label="cart"]').click();
  cy.wait(wait_time);

  cy.get('span.MuiFormControlLabel-label').contains('All applications').should('exist');
  cy.contains('span', 'All applications').click();
  cy.wait(wait_time);
}

const expectFailureViewApplicationsFromCompany = () => {
  cy.get('span.MuiFormControlLabel-label').should('not.exist');
}

// View IDIR-created applications
function viewApplicationsForIdirAs(user_role, assertionFn) {
  if(user_role !== 'ca' && user_role !== 'pa'){
    cy.search(company_name);
    cy.wait(wait_time);
  }
  

 

    

  assertionFn();
}

const expectResultViewApplicationsForIdir = () => {
  switch (user_role) {
    case 'ca':
    case 'pc':
    case 'sa':
    case 'train':
    case 'ctpo':
      expectSuccessViewApplicationsForIdir();
      break;
    default:
      expectFailureViewApplicationsForIdir();
      break;
  }
}

const expectSuccessViewApplicationsForIdir = () => {
  cy.get('button[aria-label="cart"]').click();
  cy.wait(wait_time);
  cy.get('span.MuiFormControlLabel-label').contains('My applications').should('exist');
  cy.contains('span', 'My applications').click();
  cy.wait(wait_time);
}

const expectFailureViewApplicationsForIdir = () => {
  cy.get('span.MuiFormControlLabel-label').should('not.exist');
}


  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  // it('Should View Shopping Cart', () => {
  //   viewShoppingCartAs(user_role, expectResultViewShoppingCart);
  // });

  // it('Should sees own created applications', () => {
  //   viewOwnCreatedApplicationsAs(user_role, expectResultViewOwnCreatedApplications);
  // });

  // it('Should sees applications from whole company', () => {
  //   viewApplicationsFromCompanyAs(user_role, expectResultViewApplicationsFromCompany);
  // });

  it('Should sees IDIR-created applications', () => {
    viewApplicationsForIdirAs(user_role, expectResultViewApplicationsForIdir);
  });
 

});



