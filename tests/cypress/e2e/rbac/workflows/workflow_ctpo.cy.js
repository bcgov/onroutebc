describe('Manage Vehicle Inventory', () => {

  const wait_time = Cypress.env('wait_time');
  const vehicle_inventory_url = '/manage-vehicles';
  const new_power_unit_url = '/manage-vehicles/add-powerunit';
  const manage_vehicle_url = '/manage-vehicles';
  const update_power_unit_url = Cypress.env('update_power_unit_url');
  const new_trailer_url = '/manage-vehicles/add-trailer';
  const company_sa = 'Test Transport Inc.';
    
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Vehicle Inventory screen', () => {
    cy.visit(vehicle_inventory_url);
    cy.wait(wait_time);
  });

  it('Should add, update and delete a power unit', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-vehicles"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('button.add-vehicle__button').eq(1).click({force: true});
    cy.wait(wait_time);

    cy.contains('li', 'Power Unit').click();
    cy.wait(wait_time);

    cy.get('[name="make"]').type('Toyota');
    cy.wait(wait_time);

    cy.get('[name="year"]').type('2002');
    cy.wait(wait_time);

    cy.get('[name="vin"]').type('MCL37A');
    cy.wait(wait_time);

    cy.get('[name="plate"]').type('VB0007');
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-powerUnitTypeCode"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('[data-value="BUSCRUM"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-countryCode"]').scrollIntoView().click();
    cy.wait(wait_time);

    cy.get('[data-value="CA"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-provinceCode"]').click();
    cy.wait(wait_time);

    cy.get('[data-value="AB"]').click();
    cy.wait(wait_time);

    cy.get('[name="licensedGvw"]').type('2000');
    cy.wait(wait_time);

    cy.get('.css-xie432').click();
    cy.wait(wait_time);

    // update power unit
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-vehicles"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('button.onroutebc-table-row-actions__button').first().click();

    cy.xpath("//li[text()='Edit']").click();
    cy.wait(wait_time);

    cy.get('[name="make"]').clear().type('Toyota');
    cy.wait(wait_time);

    cy.get('[name="year"]').clear().type('2021');
    cy.wait(wait_time);

    cy.get('[name="licensedGvw"]').clear().type('3000');
    cy.wait(wait_time);

    cy.get('.css-xie432').click();
    cy.wait(wait_time);

    // delete power unit
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-vehicles"]').click({ force: true });
    cy.wait(wait_time);

    cy.xpath("(//input[@type='checkbox'])[2]")
    .then(($checkbox) => {
      if (!$checkbox.prop('checked')) { // Check if it's not selected
        cy.wrap($checkbox).click(); // Select it if not already checked
      }
    });
    cy.wait(wait_time);

    cy.get('.delete-btn--active').click();
    cy.wait(wait_time);

    cy.get('.css-1a53fri').click();
    cy.wait(wait_time);

  });

  it('Should add, update and delete a trailer', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-vehicles"]').click({ force: true });
    cy.wait(wait_time);

     cy.get('button.add-vehicle__button').eq(1).click({force: true});
     cy.wait(wait_time);

    cy.contains('li', 'Trailer').click();
    cy.wait(wait_time);

    cy.get('[name="make"]').type('NISSAN');
    cy.wait(wait_time);

    cy.get('[name="year"]').type('2005');
    cy.wait(wait_time);

    cy.get('[name="vin"]').type('TCL37A');
    cy.wait(wait_time);

    cy.get('[name="plate"]').type('VT0007');
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-trailerTypeCode"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('[data-value="BOOSTER"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-countryCode"]').scrollIntoView().click();
    cy.wait(wait_time);

    cy.get('[data-value="CA"]').click();
    cy.wait(wait_time);

    cy.get('[id="mui-component-select-provinceCode"]').click();
    cy.wait(wait_time);

    cy.get('[data-value="BC"]').click();
    cy.wait(wait_time);

    cy.get('.css-xie432').click();
    cy.wait(wait_time);

    // update power unit
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-vehicles"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('.tab__label').contains('Trailer').click();
    cy.wait(wait_time);

    cy.get('.css-15mydm5').first().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='Edit']").click();
    cy.wait(wait_time);

    cy.get('[name="make"]').clear().type('BMW');
    cy.wait(wait_time);

    // cy.get('[name="unitNumber"]').clear().type('TCL37');
    // cy.wait(wait_time);

    cy.get('[name="year"]').clear().type('2021');
    cy.wait(wait_time);

    cy.get('.css-xie432').click();
    cy.wait(wait_time);


    // delete trailer
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-vehicles"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('.tab__label').contains('Trailer').click();
    cy.wait(wait_time);

    cy.xpath("(//input[@type='checkbox'])[2]")
    .then(($checkbox) => {
      if (!$checkbox.prop('checked')) { // Check if it's not selected
        cy.wrap($checkbox).click(); // Select it if not already checked
      }
    });
    cy.wait(wait_time);

    cy.get('.delete-btn--active').click();
    cy.wait(wait_time);

    cy.get('.css-1a53fri').click();
    cy.wait(wait_time);

  });

});

