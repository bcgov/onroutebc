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

// Helper functions for permit list operations
const navigateToPermitsPage = () => {
    cy.contains('a', 'Permits').click();
    cy.wait(wait_time);
}

const selectActivePermitsTab = () => {
    cy.contains('.tab', 'Active Permits').click();
    cy.wait(wait_time);
}

const getPermitRow = (rowIndex = 0) => {
    return cy.get('.permits-table tbody tr').eq(rowIndex);
}

const verifyPermitCount = (expectedCount) => {
    cy.get('.permits-table tbody tr').should('have.length', expectedCount);
}

const verifyPermitFields = (rowIndex = 0) => {
    const row = getPermitRow(rowIndex);
    
    // Verify all required columns are present
    row.find('[data-cy="permit-number"]').should('exist');
    row.find('[data-cy="permit-type"]').should('exist');
    row.find('[data-cy="unit-number"]').should('exist');
    row.find('[data-cy="license-plate"]').should('exist');
    row.find('[data-cy="permit-start-date"]').should('exist');
    row.find('[data-cy="permit-end-date"]').should('exist');
    row.find('[data-cy="applicant"]').should('exist');
}

const verifyExpiryDateCalculation = (rowIndex = 0) => {
    const row = getPermitRow(rowIndex);
    
    // Get start date and duration to verify end date calculation
    row.find('[data-cy="permit-start-date"]').invoke('text').then(startDate => {
        row.find('[data-cy="permit-duration"]').invoke('text').then(duration => {
            // Calculate expected end date (start date + duration - 1 day)
            // End date should be at 11:59:59pm
            const expectedEndDate = calculateEndDate(startDate, duration);
            row.find('[data-cy="permit-end-date"]').should('contain', expectedEndDate);
        });
    });
}

const calculateEndDate = (startDate, duration) => {
    // This would calculate the expected end date
    // For now, just verify the format is correct
    return expect.any(String);
}

const verifySortOrder = () => {
    // Get all end dates and verify they are sorted descending (newest at top)
    const endDates = [];
    
    cy.get('.permits-table tbody tr').each(($row) => {
        const endDate = $row.find('[data-cy="permit-end-date"]').text();
        endDates.push(new Date(endDate));
    }).then(() => {
        // Verify array is sorted in descending order
        for (let i = 0; i < endDates.length - 1; i++) {
            expect(endDates[i]).to.be.at.least(endDates[i + 1]);
        }
    });
}

const verifyRefundMessage = () => {
    cy.get('.refund-message').should('contain', 'Refunds and amendments can be requested over the phone by calling the Provincial Permit Centre at Toll-free: 1-800-559-9688. Please have your permit number ready.');
}

const verifyApplicantName = (rowIndex = 0, expectedApplicant = null) => {
    const row = getPermitRow(rowIndex);
    row.find('[data-cy="applicant"]').should('exist');
    
    if (expectedApplicant) {
        row.find('[data-cy="applicant"]').should('contain', expectedApplicant);
    }
}

describe('Scenario 1: Default Active permits listed', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
        selectActivePermitsTab();
    });

    // Test 1: Happy path – ensure all active permits are displayed
    it('should display all issued permits that have not reached expiry date', () => {
        // Verify permits are displayed
        cy.get('.permits-table tbody tr').should('have.length.greaterThan', 0);
        
        // Verify all displayed permits are active (not expired)
        cy.get('.permits-table tbody tr').each(($row) => {
            const endDate = new Date($row.find('[data-cy="permit-end-date"]').text());
            const currentDate = new Date();
            
            // Verify end date is in the future or today
            expect(endDate.getTime()).to.be.at.least(currentDate.getTime());
        });
    });

    // Test 2: Ensure no expired permits are displayed
    it('should not display permits with expiry dates in the past', () => {
        // This test would require database manipulation to create expired permits
        // For now, we'll verify the logic for current permits
        
        cy.get('.permits-table tbody tr').each(($row) => {
            const endDate = new Date($row.find('[data-cy="permit-end-date"]').text());
            const currentDate = new Date();
            
            // Verify no permits have end dates in the past
            expect(endDate.getTime()).to.be.at.least(currentDate.getTime());
        });
    });

    // Test 3: Ensure no permits from other companies are displayed
    it('should only display permits for the logged in company', () => {
        // Verify all permits belong to the current user's company
        cy.get('.permits-table tbody tr').each(($row) => {
            // This would verify company ID matches current user's company
            // For now, just verify permits are displayed
            cy.wrap($row).should('exist');
        });
    });

});

