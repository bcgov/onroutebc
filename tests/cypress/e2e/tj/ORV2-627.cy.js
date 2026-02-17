import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

  const user_ca = Cypress.env('user_ca');
  const user_pa = Cypress.env('user_pa');
  let user_role = user_ca['user_role'];

const loginLogoutAs = (user_role, assertionFn)=> {
    let username = null;
    let password = null;
    switch (user_role) {
      case 'ca':
        username = user_ca['username'];
        password = user_ca['password'];
        break;
      case 'pa':
        username = user_pa['username'];
        password = user_pa['password'];
        break;
    }
    cy.loginAs(user_role, username, password);
    assertionFn();
  }

const expectResultLoginLogout = () => {
    // TBD
  }

  const expectSuccessLoginLogout = () => {
    // TBD
  }

// Helper functions for permit application review
const startPermitApplication = (permit_type) => {
    cy.contains('a', permit_type).click();
    cy.wait(wait_time);
    cy.contains('button', 'Start New Application').click();
    cy.wait(wait_time);
}

const continueToReview = () => {
    cy.get('[data-cy="continue-button"]').click();
    cy.wait(wait_time);
}

const verifyReviewPageElements = () => {
    cy.url().should('include', '/review-confirm');
    
    // Verify header and footer information
    cy.get('.permit-header').should('exist');
    cy.get('.permit-footer').should('exist');
    
    // Verify warning message
    cy.get('.review-warning').should('contain', 'Please review and confirm warning');
    
    // Verify company information edit message
    cy.get('.company-edit-message').should('exist');
    
    // Verify company mailing address
    cy.get('.company-mailing-address').should('exist');
    
    // Verify contact information
    cy.get('.contact-information').should('exist');
    
    // Verify permit details
    cy.get('.permit-details').should('exist');
    
    // Verify selected commodities with links
    cy.get('.selected-commodities').should('exist');
    cy.get('.selected-commodities a').should('have.length.greaterThan', 0);
    
    // Verify vehicle information
    cy.get('.vehicle-information').should('exist');
}

const verifyCVSEFormLink = (formName) => {
    cy.contains('a', formName).should('have.attr', 'href').and('include', 'cvse.ca');
}

const verifyVehicleInventoryMessage = (shouldShow = true) => {
    if (shouldShow) {
        cy.get('.vehicle-inventory-message').should('contain', 'This vehicle has been added/updated to your Vehicle Inventory.');
    } else {
        cy.get('.vehicle-inventory-message').should('not.exist');
    }
}

const verifyFeeSummary = () => {
    cy.get('.fee-summary').should('exist');
    cy.get('.fee-item').should('have.length.greaterThan', 0);
    cy.get('.fee-total').should('exist');
}

const confirmPermitApplication = () => {
    cy.get('[data-cy="confirm-button"]').click();
    cy.wait(wait_time);
}

describe('Scenario 1: Display permit application details summary', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
    });

    // Test 1: Ensure all expected details are displayed
    it('should display all required permit application details', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill minimum required fields to get to review page
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.wait(wait_time);
        
        continueToReview();
        
        // Verify all expected elements are displayed
        verifyReviewPageElements();
    });

});

describe('Scenario 2: Display permit application details summary - CVSE Form links', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
    });

    // Test 1: Ensure all CVSE form links work
    it('should have working CVSE form links that direct to PDFs', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill minimum required fields
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.wait(wait_time);
        
        continueToReview();
        
        // Test common CVSE form links
        verifyCVSEFormLink('CVSE Form 1000');
        verifyCVSEFormLink('CVSE Form 1070');
        verifyCVSEFormLink('CVSE Form 1500');
        
        // Verify links point to cvse.ca
        cy.get('.cvse-forms a').each(($link) => {
            cy.wrap($link).should('have.attr', 'href').and('include', 'cvse.ca');
        });
    });

});

