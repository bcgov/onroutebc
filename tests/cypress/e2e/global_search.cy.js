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
      cy.search(company_name);
      cy.wait(wait_time); 
      
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
    cy.get('a[href="/manage-vehicles"]').should('exist');
  }
  
  const expectFailureSearchForVehicle = () => {
    cy.get('a[href="/manage-vehicles"]').should('not.exist');
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
      // TBD
      // cy.get('[value="companies"]').should('exist');
    }
    
    const expectFailureSearchForCompany = () => {
      // TBD
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
      cy.wait(wait_time);
      
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
    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);
    cy.xpath("//li[text()='Amend']").should('exist');
  }
  
  const expectFailureAmendPermit = () => {
    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);
    cy.xpath("//li[text()='Amend']").should('not.exist');
  }
    // Void/Revoke Permit
    function voidRevokePermitAs(user_role, assertionFn) {
      if(user_role === 'sa'){
        cy.search(company_name);

        cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
        cy.wait(wait_time);

        cy.get('body').then(($body) => {
          if ($body.find('[id="actions-button"]').length > 0) {
            cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
            cy.wait(wait_time);

            cy.xpath("//li[text()='Void/Revoke']").click();
            cy.wait(wait_time);

            cy.get('[name="reason"]').type('void it for test');
            cy.wait(wait_time);

            cy.xpath("//button[text()='Continue']").click();
            cy.wait(wait_time);

            cy.xpath("//button[text()='Finish']").click();
            cy.wait(wait_time);
          } else {
            cy.log('actions-button not found');
          }
        });
        
      }
  
      assertionFn();
  
    }
  
    const expectResultVoidRevokePermit = () => {
      switch (user_role) {
        case 'sa':
          expectSuccessVoidRevokePermit();
          break;
        default:
          expectFailureVoidRevokePermit();
          break;
      }
    }
  
    const expectSuccessVoidRevokePermit = () => {
      cy.get('span.onroutebc-chip.permit-chip.permit-chip--superseded')
      .should('exist')
      .and('have.text', 'Superseded');

    }
    
    const expectFailureVoidRevokePermit = () => {
      cy.get('span.onroutebc-chip.permit-chip.permit-chip--superseded')
      .should('not.exist');
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
      cy.get('.search-button').click();
      cy.wait(wait_time);

  }

  assertionFn();
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
    
  
      cy.get('.css-1pog434').type('1');
      cy.wait(wait_time);
      cy.get('.search-by__search').click();
      cy.wait(wait_time);
      cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
        .first()
        .click();
      cy.wait(wait_time);
  }
  
  const expectFailureSearchForInactivePermit = () => {
    cy.xpath("//div[@class='tab__label' and text()='Inactive Permits']").should('not.exist');
  }
// Search for Application
function searchForApplicationAs(user_role, assertionFn) {
  if(user_role !== 'ca' && user_role !== 'pa'){
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.get('.search-button').click();
      cy.wait(wait_time);

      cy.get('[value="applications"]').click();
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
  cy.get('.css-1pog434').type('1');
      cy.wait(wait_time);
      cy.get('.search-by__search').click();
      cy.wait(wait_time);
}

const expectFailureSearchForApplication = () => {
  // TBD
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
  
  it('Should Void/Revoke Permit', () => {
    voidRevokePermitAs(user_role, expectResultVoidRevokePermit);
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