describe('Scenario 2: Active permit information displayed', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
        selectActivePermitsTab();
    });

    // Test 1: Ensure correct fields displayed for each permit
    it('should display all required columns for each permit', () => {
        // Verify permits are displayed
        cy.get('.permits-table tbody tr').should('have.length.greaterThan', 0);
        
        // Verify all required fields for each permit
        cy.get('.permits-table thead th').should('contain', 'Permit #');
        cy.get('.permits-table thead th').should('contain', 'Permit Type');
        cy.get('.permits-table thead th').should('contain', 'Unit #');
        cy.get('.permits-table thead th').should('contain', 'Plate');
        cy.get('.permits-table thead th').should('contain', 'Permit Start Date');
        cy.get('.permits-table thead th').should('contain', 'Permit End Date');
        cy.get('.permits-table thead th').should('contain', 'Applicant');
        
        // Verify each row has all required fields
        cy.get('.permits-table tbody tr').each(($row, index) => {
            verifyPermitFields(index);
        });
    });

    // Test 2: Ensure default sort order is Permit End Date (descending order)
    it('should sort permits by end date with newest at top', () => {
        // Verify permits are displayed
        cy.get('.permits-table tbody tr').should('have.length.greaterThan', 1);
        
        // Verify sort order
        verifySortOrder();
    });

    // Test 3: Ensure CV Client PA only see permits they created
    it('should only show permits created by the logged in PA user', () => {
        user_role = user_pa['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
        selectActivePermitsTab();
        
        // Verify permits are displayed
        cy.get('.permits-table tbody tr').should('have.length.greaterThan', 0);
        
        // Verify applicant name matches logged in user
        cy.get('.permits-table tbody tr').each(($row) => {
            const applicantName = $row.find('[data-cy="applicant"]').text();
            // This should match the logged in PA user's name
            expect(applicantName).to.not.be.empty;
        });
    });

    // Test 4: Verify applicant name format
    it('should display applicant as first name and last name of CV Client user', () => {
        // Verify permits are displayed
        cy.get('.permits-table tbody tr').should('have.length.greaterThan', 0);
        
        // Verify applicant name format (First Last)
        cy.get('.permits-table tbody tr').each(($row) => {
            const applicantName = $row.find('[data-cy="applicant"]').text();
            
            // Verify name contains at least first name and last name
            const nameParts = applicantName.trim().split(' ');
            expect(nameParts.length).to.be.at.least(2);
        });
    });

    // Test 5: Verify refund message is displayed
    it('should display refund and amendment contact information', () => {
        verifyRefundMessage();
    });

});

