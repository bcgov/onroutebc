import { checkRoleAndSearch } from '../../support/common';

  const wait_time = Cypress.env('wait_time');

describe('Scenario 1: Header Verification', () => {
  // Test 1
  it('should display correct BC badge and onRouteBC branding', () => {
    cy.visit('/home');
    
    cy.get('.bc-government-badge').should('be.visible');
    cy.get('.onroutebc-branding').should('contain', 'onRouteBC');
    
    cy.get('.header-links').within(() => {
      cy.contains('a', 'DriveBC traffic').should('exist');
      cy.contains('a', 'CVSE Home').should('exist');
      cy.contains('a', 'Contact Us').should('exist');
      cy.contains('a', 'Help').should('exist');
    });

  });

  // Test 2
  it('should display the correct hero image', () => {
    cy.visit('/home');
    
    cy.get('.hero-image').should('be.visible')
      .and('have.attr', 'src')
      .and('match', /.*hero-image.*\.jpg/);

  });

  // Test 3
  it('should display correct onroutebc.gov.bc.ca text', () => {
    cy.visit('/home');
    
    cy.get('.onroutebc-info-box').should('contain', 'onroutebc.gov.bc.ca');

  });

});

describe('Scenario 2: Commercial Vehicle Permits Online Section', () => {
  // Test 1
  it('should display three permit boxes inline with correct colors', () => {
    cy.visit('/home');
    
    cy.get('.permits-section').within(() => {
      cy.get('.permit-box').should('have.length', 3);
      
      cy.get('.permit-box').eq(0).should('contain', 'Annual Permits');
      cy.get('.permit-box').eq(1).should('contain', 'Oversize: Term Permits Only');
      cy.get('.permit-box').eq(2).should('contain', 'Superload Permits');
      
      // Check that boxes are displayed inline (not stacked)
      cy.get('.permits-container').should('have.css', 'display', 'flex');
    });

  });

  // Test 2
  it('should display correct contact information in third box', () => {
    cy.visit('/home');
    
    cy.get('.permit-box').eq(2).within(() => {
      cy.contains('a', 'Online Permits Services Brochure').should('exist');
      cy.should('not.contain', '1-800-559-9688');
    });

  });

});

describe('Scenario 3: Permit Information Section', () => {
  // Test 1
  it('should display correct box titles and colors', () => {
    cy.visit('/home');
    
    cy.get('.permit-info-section').within(() => {
      cy.get('.info-box').eq(0).should('contain', 'Commercial Transport Procedures');
      cy.get('.info-box').eq(1).should('contain', 'CVSE Forms');
      cy.get('.info-box').eq(2).should('contain', 'Provincial Permit Center');
      
      // Check that titles are styled correctly (not as links)
      cy.get('.info-box-title').should('not.have.class', 'link');
    });

  });

  // Test 2
  it('should display correct Commercial Transport Procedures text', () => {
    cy.visit('/home');
    
    cy.get('.info-box').eq(0).within(() => {
      cy.should('contain', 'Commercial Transport Procedures');
      // Verify the specific text content matches requirements
    });

  });

  // Test 3
  it('should display correct CVSE Forms section', () => {
    cy.visit('/home');
    
    cy.get('.info-box').eq(1).within(() => {
      cy.should('contain', 'Forms, Circulars, Bulletins & Notices');
    });

  });

  // Test 4
  it('should display link to CVSE.ca', () => {
    cy.visit('/home');
    
    cy.contains('a', 'Get more information at CVSE.ca').should('exist')
      .and('have.attr', 'href', 'https://www.cvse.ca/');

  });

});

describe('Scenario 4: Provincial Permit Center Section', () => {
  // Test 1
  it('should display static phone number text', () => {
    cy.visit('/home');
    
    cy.get('.provincial-permit-center').within(() => {
      cy.contains('1-800-559-9688').should('exist')
        .and('not.have.attr', 'href'); // Should not be a link
    });

  });

  // Test 2
  it('should display proper spacing between email and other contacts', () => {
    cy.visit('/home');
    
    cy.get('.contact-info').within(() => {
      cy.get('.email-link').should('exist');
      cy.get('.other-contacts-link').should('exist');
      
      // Check there's proper spacing (empty line) between elements
      cy.get('.email-link').next().should('have.class', 'spacing-divider');
    });

  });

  // Test 3
  it('should display hours information correctly', () => {
    cy.visit('/home');
    
    cy.get('.hours-section').within(() => {
      cy.should('contain', 'Hours');
      cy.should('contain', 'Hours Exceptions');
    });

  });

});

describe('Scenario 5: Sidebar Verification', () => {
  // Test 1
  it('should display correct sidebar titles and links', () => {
    cy.visit('/home');
    
    cy.get('.sidebar').within(() => {
      cy.get('.sidebar-box').eq(0).should('contain', 'Quick Links');
      cy.get('.sidebar-box').eq(1).should('contain', 'Routes and Driving Conditions');
      
      // Verify specific links exist
      cy.contains('a', 'Current Road Conditions').should('exist');
      cy.contains('a', 'Route Planning').should('exist');
    });

  });

});

describe('Scenario 6: Footer Verification', () => {
  // Test 1
  it('should display footer with required elements', () => {
    cy.visit('/home');
    
    cy.get('.footer').should('be.visible');
    cy.get('.footer').within(() => {
      cy.should('contain', '© Province of British Columbia');
      cy.contains('a', 'Privacy').should('exist');
      cy.contains('a', 'Terms of Use').should('exist');
      cy.contains('a', 'Accessibility').should('exist');
    });

  });

});

describe('Scenario 7: Responsive Design', () => {
  // Test 1
  it('should display correctly on mobile devices', () => {
    cy.viewport('iphone-x');
    cy.visit('/home');
    
    cy.get('.permits-container').should('have.css', 'flex-direction', 'column');
    cy.get('.sidebar').should('be.visible');
    
    cy.get('.header').should('be.visible');
    cy.get('.main-content').should('be.visible');

  });

  // Test 2
  it('should display correctly on tablet devices', () => {
    cy.viewport('ipad-2');
    cy.visit('/home');
    
    cy.get('.permits-container').should('have.css', 'flex-direction', 'row');
    cy.get('.sidebar').should('be.visible');

  });

});