describe('Manage Permits', () => {
  const wait_time = Cypress.env('wait_time');
  const permits_url = '/applications';
  const new_tros_url = '/create-application/TROS';
  const new_trow_url = '/create-application/TROW';
   
    
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Permits screen', () => {
    cy.visit(permits_url);
    cy.wait(wait_time);
  });

  it('Should Start Application - term over size', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

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
    cy.get('input[name="permitData.contactDetails.firstName"]')
  .clear()
  .type('Test'); 
    cy.wait(wait_time);

    cy.get('input[name="permitData.contactDetails.lastName"]')
  .clear()
  .type('Orbc'); 
    cy.wait(wait_time);

    cy.get('input[name="permitData.contactDetails.phone1"]')
  .clear()
  .type('2509861111');
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

    // go to the cart
    cy.get('.shopping-cart-button').click({force: true});
    cy.wait(wait_time);

    // click my applications
    cy.get('.cart-filter--my')
      .find('input[type="radio"]')
      .click();
    cy.wait(wait_time);

    cy.get('.payment-option')
      .eq(2)
      .find('input[type="radio"]')
      .click();
    cy.wait(wait_time);  
    // select no fee permit option
    cy.get('.payment-option')
      .eq(2)
      .find('input[name="additionalPaymentData.serviceBCOfficeId"]')
      .type('1234');
    cy.wait(wait_time);

    cy.get('button[data-testid="pay-now-btn"]')
      .click();
    cy.wait(wait_time);

    cy.get('.success__block--success-msg').should('exist');
    cy.wait(wait_time);
  });

  it('Should Start Application - term over weight', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

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
    cy.get('input[name="permitData.contactDetails.firstName"]')
  .clear()
  .type('Test'); 
    cy.wait(wait_time);

    cy.get('input[name="permitData.contactDetails.lastName"]')
  .clear()
  .type('Orbc'); 
    cy.wait(wait_time);

    cy.get('input[name="permitData.contactDetails.phone1"]')
  .clear()
  .type('2509861111');
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

    // go to the cart
    cy.get('.shopping-cart-button').click({force: true});
    cy.wait(wait_time);

    // click my applications
    cy.get('.cart-filter--my')
      .find('input[type="radio"]')
      .click();
    cy.wait(wait_time);

    cy.get('.payment-option')
      .eq(2)
      .find('input[type="radio"]')
      .click();
    cy.wait(wait_time);  
    // select no fee permit option
    cy.get('.payment-option')
      .eq(2)
      .find('input[name="additionalPaymentData.serviceBCOfficeId"]')
      .type('1234');
    cy.wait(wait_time);

    cy.get('button[data-testid="pay-now-btn"]')
      .click();
    cy.wait(wait_time);

    cy.get('.success__block--success-msg').should('exist');
    cy.wait(wait_time);
  });

  it('Should View list of Applications in Progress', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/applications"]').click({ force: true });
    cy.wait(wait_time);
  });

  it('Should View individual Application in Progress - details', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/applications"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('a.custom-link.column-link.column-link--application-details')
    .first()
    .should('be.visible')
    .click(); // or perform any other action
      cy.wait(wait_time);
  });

  it('Should Edit individual application in progress - details', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/applications"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('a.custom-link.column-link.column-link--application-details')
    .first()
    .should('be.visible')
    .click(); // or perform any other action
      cy.wait(wait_time);

    cy.get('[name="permitData.contactDetails.phone1Extension"]').clear().type('0003');
    cy.wait(wait_time);
    // save updates
    cy.get('[data-testid="save-application-button"]').click();
    cy.wait(wait_time);
  });

  it('Should Cancel application in progress', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/applications"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('a.custom-link.column-link.column-link--application-details')
    .first()
    .should('be.visible')
    .click(); // or perform any other action
      cy.wait(wait_time);

    cy.get('[name="permitData.contactDetails.phone1Extension"]').clear().type('0003');
    cy.wait(wait_time);
    // save updates
    cy.get('[data-testid="leave-application-button"]').click();
    cy.wait(wait_time);
  });

  it('Should View list of Applications in Review', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Applications in Review']").click();
    cy.wait(wait_time);

  });

  it('Should View individual application in review', () => {
    // TBD
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Applications in Review']").click();
    cy.wait(wait_time);

  });

  it('Should Withdraw Application in review', () => {
    // TBD
    
  });

  it('Should View Active Permits', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);
  });

  it('Should View individual Active Permit PDF', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);

    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link')
    .first()
    .should('be.visible')
    .click();
    cy.wait(wait_time);

  });

  it('Should View permit receipt', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);

    cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='View Receipt']").click();
    cy.wait(wait_time);
  });

  it('Should Request permit amendment', () => {
    // Step 5: Find the search button by its class name and click it
    cy.get('.search-button').click();
    cy.wait(wait_time);

    // Step 6: Find the element with value="companies" and interact with it
    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    // Step 7: Find elements to amend application
    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    // cy.xpath("//button[text()='Test Transport Inc.']").click();
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    // create a new application in case there is no activate permit over there
    cy.get('[aria-label="Select"]').eq(1).click({ force: true });
    cy.wait(wait_time);

    // click term
    cy.get('.css-1hdidwq').eq(0).click({force: true});
    cy.wait(wait_time);
    
    // click term oversize
    cy.get('.css-1sucic7').eq(0).click({force: true});
    cy.wait(wait_time);

    cy.get('li.start-application-action__menu-item')
    .contains('p.MuiTypography-root', 'Term').first()
    .click({force: true});
    cy.wait(wait_time);

    cy.contains('li', 'Oversize').first().click();
    cy.wait(wait_time);

    cy.get('body').click({force: true});
    cy.wait(wait_time);

    // click "start application"
    cy.get('.start-application-action__btn').first().click({force: true});
    cy.wait(wait_time);

    cy.get('.start-application-action__btn').eq(1).click({force: true});
    cy.wait(wait_time);
    
    // fill out the form
    cy.get('[name="permitData.contactDetails.firstName"]').type('Load');
    cy.wait(wait_time);

    cy.get('[name="permitData.contactDetails.lastName"]').type('Test');
    cy.wait(wait_time);

    cy.get('[name="permitData.contactDetails.phone1"]').type('2501111234');
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

    // go to the cart
    cy.get('.shopping-cart-button').click({force: true});
    cy.wait(wait_time);

    // click my applications
    cy.get('.cart-filter--my')
      .find('input[type="radio"]')
      .click();
    cy.wait(wait_time);

    cy.get('.payment-option')
      .eq(2)
      .find('input[type="radio"]')
      .click();
    cy.wait(wait_time);  
    // select no fee permit option
    cy.get('.payment-option')
      .eq(2)
      .find('input[name="additionalPaymentData.serviceBCOfficeId"]')
      .type('1234');
    cy.wait(wait_time);

    cy.get('button[data-testid="pay-now-btn"]')
      .click();
    cy.wait(wait_time);

    cy.get('.success__block--success-msg').should('exist');
    cy.wait(wait_time);

    // Find the search button by its class name and click it
    cy.get('.search-button').click();
    cy.wait(wait_time);

    // Find the element with value="companies" and interact with it
    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    // Type the search text for the company
    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);

    cy.get('.search-by__search').click();
    cy.wait(wait_time);

    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);

    cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='Amend']").click();
    cy.wait(wait_time);

    cy.get('[name="comment"]').type('Amend for test');
    cy.wait(wait_time);

    cy.xpath("//button[text()='Continue']").click();
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.xpath("//button[text()='Continue']").click();
    cy.wait(wait_time);

    cy.xpath("//button[text()='Finish']").click();
    cy.wait(wait_time);

  });

  it('Should View list of Expired Permits', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);
  });

  it('Should View individual Expired Permit PDF', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);

    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link')
    .first()
    .should('be.visible')
    .click();
    cy.wait(wait_time);

  });

  it('Should View Expired permit receipt', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);

    cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='View Receipt']").click();
    cy.wait(wait_time);
  });

});

