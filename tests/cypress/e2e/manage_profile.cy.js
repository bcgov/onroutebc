import { checkRoleAndSearch } from '../support/common';

describe('Manage Profile', () => {
  const permits_url = '/applications';
  const new_tros_url = '/create-application/TROS';
  const new_trow_url = '/create-application/TROW';
  
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role');
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];

  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
  const company_sa = 'Test Transport Inc.';


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
      .should('not.be.empty')  // Verifies the content is not empty
      .invoke('text')           // Gets the text content
      .should('not.be.empty');  // Asserts that the text is not empty

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

      cy.contains('button', 'Edit').should('exist').click();
      cy.wait(wait_time);

      cy.get('[name="alternateName"]').clear().type('onRouteBC Test 1');
      cy.wait(wait_time);

      cy.get('[name="mailingAddress.addressLine1"]').clear().type('123 Main Street');
      cy.wait(wait_time);

      cy.contains('button', 'Save').should('exist').click();
      cy.wait(wait_time);
    }
    else{
      cy.search(company_name);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('button', 'Edit').should('exist').click();
      cy.wait(wait_time);

      cy.get('[name="alternateName"]').clear().type('onRouteBC Test 1');
      cy.wait(wait_time);

      cy.get('[name="mailingAddress.addressLine1"]').clear().type('123 Main Street');
      cy.wait(wait_time);

      cy.contains('button', 'Save').should('exist').click();
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
    
        // 5.	Users displayed – check
        cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
        cy.wait(wait_time);
    
        // cy.contains('td', 'ORBCTST1').should('exist');
        cy.get('td[data-index="1"]').first()
        .should('exist') // Check that the <td> exists
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

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

    }
    cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.contains('button', 'Add User').should('exist');
      cy.wait(wait_time);

    assertionFn();
  }

  function addUserAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

    }
    else{
      cy.search(company_name);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      

    }

    cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('button')
      .contains('Add User')  // Ensures you're targeting the correct button by its text
      .click({force: true});
      cy.wait(wait_time);

      cy.get('input[data-testid="input-userName"]')  // Select by the unique data-testid attribute
      .should('be.visible')
      .type('TESTBCEID1');
      cy.wait(wait_time);

      cy.get('button')
      .contains('Add User')  // Ensures you're targeting the correct button by its text
      .click({force: true});
      cy.wait(wait_time);

    assertionFn();
  }

  function editUserAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('td[data-index="1"]').first()
      .should('exist') // Check that the <td> exists
      .within(() => {
        cy.get('span').should('exist');
      });

      // 6.	Can edit users – check
      cy.get('#actions-button').click();
      cy.wait(wait_time);

      cy.get('.onroutebc-table-row-actions__menu-item').click();
      cy.wait(wait_time);

      cy.get('[name="phone1Extension"]').clear().type('1234');
      cy.wait(wait_time);

      cy.contains('button', 'Save').should('exist').click();
      cy.wait(wait_time);

    }
    else{
      cy.search(company_name);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('td[data-index="1"]').first()
      .should('exist') // Check that the <td> exists
      .within(() => {
        cy.get('span').should('exist');
      });

      // 6.	Can edit users – check
      cy.get('#actions-button').click();
      cy.wait(wait_time);

      cy.get('.onroutebc-table-row-actions__menu-item').click();
      cy.wait(wait_time);

      cy.get('[name="phone1Extension"]').clear().type('1234');
      cy.wait(wait_time);

      cy.contains('button', 'Save').should('exist').click();
      cy.wait(wait_time);

    }

    assertionFn();
  }

  function removeUserAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('tr')  // Select all table rows
      .contains('td', 'TESTBCEID1')  // Find the row containing 'TESTBCEID1'
      .parents('tr')  // Get the parent <tr> of the matching <td>
      .find('input[type="checkbox"]')  // Select the input element within the same row
      // .should('be.visible')
      .click({force: true}); // Check the checkbox (or use .click() if you want to click it)
      cy.wait(wait_time);

      cy.get('button[aria-label="delete"]')  // Find the button with the aria-label "delete"
      // .should('be.visible')  // Ensure the button is visible
      .click({force: true});  // Click the button

      cy.contains('button', 'Delete')  // Find the button by its text content 'Delete'
      // .should('be.visible')  // Ensure the button is visible
      .click({force: true}); // Click the button

    }
    else{
      cy.search(company_name);

      cy.get('a[href="/manage-profiles"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
      cy.wait(wait_time);

      cy.get('tr')  // Select all table rows
      .contains('td', 'TESTBCEID1')  // Find the row containing 'TESTBCEID1'
      .parents('tr')  // Get the parent <tr> of the matching <td>
      .find('input[type="checkbox"]')  // Select the input element within the same row
      // .should('be.visible')
      .click({force: true}); // Check the checkbox (or use .click() if you want to click it)
      cy.wait(wait_time);

      cy.get('button[aria-label="delete"]')  // Find the button with the aria-label "delete"
      // .should('be.visible')  // Ensure the button is visible
      .click({force: true});  // Click the button

      cy.contains('button', 'Delete')  // Find the button by its text content 'Delete'
      // .should('be.visible')  // Ensure the button is visible
      .click({force: true}); // Click the button

      

    }

    assertionFn();
  }

  function viewSpecialAuthorizationsAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(manage_profiles_url);
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
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

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
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
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectSuccessEditCompanyInformation();
        break;
      default:
        expectFailureEditCompanyInformation();
        break;
    }
  }

  

  const expectSuccessEditCompanyInformation = () => {
    cy.get('div.tab__label')
    .contains('Company Information')
    .should('exist');
  }
  
  const expectFailureEditCompanyInformation = () => {
    cy.get('div.tab__label')
    .contains('Company Information')
    .should('not.exist');
  }

  const expectResultViewMyInformation = () => {
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
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
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
    cy.contains('button', 'Add User').should('exist');
  }
  
  const expectFailureViewUserManagement = () => {
    cy.contains('button', 'Add User').should('not.exist');
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
    cy.contains('button', 'Add User').should('exist');
  }
  
  const expectFailureAddUser = () => {
    cy.contains('button', 'Add User').should('not.exist');
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
    cy.contains('button', 'Add User').should('exist');
  }
  
  const expectFailureEditUser = () => {
    cy.contains('button', 'Add User').should('not.exist');
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
    cy.contains('button', 'Add User').should('exist');
  }
  
  const expectFailureRemoveUser = () => {
    cy.contains('button', 'Add User').should('not.exist');
  }

  const expectResultViewSpecialAuthorizations = () => {
    switch (user_role) {
      case 'ca':
      case 'pc':
        expectSuccessViewSpecialAuthorizations();
        break;
      default:
        expectFailureViewSpecialAuthorizations();
        break;
    }
  }

  const expectSuccessViewSpecialAuthorizations = () => {
    cy.contains('div.no-fee-permits-section__title', 'No Fee Permits')
  .   should('exist');
  }
  
  const expectFailureViewSpecialAuthorizations = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist');
  }

  const expectResultDownloadLoaLetterPdf = () => {
    switch (user_role) {
      case 'ca':
      case 'pc':
        expectSuccessDownloadLoaLetterPdf();
        break;
      default:
        expectFailureDownloadLoaLetterPdf();
        break;
    }
  }

  const expectSuccessDownloadLoaLetterPdf = () => {
    cy.get('.loa-info')
    .should('exist')
    .and('contain.text', 'Download the letter to see the specific travel terms of the LOA.');
  }
  
  const expectFailureDownloadLoaLetterPdf = () => {
    cy.get('.loa-info')
    .should('not.exist');
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

  const expectResultViewCreditAccout = () => {
    switch (user_role) {
      case 'ca':
        expectSuccessViewCreditAccout();
        break;
      default:
        expectFailureViewCreditAccout();
        break;
    }
  }

  const expectSuccessViewCreditAccout = () => {
    // TBD
  }
  
  const expectFailureViewCreditAccout = () => {
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
    viewCreditAccoutAs(user_role, expectResultViewCreditHolder);
  });

  it('Should View Credit Account users - Account holder', () => {
    viewCreditAccoutUsersAs(user_role, expectResultViewCreditAccoutUsers);
  });

  it('Should View Credit Account details - Account holder', () => {
    viewCreditAccoutDetailsAs(user_role, expectResultViewCreditAccoutDetails);
  });

});





