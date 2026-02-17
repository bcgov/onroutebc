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

// Helper functions for permit application details
const startPermitApplication = (permit_type) => {
    cy.contains('a', permit_type).click();
    cy.wait(wait_time);
    cy.contains('button', 'Start New Application').click();
    cy.wait(wait_time);
}

const setStartDate = (date) => {
    cy.get('[data-cy="start-date"]').clear().type(date);
    cy.wait(wait_time);
}

const setPermitDuration = (duration) => {
    cy.get('[data-cy="permit-duration"]').select(duration);
    cy.wait(wait_time);
}

const continueToNextStep = () => {
    cy.get('[data-cy="continue-button"]').click();
    cy.wait(wait_time);
}

const verifyErrorDisplayed = (expectedError) => {
    cy.get('.error-message').should('contain', expectedError);
}

const verifyNoError = () => {
    cy.get('.error-message').should('not.exist');
}

const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
}

const getFutureDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

const getPastDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
}

const verifyDateAccepted = () => {
    // Continue to next step to verify date was accepted
    continueToNextStep();
    cy.url().should('not.include', '/permit-application');
    
    // Go back to test next date
    cy.go('back');
    cy.wait(wait_time);
}

describe('Scenario 1: Permit start date accepted', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        startPermitApplication('Term Oversize (TROS)');
    });

    // Test 1: Happy Path – today's date
    it('should accept today\'s date as start date', () => {
        const today = getCurrentDate();
        setStartDate(today);
        verifyNoError();
        verifyDateAccepted();
    });

    // Test 2: Happy Path – tomorrow's date
    it('should accept tomorrow\'s date as start date', () => {
        const tomorrow = getFutureDate(1);
        setStartDate(tomorrow);
        verifyNoError();
        verifyDateAccepted();
    });

    // Test 3: Happy Path – today +14 days
    it('should accept date 14 days in the future', () => {
        const futureDate = getFutureDate(14);
        setStartDate(futureDate);
        verifyNoError();
        verifyDateAccepted();
    });

    // Test 4: Error case – today +15 days
    it('should reject date 15 days in the future', () => {
        const futureDate = getFutureDate(15);
        setStartDate(futureDate);
        verifyErrorDisplayed('Start date cannot be more than 14 days in the future');
    });

});

describe('Scenario 2: Permit start date not accepted', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        startPermitApplication('Term Oversize (TROS)');
    });

    // Test 1: Happy Path – today's date (reference test)
    it('should accept today\'s date as start date', () => {
        const today = getCurrentDate();
        setStartDate(today);
        verifyNoError();
    });

    // Test 2: Error case – today's date – 1 day
    it('should reject date 1 day in the past', () => {
        const pastDate = getPastDate(1);
        setStartDate(pastDate);
        verifyErrorDisplayed('Start Date cannot be in the past');
    });

    // Test 3: Error case – today's date – 1 month
    it('should reject date 1 month in the past', () => {
        const pastDate = getPastDate(30);
        setStartDate(pastDate);
        verifyErrorDisplayed('Start Date cannot be in the past');
    });

});

describe('Scenario 3: Permit duration', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        startPermitApplication('Term Oversize (TROS)');
        
        // Set valid start date
        const today = getCurrentDate();
        setStartDate(today);
    });

    // Test 1: Verify available duration options
    it('should display correct duration options for permit type', () => {
        // Check available duration options
        cy.get('[data-cy="permit-duration"]').find('option').then(($options) => {
            const durations = Array.from($options).map(opt => opt.text);
            
            // Verify common duration options exist
            expect(durations).to.include('30 days');
            expect(durations).to.include('60 days');
            expect(durations).to.include('90 days');
            expect(durations).to.include('180 days');
            expect(durations).to.include('1 year');
        });
    });

    // Test 2: Accept valid duration selection
    it('should accept valid permit duration selection', () => {
        setPermitDuration('30 days');
        verifyNoError();
        
        continueToNextStep();
        cy.url().should('not.include', '/permit-application');
    });

    // Test 3: Verify duration affects end date calculation
    it('should calculate correct end date based on duration', () => {
        const today = getCurrentDate();
        setStartDate(today);
        
        // Test 30 days duration
        setPermitDuration('30 days');
        
        // Verify end date is calculated correctly
        cy.get('[data-cy="calculated-end-date"]').should('exist');
        
        // End date should be start date + duration - 1 day
        const expectedEndDate = getFutureDate(29); // 30 days - 1 day
        cy.get('[data-cy="calculated-end-date"]').should('contain', expectedEndDate);
    });

});