describe('Manage Profile', () => {
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Company Information', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

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
  });

  it('Should Edit Company Information', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

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

  });


  it('Should View User Management screen', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-profiles"]').click({ force: true });
    cy.wait(wait_time);

    cy.contains('.tab__label', 'Add / Manage Users').should('exist').click();
    cy.wait(wait_time);

    // cy.contains('td', 'ORBCTST1').should('exist');
    cy.get('td[data-index="1"]').first()
    .should('exist') // Check that the <td> exists
    .within(() => {
      cy.get('span').should('exist');
    });

  });

  it('Should Add User', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-profiles"]').click({ force: true });
    cy.wait(wait_time);

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
  });

  it('Should Edit User', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

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

  });

  it('Should Remove User', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

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

  });

});


describe('Manage Settings', () => {
  const wait_time = Cypress.env('wait_time');
  const manage_profiles_url = '/manage-profiles';
  const settings_url = '/settings';

   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Special Authorizations', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/settings"]').click({ force: true });
    cy.wait(wait_time);

    cy.contains('.tab__label', 'Special Authorizations').should('exist').click();
    cy.wait(wait_time);
  });

  it('Should View/download LOA letter PDF', () => {
    
  });

  it('Should Access Expired LOAs link', () => {
    
  });

  it('Should View Credit Account tab - Account Holder', () => {
    
  });

  it('Should View Credit Account Users - Account Holder', () => {
    
  });

  it('Should View Credit Account tab - Non-Holder/user', () => {
    
  });

  it('Should View Suspend Company info', () => {
    
  });

  it('Should Update Suspend Company flag', () => {
    
  });



}); 

