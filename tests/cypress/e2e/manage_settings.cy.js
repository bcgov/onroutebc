import { checkRoleAndSearch } from '../support/common';

describe('Manage Settings', () => {
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

  function viewSpecialAuthorizationsAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultViewSpecialAuthorizations = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectSuccessViewSpecialAuthorizations();
        break;
      default:
        expectFailureViewSpecialAuthorizations();
        break;
    }
  }

  const expectSuccessViewSpecialAuthorizations = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureViewSpecialAuthorizations = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function addNoFeeFlagAs(user_role, assertionFn) {
    if(user_role === 'sa' || user_role !== 'hqa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input.MuiSwitch-input')
      .first()
      .click({ force: true })
      .should('be.checked');
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultAddNoFeeFlag = () => {
    switch (user_role) {
      case 'sa':
      case 'hqa':
        expectSuccessAddNoFeeFlag();
        break;
      default:
        expectFailureAddNoFeeFlag();
        break;
    }
  }

  const expectSuccessAddNoFeeFlag = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureAddNoFeeFlag = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function updateNoFeeFlagAs(user_role, assertionFn) {
    if(user_role === 'sa' || user_role !== 'hqa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input.MuiSwitch-input')
      .first()
      .click({ force: true })
      .should('be.checked');
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input')
      .eq(1)    // Selects the second radio button
      .click({ force: true });
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultUpdateNoFeeFlag = () => {
    switch (user_role) {
      case 'sa':
      case 'hqa':
        expectSuccessUpdateNoFeeFlag();
        break;
      default:
        expectFailureUpdateNoFeeFlag();
        break;
    }
  }

  const expectSuccessUpdateNoFeeFlag = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureUpdateNoFeeFlag = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function addLcvFlagAs(user_role, assertionFn) {
    if(user_role === 'sa' || user_role !== 'hqa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input.MuiSwitch-input')
      .eq(1)    // Selects the second radio button
      .click({ force: true })
      .should('be.checked');
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultAddLcvFlag = () => {
    switch (user_role) {
      case 'sa':
      case 'hqa':
        expectSuccessAddLcvFlag();
        break;
      default:
        expectFailureAddLcvFlag();
        break;
    }
  }

  const expectSuccessAddLcvFlag = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureAddLcvFlag = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function removeLcvFlagAs(user_role, assertionFn) {
    if(user_role === 'sa' || user_role !== 'hqa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input.MuiSwitch-input')
      .eq(1)    // Selects the second radio button
      .click({ force: true })
      .should('be.checked');
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input.MuiSwitch-input')
      .eq(1)    // Selects the second radio button
      .click({ force: true })
      .should('be.checked');
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultRemoveLcvFlag = () => {
    switch (user_role) {
      case 'sa':
      case 'hqa':
        expectSuccessRemoveLcvFlag();
        break;
      default:
        expectFailureRemoveLcvFlag();
        break;
    }
  }

  const expectSuccessRemoveLcvFlag = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureRemoveLcvFlag = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function addLoaAs(user_role, assertionFn) {
    if(user_role === 'sa' || user_role !== 'hqa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

      cy.get('button.add-loa-btn')
      .click({ force: true });
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input[type="checkbox"]')
      .first()
      .click();
      cy.wait(wait_time);

      cy.get('div[data-testid="select-vehicleSubtype"]')
      .click({ force: true });
      cy.wait(wait_time);
      
      cy.get('[data-value="BUSCRUM"]').click();
      cy.wait(wait_time);

      cy.get('button[data-testid="loa-next-button"]')
      .click();
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultAddLoa = () => {
    switch (user_role) {
      case 'sa':
      case 'hqa':
        expectSuccessAddLoa();
        break;
      default:
        expectFailureAddLoa();
        break;
    }
  }

  const expectSuccessAddLoa = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureAddLoa = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function editLoaAs(user_role, assertionFn) {
    if(user_role === 'sa' || user_role !== 'hqa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

      cy.get('button.add-loa-btn')
      .click({ force: true });
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input[type="checkbox"]')
      .first()
      .click();
      cy.wait(wait_time);

      cy.get('div[data-testid="select-vehicleSubtype"]')
      .click({ force: true });
      cy.wait(wait_time);
      
      cy.get('[data-value="BUSCRUM"]').click();
      cy.wait(wait_time);

      cy.get('button[data-testid="loa-next-button"]')
      .click();
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultEditLoa = () => {
    switch (user_role) {
      case 'sa':
      case 'hqa':
        expectSuccessEditLoa();
        break;
      default:
        expectFailureEditLoa();
        break;
    }
  }

  const expectSuccessEditLoa = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureEditLoa = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function downloadLoaLetterPdfAs(user_role, assertionFn) {
    if(user_role === 'sa' || user_role !== 'hqa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

      cy.get('button.add-loa-btn')
      .click({ force: true });
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input[type="checkbox"]')
      .first()
      .click();
      cy.wait(wait_time);

      cy.get('div[data-testid="select-vehicleSubtype"]')
      .click({ force: true });
      cy.wait(wait_time);
      
      cy.get('[data-value="BUSCRUM"]').click();
      cy.wait(wait_time);

      cy.get('button[data-testid="loa-next-button"]')
      .click();
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultDownloadLoaLetterPdf = () => {
    switch (user_role) {
      case 'sa':
      case 'hqa':
        expectSuccessDownloadLoaLetterPdf();
        break;
      default:
        expectFailureDownloadLoaLetterPdf();
        break;
    }
  }

  const expectSuccessDownloadLoaLetterPdf = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureDownloadLoaLetterPdf = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function removeLoaAs(user_role, assertionFn) {
    if(user_role === 'sa' || user_role !== 'hqa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input.MuiSwitch-input')
      .eq(1)    // Selects the second radio button
      .click({ force: true })
      .should('be.checked');
      cy.wait(wait_time);

      cy.get('input.PrivateSwitchBase-input.MuiSwitch-input')
      .eq(1)    // Selects the second radio button
      .click({ force: true })
      .should('be.checked');
      cy.wait(wait_time);
    }

    assertionFn();
  }

  const expectResultRemoveLoa = () => {
    switch (user_role) {
      case 'sa':
      case 'hqa':
        expectSuccessRemoveLoa();
        break;
      default:
        expectFailureRemoveLoa();
        break;
    }
  }

  const expectSuccessRemoveLoa = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('exist')
  }
  
  const expectFailureRemoveLoa = () => {
    cy.contains('.tab__label', 'Special Authorizations').should('not.exist')
  }

  function viewCreditAccountAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Credit Account').should('exist').click();
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultViewCreditAccount = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectSuccessViewCreditAccount();
        break;
      default:
        expectFailureViewCreditAccount();
        break;
    }
  }

  const expectSuccessViewCreditAccount = () => {
    cy.get('.non-finance-container__banner').should('exist');
  }
  
  const expectFailureViewCreditAccount = () => {
    cy.get('.non-finance-container__banner').should('not.exist');
  }

  function viewSuspendCompanyInfoAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Suspend').should('exist').click();
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultViewSuspendCompanyInfo = () => {
    switch (user_role) {
      case 'sa':
      case 'ctpo':
      case 'fin':
      case 'eo':
        expectSuccessViewSuspendCompanyInfo();
        break;
      default:
        expectFailureViewSuspendCompanyInfo();
        break;
    }
  }

  const expectSuccessViewSuspendCompanyInfo = () => {
    cy.contains('.tab__label', 'Suspend').should('exist');
  }
  
  const expectFailureViewSuspendCompanyInfo = () => {
    cy.contains('.tab__label', 'Suspend').should('not.exist');
  }

  function updateSuspendCompanyFlagAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
      cy.get('a[href="/settings"]').click({ force: true });
      cy.wait(wait_time);

      cy.contains('.tab__label', 'Suspend').should('exist').click();
      cy.wait(wait_time);

    }

    assertionFn();
  }

  const expectResultUpdateSuspendCompanyFlag = () => {
    switch (user_role) {
      case 'sa':
      case 'ctpo':
      case 'fin':
        expectSuccessUpdateSuspendCompanyFlag();
        break;
      default:
        expectFailureUpdateSuspendCompanyFlag();
        break;
    }
  }

  const expectSuccessUpdateSuspendCompanyFlag = () => {
    cy.contains('.tab__label', 'Suspend').should('exist');
  }
  
  const expectFailureUpdateSuspendCompanyFlag = () => {
    cy.contains('.tab__label', 'Suspend').should('not.exist');
  }
  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('Should View Special Authorizations', () => {
    viewSpecialAuthorizationsAs(user_role, expectResultViewSpecialAuthorizations);
  });

  it('Should Add No Fee flag', () => {
    addNoFeeFlagAs(user_role, expectResultAddNoFeeFlag);
  }); 

  it('Should Update No Fee flag', () => {
    updateNoFeeFlagAs(user_role, expectResultUpdateNoFeeFlag);
  }); 

  it('Should Add LCV flag', () => {
    addLcvFlagAs(user_role, expectResultAddLcvFlag);
  }); 

  it('Should Remove LCV flag', () => {
    removeLcvFlagAs(user_role, expectResultRemoveLcvFlag);
  });
  
  it('Should Add an LOA', () => {
    addLoaAs(user_role, expectResultAddLoa);
  });

  it('Should Edit an LOA', () => {
    editLoaAs(user_role, expectResultEditLoa);
  });

  it('Should View/download LOA letter PDF', () => {
    downloadLoaLetterPdfAs(user_role, expectResultDownloadLoaLetterPdf);
  });

  it('Should Access Expired LOAs link', () => {
    // TBD
  });

  it('Should Remove LOA', () => {
    removeLoaAs(user_role, expectResultRemoveLoa); 
  });

  it('Should View Credit Account tab - Account Holder', () => {
    viewCreditAccountAs(user_role, expectResultViewCreditAccount);
  });

  it('Should View Credit Account Users - Account Holder', () => {
    // TBD   
  });

  it('Should Manage Credit Account Users - Account Holder', () => {
    // TBD 
  });

  it('Should View Credit Account Details - Account Holder', () => {
    // TBD
  });

  it('Should Perform Credit Account Detail actions - Account Holder', () => {
    // TBD
  });


  it('Should View Hold/Close History - Account Holder', () => {
    // TBD
  });

  it('Should View Credit Account tab - Account User', () => {
    // TBD
  });

  it('Should View Credit Account Users - Account User', () => {
    // TBD
  });

  it('Should View Credit Account Details - Account User', () => {
    // TBD
  });

  it('Should View Credit Account tab - Non-Holder/user', () => {
    // TBD
  });

  it('Should Add Credit Account - Non-Holder/user', () => {
    // TBD
  });

  it('Should View Suspend Company info', () => {
    viewSuspendCompanyInfoAs(user_role, expectResultViewSuspendCompanyInfo);
  });

  it('Should Update Suspend Company flag', () => {
    updateSuspendCompanyFlagAs(user_role, expectResultUpdateSuspendCompanyFlag);
  });

});



