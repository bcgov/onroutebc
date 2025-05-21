import { checkRoleAndSearch } from '../support/common';

describe('Manage Permits', () => {
  const permits_url = '/applications';
  const new_tros_url = '/create-application/TROS';
  const new_trow_url = '/create-application/TROW';
  
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];

  function viewPermitsScreenAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);
    }
    else{
      cy.search(company_name);
      cy.get('a[href="/applications"]').click({ force: true });
      cy.wait(wait_time);
    }
  
    assertionFn()
  }

  function startApplicationTros() {
    cy.get('a[href="/applications"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('button.start-application-action__input').eq(0).click({ force: true });
    cy.wait(wait_time);

    cy.get('li.start-application-action__menu-item').eq(0).trigger('mouseover');
    cy.wait(wait_time);

    cy.contains('li', 'Oversize').click({ force: true });
    cy.wait(wait_time);

    cy.get('span.start-application-action__input-text')
    .invoke('text', 'Term > Oversize');

    cy.get('button.start-application-action__btn').eq(0).click({ force: true });
    cy.wait(wait_time);


    // fill out the form
    cy.get('[name="permitData.contactDetails.firstName"]').type('Load');
    cy.wait(wait_time);

    cy.get('[name="permitData.contactDetails.lastName"]').type('Test');
    cy.wait(wait_time);

    cy.get('[name="permitData.contactDetails.phone1"]').clear().type('2501111234');
    cy.wait(wait_time);

    cy.get('#application-select-vehicle').type('MCL36');
    cy.wait(wait_time);

    cy.get('[name="permitData.vehicleDetails.vin"]').click({ force: true }).type('MCL36A');
    cy.wait(wait_time);

    cy.get('[name="permitData.vehicleDetails.plate"]').type('L4NDO');
    cy.wait(wait_time);

    cy.get('[name="permitData.vehicleDetails.make"]').type('BMW');
    cy.wait(wait_time);

    cy.get('[name="permitData.vehicleDetails.year"]').type('2020');
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-permitData.vehicleDetails.countryCode"]').scrollIntoView().click();
    cy.wait(wait_time);

    cy.get('[data-value="CA"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-permitData.vehicleDetails.provinceCode"]').click();
    cy.wait(wait_time);

    cy.get('[data-value="BC"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-permitData.vehicleDetails.vehicleType"]').click(({ force: true }));
    cy.wait(wait_time);

    cy.get('[data-value="powerUnit"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-permitData.vehicleDetails.vehicleSubType"]').click({ force: true });
    cy.wait(wait_time);
    
    cy.get('[data-value="REGTRCK"]').click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.get('.shopping-cart-button').click({force: true});
    cy.wait(wait_time);

    cy.get('[data-testid="pay-now-btn"]').scrollIntoView().click({force: true});
    cy.wait(wait_time);

  }

  function startApplicationTrosAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(new_tros_url);
      cy.wait(wait_time);
      startApplicationTros();
    }
    else if(user_role === 'fin' || user_role === 'eo' || user_role === 'hqa') {
      cy.search(company_name);
    }
    else {
      cy.search(company_name);
      startApplicationTros();
    }
    
  
    assertionFn();

  }

  function startApplicationTrow() {
    cy.get('a[href="/applications"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('button.start-application-action__input').eq(0).click({ force: true });
    cy.wait(wait_time);

    cy.get('li.start-application-action__menu-item').eq(0).trigger('mouseover');
    cy.wait(wait_time);

    cy.contains('li', 'Overweight').click({ force: true });
    cy.wait(wait_time);

    cy.get('span.start-application-action__input-text')
    .invoke('text', 'Term > Overweight');

    cy.get('button.start-application-action__btn').eq(0).click({ force: true });
    cy.wait(wait_time);


    // fill out the form
    cy.get('[name="permitData.contactDetails.firstName"]').type('Load');
    cy.wait(wait_time);

    cy.get('[name="permitData.contactDetails.lastName"]').type('Test');
    cy.wait(wait_time);

    cy.get('[name="permitData.contactDetails.phone1"]').clear().type('2501111234');
    cy.wait(wait_time);

    cy.get('#application-select-vehicle').type('123');
    cy.wait(wait_time);

    cy.get('[name="permitData.vehicleDetails.vin"]').click({ force: true }).type('115588');
    cy.wait(wait_time);

    cy.get('[name="permitData.vehicleDetails.plate"]').type('1B25F');
    cy.wait(wait_time);

    cy.get('[name="permitData.vehicleDetails.make"]').type('PHIL');
    cy.wait(wait_time);

    cy.get('[name="permitData.vehicleDetails.year"]').type('1992');
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-permitData.vehicleDetails.countryCode"]').scrollIntoView().click();
    cy.wait(wait_time);

    cy.get('[data-value="CA"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-permitData.vehicleDetails.provinceCode"]').click();
    cy.wait(wait_time);

    cy.get('[data-value="BC"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-permitData.vehicleDetails.vehicleType"]').click(({ force: true }));
    cy.wait(wait_time);

    cy.get('[data-value="trailer"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-permitData.vehicleDetails.vehicleSubType"]').click({ force: true });
    cy.wait(wait_time);
    
    cy.get('[data-value="FEDRMMX"]').click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.get('.shopping-cart-button').click({force: true});
    cy.wait(wait_time);

    cy.get('[data-testid="pay-now-btn"]').scrollIntoView().click({force: true});
    cy.wait(wait_time);

  }

  function startApplicationTrowAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(new_trow_url);
      cy.wait(wait_time);
      startApplicationTrow();
    }
    else if(user_role === 'fin' || user_role === 'eo' || user_role === 'hqa') {
      cy.search(company_name);
    }
    else {
      cy.search(company_name);
      startApplicationTrow();
    }

    assertionFn();

  }

  function listApplicationsInProgressAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);
    }
    else if(user_role === 'fin' || user_role === 'eo' || user_role === 'hqa') {
      cy.search(company_name);
    }
    else {
      cy.search(company_name);
      cy.get('a[href="/applications"]').click({ force: true });
      cy.wait(wait_time);
    }

    assertionFn();
  }

  function viewIndividualApplicationInProgressAs(user_role, assertionFn) {
      if(user_role === 'ca' || user_role === 'pa'){
        cy.visit(permits_url);
        cy.wait(wait_time);

        cy.get('a.custom-link.column-link.column-link--application-details')
        .first()
        .should('be.visible')
        .click();
          cy.wait(wait_time);
      }
      else {
        cy.search(company_name);
      }

        cy.get('a[href="/applications"]').click({ force: true });
        cy.wait(wait_time);

        const selector = 'a.custom-link.column-link.column-link--application-details';
        const elements = Cypress.$(selector); // Direct jQuery lookup

        if (elements.length > 0) {
          cy.get(selector).first().should('be.visible').click();
          cy.wait(wait_time);
        } else {
          cy.log('Element not found, skipping click');
        }
        cy.wait(wait_time);      

    assertionFn();
  }

  function editIndividualApplicationInProgressAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);
    }
    else if(user_role === 'fin' || user_role === 'eo' || user_role === 'hqa') {
      cy.search(company_name);
    }

    const selector = 'a.custom-link.column-link.column-link--application-details';
        const elements = Cypress.$(selector);
        if (elements.length > 0) {
          cy.get('a.custom-link.column-link.column-link--application-details')
          .first()
          .should('be.visible')
          .click();
          cy.wait(wait_time);

          cy.get('body').then($body => {
            if ($body.find('div.error-page__title').length == 0) {
              cy.get('[name="permitData.contactDetails.phone1Extension"]').clear().type('0003');
              cy.wait(wait_time);
              
              cy.get('[data-testid="save-application-button"]').click();
              cy.wait(wait_time);
            } else {
              cy.log('Unexpected Error element not found');
            }
          });
          
        } else {
          cy.log('Element not found, skipping click');
        }
        cy.wait(wait_time);  

    assertionFn();
  }

  function cancelApplicationInProgressAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);
    }
    else if(user_role === 'fin' || user_role === 'eo' || user_role === 'hqa') {
      cy.search(company_name);
    }

    const selector = 'a.custom-link.column-link.column-link--application-details';
    const elements = Cypress.$(selector);
    if (elements.length > 0) {
      cy.get('a.custom-link.column-link.column-link--application-details')
        .first()
        .should('be.visible')
        .click();
        cy.wait(wait_time);

      cy.get('body').then($body => {
        if ($body.find('div.error-page__title').length == 0) {
          cy.get('[name="permitData.contactDetails.phone1Extension"]').clear().type('0003');
          cy.wait(wait_time);
          
          cy.get('[data-testid="leave-application-button"]').click();
          cy.wait(wait_time);
        } else {
          cy.log('Unexpected Error element not found');
        }
      });

    }

    assertionFn();
  }

  function viewListOfApplicationsInReviewAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);

      cy.xpath("//div[@class='tab__label' and text()='Applications in Review']").click();
      cy.wait(wait_time);
    }
    else if(user_role === 'fin' || user_role === 'eo' || user_role === 'hqa') {
      cy.search(company_name);
    }
    else {
      cy.search(company_name);
      cy.xpath("//div[@class='tab__label' and text()='Applications in Review']").click();
      cy.wait(wait_time);
    }

    assertionFn();
  }

  function viewIndividualApplicationInReviewAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time); 
    }
    else {
      cy.search(company_name);
      cy.wait(wait_time);

    }

    assertionFn();
  }

  function withdrawApplicationInReviewAs(user_role, assertionFn) {
    // TBD
    
  }

  function viewActivePermitsAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);

      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
      cy.wait(wait_time);
    }
    else {
      cy.search(company_name);
      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
      cy.wait(wait_time);
    }

    assertionFn();
  }

  function viewIndividualActivePermitAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);
    }
    else {
      cy.search(company_name);
      
    }

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);

    const selector = 'button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link';
    const element = Cypress.$(selector);

    if (element.length > 0) {
      cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link')
    .first()
    .should('be.visible')
    .click();
    cy.wait(wait_time);
    } else {
      cy.log('Element not found: skipping');
    }

    assertionFn();
  }

  function viewPermitReceiptAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);
    }
    else {
      cy.search(company_name);
      
    }
    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);

    const selector = '[id="actions-button"]';
    const element = Cypress.$(selector);

    if (element.length > 0) {
      cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
      cy.wait(wait_time);

      cy.xpath("//li[text()='View Receipt']").click();
      cy.wait(wait_time);
      
    }

    assertionFn(); 
  }

  function requestPermitAmendmentAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      // TBD
      
    }
    else if(user_role === 'fin' || user_role === 'eo' || user_role === 'hqa') {
      cy.search(company_name);
    }
    else {
      cy.search(company_name);
      // TBD
    }

    assertionFn();
  }

  function viewIndividualExpiredPermitAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);

      cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
      cy.wait(wait_time);

      const selector = 'button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link';
      const element = Cypress.$(selector);

      if (element.length > 0) {
        cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link')
        .first()
        .should('be.visible')
        .click();
        cy.wait(wait_time);
        
      }
      
    }
    else {
      cy.search(company_name);
      cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
      cy.wait(wait_time);

      const selector = 'button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link';
      const element = Cypress.$(selector);

      if (element.length > 0) {
        cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link')
        .first()
        .should('be.visible')
        .click();
        cy.wait(wait_time);
      }   
    }
    
    assertionFn();
  }

  function viewExpiredPermitsAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);

    }
    else {
      cy.search(company_name);
      
    }  

    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);
    
    assertionFn();
  }

  function viewExpiredPermitReceiptAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(permits_url);
      cy.wait(wait_time);
    }
    else {
      cy.search(company_name); 
    }
    
    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);

    const selector = '[id="actions-button"]';
      const element = Cypress.$(selector);

      if (element.length > 0) {
        cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
        cy.wait(wait_time);

        cy.xpath("//li[text()='View Receipt']").click();
        cy.wait(wait_time);
      }

    assertionFn();
  }
  
  const expectResult = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccess();
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        expectFailure();
        break;
    }
  }

  const expectResultStartApplication = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
        expectNoInPersonOption();
        break;
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectShowSuccessMessage();
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        expectNoStartApplication();
        break;
    }
  }

  const expectResultEditIndividualApplication = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessEditIndividualApplication();
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        expectFailureEditIndividualApplication();
        break;
    }
  }

  const expectSuccess = () => {
    cy.get('div.tab__label')
    .contains('Applications in Progress')
    .should('exist');
  }
  
  const expectFailure = () => {
    cy.get('div.tab__label')
    .contains('Applications in Progress')
    .should('not.exist');
  }

  const expectShowSuccessMessage = () => {
    cy.get('div.success__block.success__block--success-msg')
    .should('exist')
    .invoke('text')
    .should('include', 'Success');
  }
  
  const expectNoInPersonOption = () => {
    cy.contains('div.label__text', 'In-person at a Service BC Office (GA)')
  .should('not.exist');

  }

  const expectNoStartApplication = () => {
    cy.contains('button', 'Start Application').should('not.exist');
  }

  const expectResultViewIndividualApplicationInProgress = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessViewIndividualApplicationInProgress();
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        expectFailureViewIndividualApplicationInProgress();
        break;
    }
  }

  const expectSuccessViewIndividualApplicationInProgress = () => {
    cy.get('h2.layout-banner__text').should('be.visible').and('have.text', 'Permit Application');
  }
  
  const expectFailureViewIndividualApplicationInProgress = () => {
    cy.get('h2.layout-banner__text').should('not.exist');
  }

  const expectSuccessEditIndividualApplication = () => {
    cy.get('div.MuiAlert-message.css-1xsto0d')
    .should('exist')
    .invoke('text')
    .should('include', 'Application ')
    .and('include', ' updated.');

  }
  
  const expectFailureEditIndividualApplication = () => {
    cy.get('h2.layout-banner__text').should('not.exist');
  }

  const expectResultCancelApplicationInProgress = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessCancelApplicationInProgress();
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        expectFailureCancelApplicationInProgress();
        break;
    }
  }

  const expectSuccessCancelApplicationInProgress = () => {
    cy.get('div.error-page__title').should('not.exist');
  }
  
  const expectFailureCancelApplicationInProgress = () => {
    cy.get('h2.layout-banner__text').should('not.exist');
  }

  const expectResultViewListOfApplicationsInReview = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessViewListOfApplicationsInReview();
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        expectFailureViewListOfApplicationsInReview();
        break;
    }
  }

  const expectSuccessViewListOfApplicationsInReview = () => {
    cy.xpath("//div[@class='tab__label' and text()='Applications in Review']")
    .should('exist');
  }
  
  const expectFailureViewListOfApplicationsInReview = () => {
    cy.xpath("//div[@class='tab__label' and text()='Applications in Review']")
    .should('not.exist');
    
  }

  const expectResultViewIndividualApplicationsInReview = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccessViewIndividualApplicationsInReview();
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        expectFailureViewIndividualApplicationsInReview();
        break;
    }
  }

  const expectSuccessViewIndividualApplicationsInReview = () => {
    cy.xpath("//div[@class='tab__label' and text()='Applications in Review']")
    .should('exist');


  }
  
  const expectFailureViewIndividualApplicationsInReview = () => {
    
    
  }

  
  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('Should View Permits screen', () => {
    viewPermitsScreenAs(user_role, expectResult);
  });

  it('Should Start Application - term over size', () => {
    startApplicationTrosAs(user_role, expectResultStartApplication);
  });

  it('Should Start Application - term over weight', () => {
    startApplicationTrowAs(user_role, expectResultStartApplication);
  });

  it('Should View list of Applications in Progress', () => {
    listApplicationsInProgressAs(user_role, expectResult);
  });

  it('Should View individual Application in Progress - details', () => {
    viewIndividualApplicationInProgressAs(user_role, expectResultViewIndividualApplicationInProgress);
  });

  it('Should Edit individual application in progress - details', () => {
    editIndividualApplicationInProgressAs(user_role, expectResultEditIndividualApplication);
  });

  it('Should Cancel application in progress', () => {
    cancelApplicationInProgressAs(user_role, expectResultCancelApplicationInProgress);
  });

  it('Should View list of Applications in Review', () => {
    viewListOfApplicationsInReviewAs(user_role, expectResultViewListOfApplicationsInReview);
  });

  it('Should View individual application in review', () => {
    viewIndividualApplicationInReviewAs(user_role, expectResultViewListOfApplicationsInReview);
  });

  it('Should Withdraw Application in review', () => {
    withdrawApplicationInReviewAs(user_role, expectResult);
  });

  it('Should View Active Permits', () => {
    viewActivePermitsAs(user_role, expectResult);
  });

  it('Should View individual Active Permit PDF', () => {
    viewIndividualActivePermitAs(user_role, expectResult);
  });

  it('Should View permit receipt', () => {
    viewPermitReceiptAs(user_role, expectResult);  
  });

  it('Should Request permit amendment', () => {
    requestPermitAmendmentAs(user_role, expectResult);
  });

  it('Should View list of Expired Permits', () => {
    viewExpiredPermitsAs(user_role, expectResult);
  });

  it('Should View individual Expired Permit PDF', () => {
    viewIndividualExpiredPermitAs(user_role, expectResult);
  });

  it('Should View Expired permit receipt', () => {
    viewExpiredPermitReceiptAs(user_role, expectResult);
  });

});