describe('Sticky Side Bar', () => {
  const wait_time = Cypress.env('wait_time');

  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  

  it('Should View Sticky Side Bar', () => {
    cy.visit('/');
    cy.wait(wait_time);

    cy.get('.nav-icon-side-bar .nav-button').eq(0).should('exist');// home button
    cy.get('.nav-icon-side-bar .nav-button').eq(1).should('exist');// reports button
    cy.get('.nav-icon-side-bar .nav-button').eq(2).should('exist');// Bridge Calculation Tool
    cy.wait(wait_time);

  });

  it('Should Bridge Calculation Tool', () => {
    // TBD
  });

});

describe('Reports', () => {
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should Payment and Refund Summary Report', () => {
    // TBD
  });

  it('Should Payment and Refund Detail Report', () => {
    // TBD
  });

});

describe('Global Search', () => {
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Global Search screen', () => {
    // TBD
  });

  it('Should Search for Vehicle', () => {
    // TBD
  });

  it('Should Search for Company', () => {
    // TBD
  });

  it('Should Create Company', () => {
    // TBD
  });

  it('Should Search for Active Permit', () => {
    // TBD
  });

  it('Should Amend Permit', () => {
    // TBD
  });

  it('Should Resend', () => {
    // TBD
  });

  it('Should Search for Inactive Permit', () => {
    // TBD
  });

  it('Should Search for Application', () => {
    // TBD
  });


});

describe('Staff Home Screen', () => {
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Queue', () => {
    // TBD
  });

  it('Should Manage Queue', () => {
    // TBD
  });

});

describe('Miscellaneous', () => {
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Shopping Cart', () => {
    // TBD
  });

  it('Should Sees own created applications', () => {
    // TBD
  });

  it('Should Sees applications from whole company', () => {
    // TBD
  });

  it('Should Sees IDIR-created applications', () => {
    // TBD
  });

});





