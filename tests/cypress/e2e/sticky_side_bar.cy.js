describe('Sticky Side Bar', () => {
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();

  function viewStickySideBarAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.get('div.nav-icon-side-bar').should('exist');
    }

    assertionFn();

  }

  const expectResultViewStickySideBar = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectSuccessViewStickySideBar();
        break;
      default:
        expectFailureViewStickySideBar();
        break;
    }
  }

  const expectSuccessViewStickySideBar = () => {
    cy.get('div.nav-icon-side-bar').should('exist');
  }
  
  const expectFailureViewStickySideBar = () => {
    cy.get('div.nav-icon-side-bar').should('not.exist');
  }

  function seeHomeButtonAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.get('button.nav-button--home').click();
      cy.wait(wait_time);
    }

    assertionFn();

  }

  const expectResultSeeHomeButton = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'eo':
      case 'hqa':
        expectSuccessSeeHomeButton();
        break;
      default:
        expectFailureSeeHomeButton();
        break;
    }
  }

  const expectSuccessSeeHomeButton = () => {
    cy.get('button.nav-button--home').should('exist')
  }
  
  const expectFailureSeeHomeButton = () => {
    cy.get('button.nav-button--home').should('not.exist')
  }

  function seeReportsButtonAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.get('button.nav-button--report').click();
      cy.wait(wait_time);
    }

    assertionFn();

  }

  const expectResultSeeReportsButton = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'fin':
      case 'hqa':
        expectSuccessSeeReportsButton();
        break;
      default:
        expectFailureSeeReportsButton();
        break;
    }
  }

  const expectSuccessSeeReportsButton = () => {
    cy.get('button.nav-button--report').should('exist')
  }
  
  const expectFailureSeeReportsButton = () => {
    cy.get('button.nav-button--report').should('not.exist')
    
  }

  function managePpcUsersButtonAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      // TBD
    }

    assertionFn();

  }

  const expectResultManagePpcUsersButton = () => {
    switch (user_role) {
      case 'sa':
        expectSuccessManagePpcUsersButton();
        break;
      default:
        expectFailureManagePpcUsersButton();
        break;
    }
  }

  const expectSuccessManagePpcUsersButton = () => {
    // TBD
  }
  
  const expectFailureManagePpcUsersButton = () => {
    // TBD
  }

  function bridgeCalculationToolAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      cy.get('button.nav-button--bfct').click();
      cy.wait(wait_time);
      
    }

    assertionFn();

  }

  const expectResultBridgeCalculationTool = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
      case 'eo':
      case 'hqa':
        expectSuccessBridgeCalculationTool();
        break;
      default:
        expectFailureBridgeCalculationTool();
        break;
    }
  }

  const expectSuccessBridgeCalculationTool = () => {
    cy.get('svg.fa-truck-moving').should('exist');
  }
  
  const expectFailureBridgeCalculationTool = () => {
    cy.get('svg.fa-truck-moving').should('not.exist');
  }

  
  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('Should View Sticky Side Bar', () => {
    viewStickySideBarAs(user_role, expectResultViewStickySideBar);
  });

  it('Should See Home Button', () => {
    seeHomeButtonAs(user_role, expectResultSeeHomeButton);
  });

  it('Should See Reports Button', () => {
    seeReportsButtonAs(user_role, expectResultSeeReportsButton);
  });

  it('Should Manage PPC Users Button', () => {
    managePpcUsersButtonAs(user_role, expectResultManagePpcUsersButton);
  });

  it('Should Bridge Calculation Tool', () => {
    bridgeCalculationToolAs(user_role, expectResultBridgeCalculationTool);
  });

});