describe('Scenario 4: Date validation edge cases', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        startPermitApplication('Term Oversize (TROS)');
    });

    // Test 1: Invalid date format
    it('should reject invalid date format', () => {
        setStartDate('invalid-date');
        verifyErrorDisplayed('Please enter a valid date');
    });

    // Test 2: Empty date
    it('should reject empty start date', () => {
        setStartDate('');
        verifyErrorDisplayed('Start date is required');
    });

    // Test 3: Boundary test – exactly 14 days
    it('should accept date exactly 14 days in the future', () => {
        const futureDate = getFutureDate(14);
        setStartDate(futureDate);
        verifyNoError();
    });

    // Test 4: Boundary test – exactly 15 days
    it('should reject date exactly 15 days in the future', () => {
        const futureDate = getFutureDate(15);
        setStartDate(futureDate);
        verifyErrorDisplayed('Start date cannot be more than 14 days in the future');
    });

});

describe('Scenario 5: Permit type specific date rules', () => {
    // Test 1: Single Trip Oversize (STOS) date rules
    it('should apply STOS specific date rules', () => {
        startPermitApplication('Single Trip Oversize (STOS)');
        
        const today = getCurrentDate();
        setStartDate(today);
        verifyNoError();
        
        // STOS may have different duration options
        cy.get('[data-cy="permit-duration"]').find('option').then(($options) => {
            const durations = Array.from($options).map(opt => opt.text);
            
            // STOS typically has shorter durations
            expect(durations).to.include('1 day');
            expect(durations).to.include('7 days');
        });
    });

    // Test 2: Annual permit date rules
    it('should apply annual permit specific date rules', () => {
        startPermitApplication('Annual Oversize');
        
        const today = getCurrentDate();
        setStartDate(today);
        verifyNoError();
        
        // Annual permits may have different start date rules
        cy.get('[data-cy="permit-duration"]').find('option').then(($options) => {
            const durations = Array.from($options).map(opt => opt.text);
            
            // Annual permits should have 1 year option
            expect(durations).to.include('1 year');
        });
    });

});

describe('Scenario 6: Date picker functionality', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        startPermitApplication('Term Oversize (TROS)');
    });

    // Test 1: Date picker opens and closes correctly
    it('should open and close date picker correctly', () => {
        cy.get('[data-cy="start-date"]').click();
        cy.wait(wait_time);
        
        // Verify date picker is open
        cy.get('.date-picker').should('be.visible');
        
        // Click outside to close
        cy.get('body').click(0, 0);
        cy.wait(wait_time);
        
        // Verify date picker is closed
        cy.get('.date-picker').should('not.be.visible');
    });

    // Test 2: Date picker allows date selection
    it('should allow date selection from date picker', () => {
        cy.get('[data-cy="start-date"]').click();
        cy.wait(wait_time);
        
        // Select today from date picker
        cy.get('.date-picker .today').click();
        cy.wait(wait_time);
        
        // Verify date was set
        const today = getCurrentDate();
        cy.get('[data-cy="start-date"]').should('have.value', today);
    });

    // Test 3: Date picker highlights invalid dates
    it('should highlight invalid dates in date picker', () => {
        cy.get('[data-cy="start-date"]').click();
        cy.wait(wait_time);
        
        // Past dates should be disabled/highlighted as invalid
        cy.get('.date-picker .past-day').should('have.class', 'disabled');
        
        // Dates beyond 14 days should be disabled/highlighted as invalid
        cy.get('.date-picker .future-disabled').should('have.class', 'disabled');
    });

});

describe('Scenario 7: Cross-browser date compatibility', () => {
    // Test 1: Chrome/Edge date input compatibility
    it('should work with Chrome/Edge date input', () => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        startPermitApplication('Term Oversize (TROS)');
        
        const today = getCurrentDate();
        setStartDate(today);
        verifyNoError();
    });

});

describe('Scenario 8: Permit date persistence', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        startPermitApplication('Term Oversize (TROS)');
    });

    // Test 1: Date persists when navigating between steps
    it('should persist start date when navigating between application steps', () => {
        const today = getCurrentDate();
        setStartDate(today);
        setPermitDuration('30 days');
        
        // Continue to next step
        continueToNextStep();
        cy.wait(wait_time);
        
        // Go back to permit details
        cy.go('back');
        cy.wait(wait_time);
        
        // Verify date is still set
        cy.get('[data-cy="start-date"]').should('have.value', today);
        cy.get('[data-cy="permit-duration"]').should('have.value', '30 days');
    });

    // Test 2: Date persists after page refresh
    it('should persist start date after page refresh', () => {
        const today = getCurrentDate();
        setStartDate(today);
        setPermitDuration('30 days');
        
        // Refresh page
        cy.reload();
        cy.wait(wait_time);
        
        // Verify date is still set (if using local storage/session storage)
        cy.get('[data-cy="start-date"]').should('have.value', today);
        cy.get('[data-cy="permit-duration"]').should('have.value', '30 days');
    });

});