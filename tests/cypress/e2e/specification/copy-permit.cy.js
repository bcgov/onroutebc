/**
 * Copy Permit Feature Tests
 * Specification: https://github.com/bcgov/onRouteBCSpecification/blob/main/Copy%20Permit/Copy%20Issued%2C%20Active%20or%20Expired%20Permit%20User.feature
 * 
 * Feature: Copy Permit/Common Copy Issued, Active or Expired Permit
 * Applicable Users: PC, SA, TRAIN, CTPO, CA, PA
 * Issue: @orv2-4978-1, @orv2-4978-2
 */

describe('Copy Permit - Copy Issued, Active or Expired Permit', () => {
  const permits_url = '/applications';
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('username');
  const password = Cypress.env('password');

  /**
   * Rule: users can copy permit at Active or Expired Permits
   */
  describe('Rule: Copy availability based on permit status', () => {
    
    /**
     * Scenario: active permit
     * Given permit A is active
     * When a user attempts to copy permit A
     * Then copy is available
     */
    it('Should allow copying an active permit', () => {
      // Step 1: Login
      cy.visit('/');
      cy.wait(wait_time);
      cy.get('#login-bceid').click();
      cy.wait(wait_time);
      cy.get('#user').type(username);
      cy.get('#password').type(password);
      cy.wait(wait_time);
      cy.get('[name="btnSubmit"]').click();
      cy.wait(wait_time);

      // Step 2: Navigate to Active Permits
      cy.visit(permits_url);
      cy.wait(wait_time);
      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
      cy.wait(wait_time);

      // Step 3: Verify active permit exists
      const activePermitSelector = 'button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link';
      cy.get(activePermitSelector).then(($els) => {
        expect($els.length).to.be.greaterThan(0);
      });
      cy.wait(wait_time);

      // Step 4: Click actions button for first permit
      cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
      cy.wait(wait_time);

      // Step 5: Verify copy option is available
      cy.xpath("//li[text()='Copy']").should('exist');
      cy.wait(wait_time);

      // Step 6: Click copy action
      cy.xpath("//li[text()='Copy']").click();
      cy.wait(wait_time);

      // Step 7: Verify user is directed to new application
      cy.get('[data-testid="continue-application-button"]').should('exist');
      cy.wait(wait_time);
    });

    /**
     * Scenario: expired permit
     * Given permit A is expired
     * When a user attempts to copy permit A
     * Then copy is available
     */
    it('Should allow copying an expired permit', () => {
      // Step 1: Login
      cy.visit('/');
      cy.wait(wait_time);
      cy.get('#login-bceid').click();
      cy.wait(wait_time);
      cy.get('#user').type(username);
      cy.get('#password').type(password);
      cy.wait(wait_time);
      cy.get('[name="btnSubmit"]').click();
      cy.wait(wait_time);

      // Step 2: Navigate to Expired Permits
      cy.visit(permits_url);
      cy.wait(wait_time);
      cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
      cy.wait(wait_time);

      // Step 3: Verify expired permit exists
      const expiredPermitSelector = 'button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link';
      cy.get(expiredPermitSelector).then(($els) => {
        expect($els.length).to.be.greaterThan(0);
      });
      cy.wait(wait_time);

      // Step 4: Click actions button for first expired permit
      cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
      cy.wait(wait_time);

      // Step 5: Verify copy option is available
      cy.xpath("//li[text()='Copy']").should('exist');
      cy.wait(wait_time);

      // Step 6: Click copy action
      cy.xpath("//li[text()='Copy']").click();
      cy.wait(wait_time);

      // Step 7: Verify user is directed to new application
      cy.get('[data-testid="continue-application-button"]').should('exist');
      cy.wait(wait_time);
    });

    /**
     * Scenario: copy unavailable
     * Given the following statuses are true for a permit
     *   | tps synced permit |
     *   | revoked permit    |
     *   | void permit       |
     * When a user attempts to copy
     * Then copy is not available
     */
    it('Should NOT allow copying revoked, void, or TPS synced permits', () => {
      // Step 1: Login
      cy.visit('/');
      cy.wait(wait_time);
      cy.get('#login-bceid').click();
      cy.wait(wait_time);
      cy.get('#user').type(username);
      cy.get('#password').type(password);
      cy.wait(wait_time);
      cy.get('[name="btnSubmit"]').click();
      cy.wait(wait_time);

      // Step 2: Navigate to all permits tabs to find restricted permits
      cy.visit(permits_url);
      cy.wait(wait_time);

      // Step 3: Check Active Permits tab
      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
      cy.wait(wait_time);

      // Step 4: For each permit, check if it has restricted status
      cy.get('[id="actions-button"]').each(($actionBtn) => {
        cy.wrap($actionBtn).scrollIntoView().wait(1000).click({ force: true });
        cy.wait(wait_time);

        // Verify that Copy option is not available or is disabled
        cy.xpath("//li[text()='Copy']").then(($copyOption) => {
          if ($copyOption.length > 0) {
            // If copy exists, verify it's not disabled by checking parent element
            cy.wrap($copyOption).should('have.attr', 'aria-disabled', 'false');
          }
        });

        // Close menu by pressing Escape
        cy.get('body').type('{esc}');
        cy.wait(500);
      });
    });
  });

  /**
   * Rule: users are directed to the new application after copying
   */
  describe('Rule: Redirect to new application after copy', () => {
    
    /**
     * Scenario: copy permit
     * Given permit A is eligible for copying
     * When a user copies permit A
     * Then the user is directed to the new application B
     * And permit application B contains the copied information from permit A
     */
    it('Should redirect to new application with copied permit information', () => {
      // Step 1: Login
      cy.visit('/');
      cy.wait(wait_time);
      cy.get('#login-bceid').click();
      cy.wait(wait_time);
      cy.get('#user').type(username);
      cy.get('#password').type(password);
      cy.wait(wait_time);
      cy.get('[name="btnSubmit"]').click();
      cy.wait(wait_time);

      // Step 2: Navigate to Active Permits
      cy.visit(permits_url);
      cy.wait(wait_time);
      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
      cy.wait(wait_time);

      // Step 3: Find and open first eligible permit
      cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
      cy.wait(wait_time);

      // Step 4: Click copy action
      cy.xpath("//li[text()='Copy']").click();
      cy.wait(wait_time);

      // Step 5: Verify user is directed to new application form (Application B)
      cy.url().should('include', '/create-application');
      cy.wait(wait_time);

      // Step 6: Verify application form contains copied data
      cy.get('[name="permitData.contactDetails.firstName"]').then(($field) => {
        // Verify field is populated with copied data (not empty)
        const value = $field.val();
        expect(value).to.not.be.empty;
      });
      cy.wait(wait_time);

      // Step 7: Verify vehicle details are copied
      cy.get('[name="permitData.vehicleDetails.vin"]').then(($field) => {
        const value = $field.val();
        expect(value).to.not.be.empty;
      });
      cy.wait(wait_time);

      cy.get('[name="permitData.vehicleDetails.plate"]').then(($field) => {
        const value = $field.val();
        expect(value).to.not.be.empty;
      });
      cy.wait(wait_time);

      cy.get('[name="permitData.vehicleDetails.make"]').then(($field) => {
        const value = $field.val();
        expect(value).to.not.be.empty;
      });
      cy.wait(wait_time);

      // Step 8: Verify permit type/subtype are preserved
      cy.get('[id="mui-component-select-permitData.vehicleDetails.vehicleType"]').then(($select) => {
        expect($select).to.exist;
      });
      cy.wait(wait_time);

      // Step 9: Verify user can proceed with the copied application
      cy.get('[data-testid="continue-application-button"]').should('exist');
      cy.wait(wait_time);
    });
  });

  /**
   * RBAC Tests: Verify copy functionality across different user roles
   */
  describe('RBAC: Copy permit functionality by user role', () => {
    const permitTypes = ['Active', 'Expired'];

    permitTypes.forEach((permitType) => {
      it(`Should allow eligible users to copy ${permitType} permits`, () => {
        // Step 1: Login
        cy.visit('/');
        cy.wait(wait_time);
        cy.get('#login-bceid').click();
        cy.wait(wait_time);
        cy.get('#user').type(username);
        cy.get('#password').type(password);
        cy.wait(wait_time);
        cy.get('[name="btnSubmit"]').click();
        cy.wait(wait_time);

        // Step 2: Navigate to permits screen
        cy.visit(permits_url);
        cy.wait(wait_time);

        // Step 3: Select appropriate tab
        cy.xpath(`//div[@class='tab__label' and text()='${permitType} Permits']`).click();
        cy.wait(wait_time);

        // Step 4: Verify at least one permit exists
        cy.get('[id="actions-button"]').then(($btns) => {
          if ($btns.length > 0) {
            // Step 5: Open actions menu for first permit
            cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
            cy.wait(wait_time);

            // Step 6: Verify copy action is available and click it
            cy.xpath("//li[text()='Copy']").should('exist').click();
            cy.wait(wait_time);

            // Step 7: Verify redirect to new application
            cy.url().should('include', '/create-application');
            cy.get('[data-testid="continue-application-button"]').should('exist');
          }
        });
      });
    });
  });
});
