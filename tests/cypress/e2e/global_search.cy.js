describe('Global search', () => {
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];


  function viewGlobalSearchScreenAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
    }

    assertionFn();

  }

  const expectResultViewGlobalSearchScreen = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectSuccessViewGlobalSearchScreen();
        break;
      default:
        expectFailureViewGlobalSearchScreen();
        break;
    }
  }

  const expectSuccessViewGlobalSearchScreen = () => {
    cy.get('.search-button').should('exist');
  }
  
  const expectFailureViewGlobalSearchScreen = () => {
    cy.get('.search-button').should('not.exist');
  }

  
  // Serach for Vehicle
  function searchForVehicleAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      // TBD
      
    }

    assertionFn();

  }

  const expectResultSearchForVehicle = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'hqa':
        expectSuccessSearchForVehicle();
        break;
      default:
        expectFailureSearchForVehicle();
        break;
    }
  }

  const expectSuccessSearchForVehicle = () => {
    cy.get('.search-button').should('exist');
  }
  
  const expectFailureSearchForVehicle = () => {
    cy.get('.search-button').should('not.exist');
  }

    // Serach for Company
    function searchForCompanyAs(user_role, assertionFn) {
      if(user_role !== 'ca' && user_role !== 'pa'){
        cy.search(company_name);
        
      }
  
      assertionFn();
  
    }
  
    const expectResultSearchForCompany = () => {
      switch (user_role) {
        case 'pc':
        case 'sa':
        case 'train':
        case 'ctpo':
        case 'fin':
        case 'eo':
        case 'hqa':
          expectSuccessSearchForCompany();
          break;
        default:
          expectFailureSearchForCompany();
          break;
      }
    }
  
    const expectSuccessSearchForCompany = () => {
      // cy.get('[value="companies"]').should('exist');
    }
    
    const expectFailureSearchForCompany = () => {
      // cy.get('[value="companies"]').should('not.exist');
    }

  // Serach Create Company
  function createCompanyAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      // TBD
      
    }

    assertionFn();

  }

  const expectResultCreateCompany = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessCreateCompany();
        break;
      default:
        expectFailureCreateCompany();
        break;
    }
  }

  const expectSuccessCreateCompany = () => {
    // TBD
  }
  
  const expectFailureCreateCompany = () => {
    // TBD
  }
  // Serach Merge Company
  function mergeCompanyAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      // TBD
      
    }

    assertionFn();

  }

  const expectResultMergeCompany = () => {
    switch (user_role) {
      case 'sa':
        expectSuccessMergeCompany();
        break;
      default:
        expectFailureMergeCompany();
        break;
    }
  }

  const expectSuccessMergeCompany = () => {
    // TBD
  }
  
  const expectFailureMergeCompany = () => {
    // TBD
  }
  // Serach Delete Company
  function deleteCompanyAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      cy.wait(wait_time);

      // TBD
      
    }

    assertionFn();

  }

  const expectResultDeleteCompany = () => {
    switch (user_role) {
      case 'sa':
        expectSuccessDeleteCompany();
        break;
      default:
        expectFailureDeleteCompany();
        break;
    }
  }

  const expectSuccessDeleteCompany = () => {
    // TBD
  }
  
  const expectFailureDeleteCompany = () => {
    // TBD
  }
    // Serach Search for Active Permit
    function searchForActivePermitAs(user_role, assertionFn) {
      if(user_role !== 'ca' && user_role !== 'pa'){
        cy.get('.search-button').click();
        cy.wait(wait_time);
  
        cy.get('[value="permits"]').click();
        cy.wait(wait_time);
  
        cy.get('.css-1pog434').type('1');
        cy.wait(wait_time);
        cy.get('.search-by__search').click();
        cy.wait(wait_time);
        cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
          .first()
          .click();
        cy.wait(wait_time);
  
        cy.get('input[type="checkbox"][value="end"]')
        .should('exist')
        .should('not.be.checked')
        .check({ force: true })
        .should('be.checked');
        cy.wait(wait_time);
  
        
      }
  
      assertionFn();
  
    }
  
    const expectResultSearchForActivePermit = () => {
      switch (user_role) {
        case 'pc':
        case 'sa':
        case 'train':
        case 'ctpo':
        case 'fin':
        case 'eo':
        case 'hqa':
          expectSuccessSearchForActivePermit();
          break;
        default:
          expectFailureSearchForActivePermit();
          break;
      }
    }
  
    const expectSuccessSearchForActivePermit = () => {
      cy.get('.search-button').should('exist');
    }
    
    const expectFailureSearchForActivePermit = () => {
      cy.get('.search-button').should('not.exist');
    }
  // Amend Permit
  function amendPermitAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
    }

    assertionFn();

  }

  const expectResultAmendPermit = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessAmendPermit();
        break;
      default:
        expectFailureAmendPermit();
        break;
    }
  }

  const expectSuccessAmendPermit = () => {
    cy.get('.search-button').should('exist');
  }
  
  const expectFailureAmendPermit = () => {
    cy.get('.search-button').should('not.exist');
  }
    // Void Permit
    function voidPermitAs(user_role, assertionFn) {
      if(user_role !== 'ca' && user_role !== 'pa'){
        cy.search(company_name);
        
      }
  
      assertionFn();
  
    }
  
    const expectResultVoidPermit = () => {
      switch (user_role) {
        case 'sa':
          expectSuccessVoidPermit();
          break;
        default:
          expectFailureVoidPermit();
          break;
      }
    }
  
    const expectSuccessVoidPermit = () => {
      cy.get('.search-button').should('exist');
    }
    
    const expectFailureVoidPermit = () => {
      cy.get('.search-button').should('not.exist');
    }
  // Void Permit
  function revokePermitAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
    }

    assertionFn();

  }

  const expectResultRevokePermit = () => {
    switch (user_role) {
      case 'sa':
        expectSuccessRevokePermit();
        break;
      default:
        expectFailureRevokePermit();
        break;
    }
  }

  const expectSuccessRevokePermit = () => {
    cy.get('.search-button').should('exist');
  }
  
  const expectFailureRevokePermit = () => {
    cy.get('.search-button').should('not.exist');
  }

  // Resend
  function resendAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.search(company_name);
      
    }

    assertionFn();

  }

  const expectResultResend = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectSuccessResend();
        break;
      default:
        expectFailureResend();
        break;
    }
  }

  const expectSuccessResend = () => {
    cy.get('.search-button').should('exist');
  }
  
  const expectFailureResend = () => {
    cy.get('.search-button').should('not.exist');
  }
  // Search for Inactive Permit
  function searchForInactivePermitAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      if(user_role !== 'ca' && user_role !== 'pa'){
        cy.get('.search-button').click();
        cy.wait(wait_time);
  
        cy.get('[value="permits"]').click();
        cy.wait(wait_time);
  
        cy.get('.css-1pog434').type('1');
        cy.wait(wait_time);
        cy.get('.search-by__search').click();
        cy.wait(wait_time);
        cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
          .first()
          .click();
        cy.wait(wait_time);
      
    }

    assertionFn();

  }
}


  const expectResultSearchForInactivePermit = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'eo':
        expectSuccessSearchForInactivePermit();
        break;
      default:
        expectFailureSearchForInactivePermit();
        break;
    }
  }

  const expectSuccessSearchForInactivePermit = () => {
    cy.get('.search-button').should('exist');
  }
  
  const expectFailureSearchForInactivePermit = () => {
    cy.get('.search-button').should('not.exist');
  }