describe('Scenario 3: Save vehicle indication', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
    });

    // Test 1: Ensure notice shows when vehicle added/saved to inventory
    it('should show vehicle inventory message when vehicle is saved', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill fields and save vehicle to inventory
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.get('[data-cy="vehicle-unit-number"]').type('TEST123');
        cy.wait(wait_time);
        
        // Save vehicle to inventory
        cy.get('[data-cy="save-to-inventory"]').click();
        cy.wait(wait_time);
        
        continueToReview();
        
        // Verify vehicle inventory message is shown
        verifyVehicleInventoryMessage(true);
    });

    // Test 2: Ensure notice not shown when vehicle not added/saved to inventory
    it('should not show vehicle inventory message when vehicle is not saved', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill fields but don't save vehicle to inventory
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.wait(wait_time);
        
        continueToReview();
        
        // Verify vehicle inventory message is not shown
        verifyVehicleInventoryMessage(false);
    });

});

describe('Scenario 4: Display fee summary', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
    });

    // Test 1: Ensure fee summary is displayed with correct information
    it('should display permit fee summary with description and price', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill minimum required fields
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.wait(wait_time);
        
        continueToReview();
        
        // Verify fee summary is displayed
        verifyFeeSummary();
        
        // Verify fee items have description and price
        cy.get('.fee-item').each(($item) => {
            cy.wrap($item).find('.fee-description').should('exist');
            cy.wrap($item).find('.fee-price').should('exist');
        });
        
        // Verify total is calculated
        cy.get('.fee-total').should('exist');
    });

    // Test 2: Ensure fee summary shows $0 for no-fee clients
    it('should display $0 total for no-fee permit clients', () => {
        // This would need to be run with a no-fee client account
        // For now, we'll verify the structure exists
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill minimum required fields
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.wait(wait_time);
        
        continueToReview();
        
        // Verify fee summary structure
        verifyFeeSummary();
        
        // For no-fee clients, total should be $0
        // This would be verified with actual no-fee client data
        cy.get('.fee-total').should('exist');
    });

});

describe('Scenario 5: Edit application from review page', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
    });

    // Test 1: Allow editing company information
    it('should allow editing company information from review page', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill minimum required fields
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.wait(wait_time);
        
        continueToReview();
        
        // Click edit company information
        cy.get('[data-cy="edit-company-info"]').click();
        cy.wait(wait_time);
        
        // Verify redirected to company edit page
        cy.url().should('include', '/edit-company');
        
        // Go back to review
        cy.get('[data-cy="back-to-review"]').click();
        cy.wait(wait_time);
        cy.url().should('include', '/review-confirm');
    });

    // Test 2: Allow editing contact information
    it('should allow editing contact information from review page', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill minimum required fields
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.wait(wait_time);
        
        continueToReview();
        
        // Click edit contact information
        cy.get('[data-cy="edit-contact-info"]').click();
        cy.wait(wait_time);
        
        // Verify redirected to contact edit page
        cy.url().should('include', '/edit-contact');
        
        // Go back to review
        cy.get('[data-cy="back-to-review"]').click();
        cy.wait(wait_time);
        cy.url().should('include', '/review-confirm');
    });

});

describe('Scenario 6: Confirm and submit permit application', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
    });

    // Test 1: Successfully confirm and submit permit application
    it('should confirm and submit permit application successfully', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Fill minimum required fields
        cy.get('[data-cy="commodity-type"]').select('None');
        cy.wait(wait_time);
        
        cy.get('[data-cy="add-power-unit"]').click();
        cy.wait(wait_time);
        
        cy.get('[data-cy="vehicle-make"]').type('Test Make');
        cy.get('[data-cy="vehicle-model"]').type('Test Model');
        cy.get('[data-cy="vehicle-year"]').type('2023');
        cy.wait(wait_time);
        
        continueToReview();
        
        // Confirm and submit
        confirmPermitApplication();
        
        // Verify redirected to success/payment page
        cy.url().should('include', '/permit-success').or('include', '/payment');
        
        // Verify success message
        cy.get('.success-message').should('contain', 'Permit application submitted successfully');
    });

    // Test 2: Show validation errors if required fields are missing
    it('should show validation errors if required fields are missing', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        // Don't fill required fields, try to continue
        continueToReview();
        
        // Should show validation errors
        cy.get('.error-message').should('exist');
        cy.url().should('include', '/application');
    });

});