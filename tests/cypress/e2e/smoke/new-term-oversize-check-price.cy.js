describe('Login Test for OnRouteBC', () => {
  it('Should navigate to the login page, find the login button, and enter credentials', () => {
    // Retrieve the environment variables
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    const new_tros_url = '/create-application/TROS';
    const wait_time = Cypress.env('wait_time');
    const cart_url = '/cart';

    // Step 1: Visit the base URL
    cy.visit('/');

    // Step 2: Find and click the login button by its idir
    cy.get('#login-bceid').click();
    cy.wait(wait_time);

    // Step 3: Enter credentials
    cy.get('#user').type(username); 
    cy.get('#password').type(password);
    cy.wait(wait_time);

    // Step 4: Submit the login form
    cy.get('[name="btnSubmit"]').click();
    cy.wait(wait_time);

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

    // go to cart
    cy.visit(cart_url);
    cy.wait(wait_time);

    // find first fee item in the cart
    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$30.00');
      cy.wait(wait_time);

    // edit the application to 60 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
      cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
      cy.wait(wait_time);

      cy.get('[data-testid="select-permitData.permitDuration"]').click();
      cy.wait(wait_time);

      cy.get('.MuiMenuItem-root').eq(1).click();
      cy.wait(wait_time);

      cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$60.00');
      cy.wait(wait_time);

    // edit the application to 90 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
    .first()
    .click();
    cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
      cy.wait(wait_time);

      cy.get('[data-testid="select-permitData.permitDuration"]').click();
      cy.wait(wait_time);

      cy.get('.MuiMenuItem-root').eq(2).click();
      cy.wait(wait_time);

      cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$90.00');
      cy.wait(wait_time);

    // edit the application to 120 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
      cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
      cy.wait(wait_time);

      cy.get('[data-testid="select-permitData.permitDuration"]').click();
      cy.wait(wait_time);

      cy.get('.MuiMenuItem-root').eq(3).click();
      cy.wait(wait_time);

      cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$120.00');
      cy.wait(wait_time);

    // edit the application to 150 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
      cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
    cy.wait(wait_time);

    cy.get('[data-testid="select-permitData.permitDuration"]').click();
    cy.wait(wait_time);

    cy.get('.MuiMenuItem-root').eq(4).click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$150.00');
      cy.wait(wait_time);

    // edit the application to 180 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
    .first()
    .click();
    cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
      cy.wait(wait_time);

    cy.get('[data-testid="select-permitData.permitDuration"]').click();
    cy.wait(wait_time);

    cy.get('.MuiMenuItem-root').eq(5).click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$180.00');
      cy.wait(wait_time);

    // edit the application to 210 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
      cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
      cy.wait(wait_time);

    cy.get('[data-testid="select-permitData.permitDuration"]').click();
    cy.wait(wait_time);

    cy.get('.MuiMenuItem-root').eq(6).click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$210.00');
    cy.wait(wait_time);

    // edit the application to 240 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
    cy.wait(wait_time);

    cy.get('[data-testid="select-permitData.permitDuration"]').click();
    cy.wait(wait_time);

    cy.get('.MuiMenuItem-root').eq(7).click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$240.00');
    cy.wait(wait_time);

    // edit the application to 270 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
    cy.wait(wait_time);

    cy.get('[data-testid="select-permitData.permitDuration"]').click();
    cy.wait(wait_time);

    cy.get('.MuiMenuItem-root').eq(8).click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$270.00');
    cy.wait(wait_time);

    // edit the application to 300 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
    cy.wait(wait_time);

    cy.get('[data-testid="select-permitData.permitDuration"]').click();
    cy.wait(wait_time);

    cy.get('.MuiMenuItem-root').eq(9).click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$300.00');
    cy.wait(wait_time);

    // edit the application to 330 days permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
    cy.wait(wait_time);

    cy.get('[data-testid="select-permitData.permitDuration"]').click();
    cy.wait(wait_time);

    cy.get('.MuiMenuItem-root').eq(10).click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$330.00');
    cy.wait(wait_time);

    // edit the application to 1 year permit duration
    cy.get('.shopping-cart-item__info--application-number')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('.edit-cart-item-dialog__btn--edit')
      .first()
      .click({ force: true });
    cy.wait(wait_time);

    cy.get('[data-testid="select-permitData.permitDuration"]').click();
    cy.wait(wait_time);

    cy.get('.MuiMenuItem-root').eq(11).click();
    cy.wait(wait_time);

    cy.get('[data-testid="continue-application-button"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).click({ force: true });
    });
    cy.wait(wait_time);

    cy.get('[data-testid="add-to-cart-btn"]').click({force: true});
    cy.wait(wait_time);

    cy.visit(cart_url);
    cy.wait(wait_time);

    cy.get('.shopping-cart-item__info--fee')
      .first()
      .should('have.text', '$360.00');
    cy.wait(wait_time);
  });
  
});