// Search for Application
function searchForApplicationAs(user_role, assertionFn) {
  if(user_role !== 'ca' && user_role !== 'pa'){
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.get('.search-button').click();
      cy.wait(wait_time);

      cy.get('[value="applications"]').click();
      cy.wait(wait_time);

      cy.get('.css-1pog434').type('1');
      cy.wait(wait_time);
      cy.get('.search-by__search').click();
      cy.wait(wait_time);
      
  }

  assertionFn();
  }
}

const expectResultSearchForApplication = () => {
  switch (user_role) {
    case 'pc':
    case 'sa':
    case 'train':
    case 'ctpo':
      expectSuccessSearchForApplication();
      break;
    default:
      expectFailureSearchForApplication();
      break;
  }
}

const expectSuccessSearchForApplication = () => {
  cy.get('.search-button').should('exist');
}

const expectFailureSearchForApplication = () => {
  cy.get('.search-button').should('not.exist');
}

  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('Should View Global Search screen', () => {
    viewGlobalSearchScreenAs(user_role, expectResultViewGlobalSearchScreen);
  });

  it('Should Search for Vehicle', () => {
    searchForVehicleAs(user_role, expectResultSearchForVehicle);
  });

  it('Should Search for Comany', () => {
    searchForCompanyAs(user_role, expectResultSearchForCompany);
  });

  it('Should Create Comany', () => {
    createCompanyAs(user_role, expectResultCreateCompany);
  });

  it('Should Merge Comany', () => {
    mergeCompanyAs(user_role, expectResultMergeCompany);
  });

  it('Should Delete Comany', () => {
    deleteCompanyAs(user_role, expectResultDeleteCompany);
  });
  
  it('Should search for Active Permit', () => {
    searchForActivePermitAs(user_role, expectResultSearchForActivePermit);
  });
  
  it('Should Amend Permit', () => {
    amendPermitAs(user_role, expectResultAmendPermit);
  });
  
  it('Should Void Permit', () => {
    voidPermitAs(user_role, expectResultVoidPermit);
  });
  
  it('Should Revoke Permit', () => {
    revokePermitAs(user_role, expectResultRevokePermit);
  });
  
  it('Should Resend', () => {
    resendAs(user_role, expectResultResend);
  });

  it('Should search for Inactive Permit', () => {
    searchForInactivePermitAs(user_role, expectResultSearchForInactivePermit);
  });

  it('Should search for Application', () => {
    searchForApplicationAs(user_role, expectResultSearchForApplication);
  });
  

});



