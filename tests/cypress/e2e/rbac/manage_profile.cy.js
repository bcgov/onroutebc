import { checkRoleAndSearch } from '../support/common';

describe('Manage Profile', () => {
  const permits_url = '/applications';
  
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];
  const manage_profiles_url = '/manage-profiles';

  function viewCompanyInformationAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);
    }
    else{
      cy.search(company_name);
    }

    cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      cy.get('h4[data-testid="company-banner-name"]')
      .should('not.be.empty')
      .invoke('text')
      .should('not.be.empty');

      cy.contains('Company Mailing Address')
        .next()
        .should('exist')
        .and('not.be.empty')
        .invoke('text') 
        .should('not.match', /^\s*$/); 

      cy.contains('Company Contact Details')
        .next()
        .should('exist')
        .and('not.be.empty')
        .invoke('text') 
        .should('not.match', /^\s*$/); 

      cy.contains('Company Primary Contact')
        .next()
        .should('exist')
        .and('not.be.empty')
        .invoke('text') 
        .should('not.match', /^\s*$/);

    assertionFn()
  }

  function editCompanyInformationAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);
      if(user_role === 'ca'){
        cy.contains('button', 'Edit').should('exist').click();
        cy.wait(wait_time);

        cy.get('[name="alternateName"]').clear().type('onRouteBC Test 1');
        cy.wait(wait_time);

        cy.get('[name="mailingAddress.addressLine1"]').clear().type('123 Main Street');
        cy.wait(wait_time);

        cy.contains('button', 'Save').should('exist').click();
        cy.wait(wait_time);

      }
      else {
        cy.contains('button', 'Edit').should('exist').should('be.disabled');
      }
      
    }
    else{
      cy.search(company_name);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);
    }

    assertionFn();
  }

  function viewMyInformationAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

      cy.contains('.tab__label', 'My Information').should('exist').click();
      cy.wait(wait_time);

      cy.get('h3.css-jbf51a').should('exist')
        .next()
        .should('exist')
        .and('not.be.empty')
        .invoke('text') 
        .should('not.match', /^\s*$/); 
    }
    else{
      cy.search(company_name);
      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);
    }

    assertionFn()
  }

  function editMyInformationAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

      cy.contains('.tab__label', 'My Information').should('exist').click();
      cy.wait(wait_time);

      cy.get('h3.css-jbf51a').should('exist')
        .next()
        .should('exist')
        .and('not.be.empty')
        .invoke('text') 
        .should('not.match', /^\s*$/); 
      
        cy.contains('button', 'Edit').should('exist').click();
        cy.wait(wait_time);
    
        cy.get('[name="firstName"]').clear().type('ORBC');
        cy.wait(wait_time);
    
        cy.contains('button', 'Save').should('exist').click();
        cy.wait(wait_time);
    
        cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
        cy.wait(wait_time);
    
        cy.get('td[data-index="1"]').first()
        .should('exist')
        .within(() => {
          cy.get('span').should('exist');
        });
    }
    else{
      cy.search(company_name);
      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);
    }

    assertionFn();
  }

  function viewUserManagementAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

    }
    else{
      cy.search(company_name);
      cy.wait(wait_time);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

    }
    
    assertionFn();
  }

  function addUserAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

    }
    else{
      cy.search(company_name);
      cy.wait(wait_time);
      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

    }

    assertionFn();
  }

  function editUserAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

    }
    else{
      cy.search(company_name);
      cy.wait(wait_time);
      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      
    }

    assertionFn();
  }

  function removeUserAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);
    }
    else{
      cy.search(company_name);
    }

    assertionFn();
  }

  function viewSpecialAuthorizationsAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

      // TBD

    }
    else {
      cy.search(company_name);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);
    }

    assertionFn();
  }

  
  function downloadLoaLetterPdfAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);
      // TBD

    }
    else {
      cy.search(company_name);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);
    }
    
    assertionFn();
  }

  function accessExpiredLoasLinkAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);
      // TBD

    }
    
    assertionFn();
  }

  function viewCreditAccoutAs(user_role, assertionFn) {
    if(user_role === 'ca'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);
      // TBD

    }
    

    assertionFn();
  }

  function viewCreditAccoutUsersAs(user_role, assertionFn) {
    if(user_role === 'ca'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);
      // TBD

    }
   
    assertionFn();
  }

  function viewCreditAccoutDetailsAs(user_role, assertionFn) {
    if(user_role === 'ca'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);
      // TBD
    }

    assertionFn();
  }
  
  const expectResultViewCompanyInformation = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectSuccessViewCompanyInformation();
        break;
      default:
        expectFailureViewCompanyInformation();
        break;
    }
  }

  const expectSuccessViewCompanyInformation = () => {
    cy.get('div.tab__label')
    .contains('Company Information')
    .should('exist');
  }
  
  const expectFailureViewCompanyInformation = () => {
    cy.get('div.tab__label')
    .contains('Company Information')
    .should('not.exist');
  }

  const expectResultEditCompanyInformation = () => {
    switch (user_role) {
      case 'ca':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessEditCompanyInformation();
        break;
      case 'pa':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectFailureEditCompanyInformation();
        break;
    }
  }

  const expectSuccessEditCompanyInformation = () => {
    cy.get('div.tab__label')
    .contains('Company Information')
    .should('exist');

    cy.contains('button', 'Edit').should('exist').click();
      cy.wait(wait_time);

      cy.get('[name="alternateName"]').clear().type('onRouteBC Test 1');
      cy.wait(wait_time);

      cy.get('[name="mailingAddress.addressLine1"]').clear().type('123 Main Street');
      cy.wait(wait_time);

      cy.contains('button', 'Save').should('exist').click();
      cy.wait(wait_time);
  }
  
  const expectFailureEditCompanyInformation = () => {
    cy.contains('button', 'Edit')
    .should('exist')
    .should('be.disabled');

  }

  const expectResultViewMyInformation = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
        expectSuccessViewMyInformation();
        break;
      default:
        expectFailureViewMyInformation();
        break;
    }
  }

  const expectSuccessViewMyInformation = () => {
    cy.get('div.tab__label')
    .contains('My Information')
    .should('exist');
  }
  
  const expectFailureViewMyInformation = () => {
    cy.get('div.tab__label')
    .contains('My Information')
    .should('not.exist');
  }

  const expectResultEditMyInformation = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
        expectSuccessEditMyInformation();
        break;
      default:
        expectFailureEditMyInformation();
        break;
    }
  }

  const expectSuccessEditMyInformation = () => {
    cy.get('div.tab__label')
    .contains('My Information')
    .should('exist');
  }
  
  const expectFailureEditMyInformation = () => {
    cy.get('div.tab__label')
    .contains('My Information')
    .should('not.exist');
  }

  const expectResultViewUserManagement = () => {
    switch (user_role) {
      case 'ca':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessViewUserManagement();
        break;
      default:
        expectFailureViewUserManagement();
        break;
    }
  }

  const expectSuccessViewUserManagement = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.contains('button', 'Add User').should('exist');
      cy.wait(wait_time);
  }
  
  const expectFailureViewUserManagement = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('not.exist');   
  }
  
  const expectResultAddUser = () => {
    switch (user_role) {
      case 'ca':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessAddUser();
        break;
      default:
        expectFailureAddUser();
        break;
    }
  }

  const expectSuccessAddUser = () => {
    // if there is no admin user existing, create one
    cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('body').then(($body) => {
        if ($body.find('td[data-index="1"]').length > 0) {
          cy.log('Element exists');
        } else {
          cy.get('button')
        .contains('Add User')  
        .click({force: true});
        cy.wait(wait_time);

        cy.get('input[value="ORGADMIN"]')
          .first()
          .invoke('val')
          .then((val) => {
            cy.log('Value is: ' + val);
          });

        cy.contains('span', 'Administrator').click();
        cy.wait(wait_time);

        cy.get('input[data-testid="input-userName"]') 
        .should('be.visible')
        .type(user_role + '-ADMIN'); 
        cy.wait(wait_time);

        cy.get('button')
        .contains('Add User')
        .click({force: true});
        cy.wait(wait_time);
          
        }
      });

    cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('button')
      .contains('Add User')
      .click({force: true});
      cy.wait(wait_time);

      cy.get('input[data-testid="input-userName"]')
      .should('be.visible')
      .type(user_role + '-TEST1');
      cy.wait(wait_time);

      cy.get('button')
      .contains('Add User')
      .click({force: true});
      cy.wait(wait_time);
  }
  
  const expectFailureAddUser = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('not.exist');
  }

  const expectResultEditUser = () => {
    switch (user_role) {
      case 'ca':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessEditUser();
        break;
      default:
        expectFailureEditUser();
        break;
    }
  }

  const expectSuccessEditUser = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('body').then(($body) => {
        if ($body.find('td[data-index="1"]').length == 1) {
          cy.log('Admin user only, cannot edit');
        } else {
          cy.get('td[data-index="1"]').eq(1)
          .should('exist')
          .within(() => {
            cy.get('span').should('exist');
          });

          cy.get('#actions-button').click();
          cy.wait(wait_time);

          cy.get('.onroutebc-table-row-actions__menu-item').click();
          cy.wait(wait_time);

          cy.get('[name="phone1Extension"]').clear().type('1234');
          cy.wait(wait_time);

          cy.contains('button', 'Save').should('exist').click();
          cy.wait(wait_time);
            }
      });
  }
  
  const expectFailureEditUser = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('not.exist');
  }

  const expectResultRemoveUser = () => {
    switch (user_role) {
      case 'ca':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessRemoveUser();
        break;
      default:
        expectFailureRemoveUser();
        break;
    }
  }

  const expectSuccessRemoveUser = () => {
    cy.get('a[href="/manage-profiles"]').click({ force: true });
    cy.wait(wait_time);
    cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
    cy.wait(wait_time);

    cy.get('td[data-index="1"]')
      .should('have.length.greaterThan', 0) // optional: assert there is at least one
      .then($els => {
        const count = $els.length;
        if (count > 1) {
          cy.log('Non-admin user exists');
          cy.get('td[data-index="1"]').eq(1).parents('tr').find('input[type="checkbox"]')
          .click({force: true});
          cy.wait(wait_time);
        }
        else if(count == 1) {
          cy.get('td[data-index="1"]').first().parents('tr').find('input[type="checkbox"]')
          .click({force: true});
          cy.wait(wait_time);
        }
        
      });

      cy.get('button[aria-label="delete"]')
      .click({force: true});

      cy.contains('button', 'Delete')
      .click({force: true});
  }
  
  const expectFailureRemoveUser = () => {
    cy.contains('.tab__label', 'Add / Manage Users').should('not.exist');
  }

  const expectResultViewSpecialAuthorizations = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
        expectSuccessViewSpecialAuthorizations();
        break;
      default:
        expectFailureViewSpecialAuthorizations();
        break;
    }
  }

  const expectSuccessViewSpecialAuthorizations = () => {
    // If they don't have a credit account, the tab is hidden or if they're only a user of a different company's account
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist');
  }
  
  const expectFailureViewSpecialAuthorizations = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist');
  }

  const expectResultDownloadLoaLetterPdf = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
        expectSuccessDownloadLoaLetterPdf();
        break;
      default:
        expectFailureDownloadLoaLetterPdf();
        break;
    }
  }

  const expectSuccessDownloadLoaLetterPdf = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist');
  }
  
  const expectFailureDownloadLoaLetterPdf = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist');
  }

  
  const expectResultAccessExpiredLoasLink = () => {
    switch (user_role) {
      case 'ca':
      case 'pc':
        expectSuccessAccessExpiredLoasLink();
        break;
      default:
        expectFailureAccessExpiredLoasLink();
        break;
    }
  }

  const expectSuccessAccessExpiredLoasLink = () => {
    // TBD
  }
  
  const expectFailureAccessExpiredLoasLink = () => {
    // TBD
  }

  const expectResultViewCreditAccount = () => {
    switch (user_role) {
      case 'ca':
        expectSuccessViewCreditAccount();
        break;
      default:
        expectFailureViewCreditAccount();
        break;
    }
  }

  const expectSuccessViewCreditAccount = () => {
    // TBD
  }
  
  const expectFailureViewCreditAccount = () => {
    // TBD
  }

  const expectResultViewCreditAccoutUsers = () => {
    switch (user_role) {
      case 'ca':
        expectSuccessViewCreditAccoutUsers();
        break;
      default:
        expectFailureViewCreditAccoutUsers();
        break;
    }
  }

  const expectSuccessViewCreditAccoutUsers = () => {
    // TBD
  }
  
  const expectFailureViewCreditAccoutUsers = () => {
    // TBD
  }

  const expectResultViewCreditAccoutDetails = () => {
    switch (user_role) {
      case 'ca':
        expectSuccessViewCreditAccoutDetails();
        break;
      default:
        expectFailureViewCreditAccoutDetails();
        break;
    }
  }

  const expectSuccessViewCreditAccoutDetails = () => {
    // TBD
  }
  
  const expectFailureViewCreditAccoutDetails = () => {
    // TBD
  }
  
  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('Should View Company Information', () => {
    viewCompanyInformationAs(user_role, expectResultViewCompanyInformation);
  });

  it('Should Edit Company Information', () => {
    editCompanyInformationAs(user_role, expectResultEditCompanyInformation);
  });

  it('Should View My Information', () => {
    viewMyInformationAs(user_role, expectResultViewMyInformation);
  });

  it('Should Edit My Information', () => {
    editMyInformationAs(user_role, expectResultEditMyInformation);
  });

  it('Should View User Management screen', () => {
    viewUserManagementAs(user_role, expectResultViewUserManagement);
  });

  it('Should Add User', () => {
    addUserAs(user_role, expectResultAddUser);
  });

  
  it('Should Edit User', () => {
    editUserAs(user_role, expectResultEditUser);
  });

  it('Should Remove User', () => {
    removeUserAs(user_role, expectResultRemoveUser);
  });

  it('Should View Special Authorizations', () => {
    viewSpecialAuthorizationsAs(user_role, expectResultViewSpecialAuthorizations);
  });

  it('Should View/download  LOA letter PDF', () => {
    downloadLoaLetterPdfAs(user_role, expectResultDownloadLoaLetterPdf);
  });

  it('Should Access Expired LOAs link', () => {
    accessExpiredLoasLinkAs(user_role, expectResultAccessExpiredLoasLink);
  });

  it('Should View Credit Account tab - Account holder', () => {
    viewCreditAccoutAs(user_role, expectResultViewCreditAccount);
  });

  it('Should View Credit Account users - Account holder', () => {
    viewCreditAccoutUsersAs(user_role, expectResultViewCreditAccoutUsers);
  });

  it('Should View Credit Account details - Account holder', () => {
    viewCreditAccoutDetailsAs(user_role, expectResultViewCreditAccoutDetails);
  });

});





