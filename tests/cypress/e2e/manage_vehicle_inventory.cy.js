describe('Manage Vehicle Inventory', () => {
  const wait_time = Cypress.env('wait_time');
  const vehicle_inventory_url = '/manage-vehicles';
  const new_power_unit_url = '/manage-vehicles/add-powerunit';
  const manage_vehicle_url = '/manage-vehicles';
  const new_trailer_url = '/manage-vehicles/add-trailer';
  const company_pc = 'Herman, Pfannerstill and Huels Trucking';
  const company_sa = 'Test Transport Inc.';
  const company_train = 'Rodriguez-Kertzmann Trucking';
  const company_fin = "Abshire, Rempel and O'Keefe Trucking";
  const company_ctpo = 'Kemmer-Stiedemann Trucking';
  const company_eo = "Grimes-Spinka Trucking";
  const company_hqa = "Bartell and Sons Trucking";
  const user_role = Cypress.env('user_role');
  let company_name = '';
  let isBceid = false;

  function crud_power_unit_idir() {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_name);
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

    cy.get('.css-1pog434').type(company_name);
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
  }
  
  function crud_power_unit_bceid() {
    cy.visit(new_power_unit_url);
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
    cy.visit(manage_vehicle_url);
    cy.wait(wait_time);

    cy.get('.css-15mydm5').first().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

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
    cy.visit(manage_vehicle_url);
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
  }

  function crud_trailer_idir() {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_name);
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

    cy.get('.css-1pog434').type(company_name);
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

    cy.get('.css-1pog434').type(company_name);
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

  }

  function crud_trailer_bceid() {
    cy.visit(new_trailer_url);
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
    cy.visit(manage_vehicle_url);
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
    cy.visit(manage_vehicle_url);
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
    
  }
    
  beforeEach(() => {
    if(user_role === 'pc'){
      company_name = company_pc;
      isBceid = false;
    }
    if(user_role === 'sa'){
      company_name = company_sa;
      isBceid = false;
    }
    if(user_role === 'train'){
      company_name = company_train;
      isBceid = false;
    }
    if(user_role === 'fin'){
      company_name = company_fin;
      isBceid = false;
    }
    if(user_role === 'ctpo'){
      company_name = company_ctpo;
      isBceid = false;
    }
    if(user_role === 'eo'){
      company_name = company_eo;
      isBceid = false;
    }
    if(user_role === 'hqa'){
      company_name = company_hqa;
      isBceid = false;
    }
    else{
      isBceid = true;
    }
    if(isBceid){
      cy.userLoginBceid();
    } else {
      cy.userLoginIdir();
    }
  });

  it('Should View Vehicle Inventory screen', () => {
    if (user_role === 'ca' 
    || user_role === 'pa' 
    || user_role === 'pc' 
    || user_role === 'sa' 
    || user_role === 'train' 
    || user_role === 'ctpo') {
      cy.visit(vehicle_inventory_url);
      cy.wait(wait_time);
    } else {
      cy.log(`⚠️ User role "${user_role}" is not authorized to access Vehicle Inventory`);
      cy.visit(vehicle_inventory_url, { failOnStatusCode: false });
      // Confirm they don't land on the page
      cy.url().should('not.include', vehicle_inventory_url);
      // Confirm an appropriate message is shown (optional)
      // cy.contains(/Access Denied|Unauthorized|403|Not Authorized/i).should('be.visible');
    }
    
  });

  it('Should add, update and delete a power unit', () => {
    if (user_role === 'ca' 
    || user_role === 'pa' 
    || user_role === 'pc' 
    || user_role === 'sa' 
    || user_role === 'train' 
    || user_role === 'ctpo') {
      if(isBceid){
        crud_power_unit_bceid();
      }
      else {
        crud_power_unit_idir();
      }
    } else {
      cy.get('.search-button').should('not.exist');
      cy.log(`⚠️ User role "${user_role}" is not authorized to access Vehicle Inventory`);
    }
  });

  it('Should add, update and delete a trailer', () => {
    if (user_role === 'ca' 
    || user_role === 'pa' 
    || user_role === 'pc' 
    || user_role === 'sa' 
    || user_role === 'train' 
    || user_role === 'ctpo') {
      if(isBceid){
        crud_trailer_bceid();
      } else {
        crud_trailer_idir();
      }
    } else {
      cy.get('.search-button').should('not.exist');
      cy.log(`⚠️ User role "${user_role}" is not authorized to access Vehicle Inventory`); 
    }
  });

});





