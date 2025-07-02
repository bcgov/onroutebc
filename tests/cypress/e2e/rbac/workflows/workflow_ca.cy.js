describe('Manage Vehicle Inventory', () => {
  const wait_time = Cypress.env('wait_time');
  const vehicle_inventory_url = '/manage-vehicles';
  const new_power_unit_url = '/manage-vehicles/add-powerunit';
  const manage_vehicle_url = '/manage-vehicles';
  const new_trailer_url = '/manage-vehicles/add-trailer';
    
  beforeEach(() => {
    cy.userLoginBceid();
  });

  it('Should View Vehicle Inventory screen', () => {
    cy.visit(vehicle_inventory_url);
    cy.wait(wait_time);
  });

  it('Should add, update and delete a power unit', () => {
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

  });

  it('Should add, update and delete a trailer', () => {
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

  });

  it('Should View Vehicle Configuration tab', () => {
    // TBD
  });

});

describe('Manage Permits', () => {
  const wait_time = Cypress.env('wait_time');
  const permits_url = '/applications';
  const new_tros_url = '/create-application/TROS';
  const new_trow_url = '/create-application/TROW';
   
  beforeEach(() => {
    cy.userLoginBceid();
  });

  it('Should View Permits screen', () => {
    cy.visit(permits_url);
    cy.wait(wait_time);
  });

  it('Should Start Application - term over size', () => {
    cy.visit(new_tros_url);
    cy.wait(wait_time);

    // fill out the form
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
  });

  it('Should Start Application - term over weight', () => {
    cy.visit(new_trow_url);
    cy.wait(wait_time);

    // fill out the form
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
  });

  it('Should View list of Applications in Progress', () => {
    cy.visit(permits_url);
    cy.wait(wait_time);
  });

  it('Should View individual Application in Progress - details', () => {
    cy.visit(permits_url);
    cy.wait(wait_time);

    cy.get('a.custom-link.column-link.column-link--application-details')
    .first()
    .should('be.visible')
    .click(); // or perform any other action
      cy.wait(wait_time);
  });

  it('Should Edit individual application in progress - details', () => {
    cy.visit(permits_url);
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
    cy.visit(permits_url);
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
    cy.visit(permits_url);
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Applications in Review']").click();
    cy.wait(wait_time);

  });

  it('Should View individual application in review', () => {
    // TBD
    cy.visit(permits_url);
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Applications in Review']").click();
    cy.wait(wait_time);

  });

  it('Should Withdraw Application in review', () => {
    // TBD
    cy.visit(permits_url);
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Applications in Review']").click();
    cy.wait(wait_time);

  });

  it('Should View Active Permits', () => {
    cy.visit(permits_url);
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);
  });

  it('Should View individual Active Permit PDF', () => {
    cy.visit(permits_url);
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
    cy.visit(permits_url);
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);

    cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='View Receipt']").click();
    cy.wait(wait_time);
  });

  it('Should Request permit amendment', () => {
    // TBD
    // **future development**
    cy.visit(permits_url);
    cy.wait(wait_time);
  });

  it('Should View list of Expired Permits', () => {
    cy.visit(permits_url);
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);
  });

  it('Should View individual Expired Permit PDF', () => {
    cy.visit(permits_url);
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
    cy.visit(permits_url);
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
   
  beforeEach(() => {
    cy.userLoginBceid();
  });

  it('Should View Company Information', () => {
    cy.visit(manage_profiles_url);
    cy.wait(wait_time);

    cy.contains('Doing Business As (DBA)')
      .next() // Select the next sibling
      .should('exist') // Ensure the next sibling exists
      .and('not.be.empty') // Ensure it's not empty
      .invoke('text') // Get the text content
      .should('not.match', /^\s*$/); // Ensure it is not just whitespace

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


  });

  it('Should View My Information', () => {
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

  });

  it('Should Edit My Information', () => {
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

  });

  it('Should View User Management screen', () => {
    cy.visit(manage_profiles_url);
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
    cy.visit(manage_profiles_url);
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

  });

  it('Should Remove User', () => {
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


  });

  it('Should View Special Authorizations', () => {
    // TBD
    cy.visit(manage_profiles_url);
    cy.wait(wait_time);
  });
  
  it('Should View/download  LOA letter PDF', () => {
    // TBD
    cy.visit(manage_profiles_url);
    cy.wait(wait_time);
  });
  
  it('Should Access Expired LOAs link', () => {
    // TBD
    cy.visit(manage_profiles_url);
    cy.wait(wait_time);
  });
  
  it('Should View Credit Account tab - Account holder', () => {
    // TBD
    cy.visit(manage_profiles_url);
    cy.wait(wait_time);
  });

  it('Should View Credit Account users - Account holder', () => {
    // TBD
    cy.visit(manage_profiles_url);
    cy.wait(wait_time);
  });

  it('Should View Credit Account details - Account holder', () => {
    // TBD
    cy.visit(manage_profiles_url);
    cy.wait(wait_time);
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
    cy.userLoginBceid();
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





