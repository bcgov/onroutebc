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

// Helper functions for permit application
const navigateToPermitsPage = () => {
    const permits_url = '/';
    cy.visit(permits_url);
    cy.wait(wait_time);
}

const startPermitApplication = (permit_type) => {
    const new_tros_url = '/create-application/TROS';
    cy.visit(new_tros_url);
    cy.wait(wait_time);
}

const verifyHeaderInformation = () => {
    cy.url().should('include', '/create-application/TROS');
    
    // Verify permit type name
    cy.get('[data-testid="application-title"]').should('be.visible');
    


    
    // // Verify application number (may not be displayed initially)
    // cy.get('[data-testid="company-banner-client"]').should('exist');
    
    // Verify company name
    cy.get('[data-testid="company-banner-name"]').should('exist').and('not.be.empty');
    
    // Verify onRouteBC client number
    cy.get('[data-testid="company-banner-client"]').should('exist').and('not.be.empty');
    
    // Verify company information confirmation message
    cy.get('[data-testid="company-info-header-desc"]').should('exist');
    
    // Verify company mailing address
    cy.get('[data-testid="company-mail-addr-line1"]').should('exist').and('not.be.empty');
}

const verifyContactInformation = () => {
    cy.get('[data-testid="input-permitData.contactDetails.firstName"]').should('exist').and('not.be.empty');
    cy.get('[data-testid="input-permitData.contactDetails.lastName"]').should('exist').and('not.be.empty');
    cy.get('[name="permitData.contactDetails.phone1"]').should('exist').and('not.be.empty');
    cy.get('[name="permitData.contactDetails.email"]').should('exist').and('not.be.empty');
}

const editContactInformation = () => {
    cy.get('[data-cy="edit-contact-button"]').click();
    cy.wait(wait_time);
}

const updateContactField = (fieldName, value) => {
    cy.get(`[data-cy="contact-${fieldName.toLowerCase().replace(/\s+/g, '-')}"]`).clear().type(value);
    cy.wait(wait_time);
}

const saveContactChanges = () => {
    cy.get('[data-cy="save-contact-button"]').click();
    cy.wait(wait_time);
}

const cancelContactEdit = () => {
    cy.get('[data-cy="cancel-contact-button"]').click();
    cy.wait(wait_time);
}

const verifyContactFieldValue = (fieldName, expectedValue) => {
    cy.get(`[data-cy="contact-${fieldName.toLowerCase().replace(/\s+/g, '-')}"]`).should('have.value', expectedValue);
}

const verifyErrorDisplayed = (expectedError) => {
    cy.get('.error-message').should('contain', expectedError);
}

const verifySuccessMessage = (expectedMessage) => {
    cy.get('.success-message').should('contain', expectedMessage);
}

describe('Scenario 1: View company information', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
    });

    // Test 1: Header information all displayed
    it('should display all required header information in permit application', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        verifyHeaderInformation();
        
    });

});

describe('Scenario 2: View contact information', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToPermitsPage();
    });

    // Test 1: Contact information displayed from My Information page
    it('should display contact details from user profile', () => {
        startPermitApplication('Term Oversize (TROS)');
        
        verifyContactInformation();
        
    });

    // // Test 2: Contact information format validation
    // it('should display contact information in correct format', () => {
    //     startPermitApplication('Term Oversize (TROS)');
        
    //     // Verify email format
    //     cy.get('[data-cy="email-address"]').should('match', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        
    //     // Verify phone format (basic validation)
    //     cy.get('[data-cy="phone-number"]').invoke('text').then(phone => {
    //         expect(phone).to.match(/^[\d\s\-\(\)]+$/);
    //     });
    // });

});

// describe('Scenario 3: Edit contact information', () => {
//     beforeEach(() => {
//         user_role = user_ca['user_role'];
//         loginLogoutAs(user_role, expectSuccessLoginLogout);
//         navigateToPermitsPage();
//     });

//     // Test 1: Allow editing contact information
//     it('should allow editing contact details during permit application', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         // Get original values
//         let originalPhone, originalEmail;
//         cy.get('[data-cy="phone-number"]').invoke('val').then(val => originalPhone = val);
//         cy.get('[data-cy="email-address"]').invoke('val').then(val => originalEmail = val);
        
//         // Edit contact information
//         editContactInformation();
        
//         // Update fields
//         updateContactField('Phone Number', '250-555-0123');
//         updateContactField('Email Address', 'test@example.com');
        
//         saveContactChanges();
        
//         // Verify changes are saved
//         verifyContactFieldValue('Phone Number', '250-555-0123');
//         verifyContactFieldValue('Email Address', 'test@example.com');
        
//         // Restore original values
//         editContactInformation();
//         updateContactField('Phone Number', originalPhone);
//         updateContactField('Email Address', originalEmail);
//         saveContactChanges();
//     });

//     // Test 2: Cancel editing contact information
//     it('should cancel contact editing and restore original values', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         // Get original values
//         let originalPhone, originalEmail;
//         cy.get('[data-cy="phone-number"]').invoke('val').then(val => originalPhone = val);
//         cy.get('[data-cy="email-address"]').invoke('val').then(val => originalEmail = val);
        