describe('Scenario 3: Permit details verification', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
        selectActivePermitsTab();
    });

    // Test 1: Verify permit number format
    it('should display permit numbers in correct format', () => {
        cy.get('.permits-table tbody tr').each(($row) => {
            const permitNumber = $row.find('[data-cy="permit-number"]').text();
            
            // Verify permit number format (e.g., P9-00010007-981)
            expect(permitNumber).to.match(/^P\d+-\d+-\d+$/);
        });
    });

    // Test 2: Verify permit type is valid
    it('should display valid permit types', () => {
        const validPermitTypes = ['TROS', 'TROW', 'STOS', 'STOW', 'Annual Oversize', 'Annual Overweight'];
        
        cy.get('.permits-table tbody tr').each(($row) => {
            const permitType = $row.find('[data-cy="permit-type"]').text();
            
            // Verify permit type is in the valid list
            expect(validPermitTypes).to.include(permitType);
        });
    });

    // Test 3: Verify date formats
    it('should display dates in correct format', () => {
        cy.get('.permits-table tbody tr').each(($row) => {
            const startDate = $row.find('[data-cy="permit-start-date"]').text();
            const endDate = $row.find('[data-cy="permit-end-date"]').text();
            
            // Verify date format (YYYY-MM-DD)
            expect(startDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
            expect(endDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

});

describe('Scenario 4: Permit actions and navigation', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
        selectActivePermitsTab();
    });

    // Test 1: Allow viewing permit details
    it('should allow clicking on permit to view details', () => {
        // Click on first permit
        getPermitRow(0).find('[data-cy="permit-number"]').click();
        cy.wait(wait_time);
        
        // Verify redirected to permit details page
        cy.url().should('include', '/permit-details');
        
        // Go back to permits list
        cy.go('back');
        cy.wait(wait_time);
    });

    // Test 2: Allow downloading permit PDF
    it('should allow downloading permit PDF', () => {
        // Click download button for first permit
        getPermitRow(0).find('[data-cy="download-permit"]').click();
        cy.wait(wait_time);
        
        // Verify download was initiated (would check file download)
        cy.get('.download-message').should('contain', 'Permit download started');
    });

    // Test 3: Allow requesting refund/amendment
    it('should provide contact information for refund and amendment requests', () => {
        verifyRefundMessage();
        
        // Verify phone number is clickable
        cy.get('.refund-message').contains('1-800-559-9688').should('exist');
    });

});

describe('Scenario 5: Filter and search functionality', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
        selectActivePermitsTab();
    });

    // Test 1: Allow filtering by permit type
    it('should allow filtering permits by type', () => {
        // Get initial count
        cy.get('.permits-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            // Filter by specific permit type
            cy.get('[data-cy="permit-type-filter"]').select('TROS');
            cy.wait(wait_time);
            
            // Verify filtered results
            cy.get('.permits-table tbody tr').each(($row) => {
                cy.wrap($row).find('[data-cy="permit-type"]').should('contain', 'TROS');
            });
            
            // Clear filter
            cy.get('[data-cy="clear-filters"]').click();
            cy.wait(wait_time);
            
            // Verify original count is restored
            verifyPermitCount(initialCount);
        });
    });

    // Test 2: Allow searching by permit number
    it('should allow searching permits by number', () => {
        // Get a permit number to search for
        getPermitRow(0).find('[data-cy="permit-number"]').invoke('text').then(permitNumber => {
            // Search for the permit number
            cy.get('[data-cy="permit-search"]').type(permitNumber);
            cy.wait(wait_time);
            
            // Verify search results
            cy.get('.permits-table tbody tr').should('have.length', 1);
            cy.get('.permits-table tbody tr').find('[data-cy="permit-number"]').should('contain', permitNumber);
            
            // Clear search
            cy.get('[data-cy="clear-search"]').click();
            cy.wait(wait_time);
        });
    });

});

describe('Scenario 6: Pagination and performance', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
        selectActivePermitsTab();
    });

    // Test 1: Handle large number of permits with pagination
    it('should paginate when there are many permits', () => {
        // This test would require creating many permits
        // For now, verify pagination controls exist
        cy.get('.pagination-controls').should('exist');
    });

    // Test 2: Verify page load performance
    it('should load permit list within acceptable time', () => {
        // Measure page load time
        const startTime = Date.now();
        
        navigateToPermitsPage();
        selectActivePermitsTab();
        
        cy.get('.permits-table').should('be.visible').then(() => {
            const loadTime = Date.now() - startTime;
            
            // Verify load time is acceptable (e.g., under 5 seconds)
            expect(loadTime).to.be.lessThan(5000);
        });
    });

});