//         // Edit contact information
//         editContactInformation();
        
//         // Update fields
//         updateContactField('Phone Number', '250-555-9999');
//         updateContactField('Email Address', 'cancel@example.com');
        
//         // Cancel editing
//         cancelContactEdit();
        
//         // Verify original values are restored
//         verifyContactFieldValue('Phone Number', originalPhone);
//         verifyContactFieldValue('Email Address', originalEmail);
//     });

//     // Test 3: Validate contact information fields
//     it('should validate contact information fields', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         editContactInformation();
        
//         // Test invalid email
//         updateContactField('Email Address', 'invalid-email');
//         saveContactChanges();
//         verifyErrorDisplayed('Please enter a valid email address');
        
//         // Test invalid phone
//         updateContactField('Email Address', 'test@example.com');
//         updateContactField('Phone Number', 'abc');
//         saveContactChanges();
//         verifyErrorDisplayed('Please enter a valid phone number');
        
//         cancelContactEdit();
//     });

// });

// describe('Scenario 4: Company information confirmation', () => {
//     beforeEach(() => {
//         user_role = user_ca['user_role'];
//         loginLogoutAs(user_role, expectSuccessLoginLogout);
//         navigateToPermitsPage();
//     });

//     // Test 1: Display company information confirmation message
//     it('should show company information confirmation message', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         cy.get('[data-cy="company-confirmation-message"]').should('contain', 'If the Company Mailing Address');
//     });

//     // Test 2: Allow editing company information
//     it('should allow editing company information if needed', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         // Click edit company information
//         cy.get('[data-cy="edit-company-button"]').click();
//         cy.wait(wait_time);
        
//         // Verify redirected to company edit page
//         cy.url().should('include', '/edit-company');
        
//         // Go back to permit application
//         cy.get('[data-cy="back-to-application"]').click();
//         cy.wait(wait_time);
//         cy.url().should('include', '/permit-application');
//     });

// });

// describe('Scenario 5: Permit application header persistence', () => {
//     beforeEach(() => {
//         user_role = user_ca['user_role'];
//         loginLogoutAs(user_role, expectSuccessLoginLogout);
//         navigateToPermitsPage();
//     });

//     // Test 1: Header information persists across application pages
//     it('should maintain header information across all application steps', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         // Verify header on initial page
//         verifyHeaderInformation();
        
//         // Navigate to next step (vehicle details)
//         cy.get('[data-cy="continue-button"]').click();
//         cy.wait(wait_time);
        
//         // Verify header is still visible
//         cy.get('.permit-header').should('be.visible');
//         cy.get('[data-cy="permit-type-name"]').should('exist');
//         cy.get('[data-cy="company-name"]').should('exist');
        
//         // Navigate to review page
//         cy.get('[data-cy="continue-button"]').click();
//         cy.wait(wait_time);
        
//         // Verify header is still visible
//         cy.get('.permit-header').should('be.visible');
//         cy.get('[data-cy="permit-type-name"]').should('exist');
//         cy.get('[data-cy="company-name"]').should('exist');
//     });

// });

// describe('Scenario 6: Contact information validation', () => {
//     beforeEach(() => {
//         user_role = user_ca['user_role'];
//         loginLogoutAs(user_role, expectSuccessLoginLogout);
//         navigateToPermitsPage();
//     });

//     // Test 1: Require valid email format
//     it('should require valid email format', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         editContactInformation();
        
//         // Test various invalid email formats
//         const invalidEmails = ['invalid', 'test@', 'test.com', '@test.com', 'test@.com'];
        
//         invalidEmails.forEach(email => {
//             updateContactField('Email Address', email);
//             saveContactChanges();
//             verifyErrorDisplayed('Please enter a valid email address');
//         });
        
//         cancelContactEdit();
//     });

//     // Test 2: Require valid phone format
//     it('should require valid phone format', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         editContactInformation();
        
//         // Test various invalid phone formats
//         const invalidPhones = ['abc', '123', '1-2-3', 'phone'];
        
//         invalidPhones.forEach(phone => {
//             updateContactField('Phone Number', phone);
//             saveContactChanges();
//             verifyErrorDisplayed('Please enter a valid phone number');
//         });
        
//         cancelContactEdit();
//     });

//     // Test 3: Accept valid phone formats
//     it('should accept various valid phone formats', () => {
//         startPermitApplication('Term Oversize (TROS)');
        
//         editContactInformation();
        
//         // Test various valid phone formats
//         const validPhones = ['250-555-0123', '(250) 555-0123', '2505550123', '1 250 555 0123'];
        
//         validPhones.forEach(phone => {
//             updateContactField('Phone Number', phone);
//             updateContactField('Email Address', 'test@example.com');
//             saveContactChanges();
            
//             // Should not show error for valid format
//             cy.get('.error-message').should('not.exist');
            
//             editContactInformation(); // Re-enter edit mode for next test
//         });
        
//         cancelContactEdit();
//     });

// });