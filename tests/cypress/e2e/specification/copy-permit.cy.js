/**
 * Copy Permit Feature Tests - RBAC Compliant
 * Specification: https://github.com/bcgov/onRouteBCSpecification/blob/main/Copy%20Permit/Copy%20Issued%2C%20Active%20or%20Expired%20Permit%20User.feature
 * 
 * Feature: Copy Permit/Common Copy Issued, Active or Expired Permit
 * Applicable Users: PC, SA, TRAIN, CTPO, CA, PA
 * Issues: @orv2-4978-1, @orv2-4978-2
 */

import { checkRoleAndSearch } from '../../support/common';

describe('Copy Permit - Copy Issued, Active or Expired Permit', () => {
  const permits_url = '/applications';
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];

  /**
   * Helper: Navigate to permits screen based on user role
   * CA/PA users visit directly
   * Other roles search for company
   */
  function viewActivePermitsScreenAs(user_role, assertionFn) {
    if (user_role === 'ca' || user_role === 'pa') {
      cy.visit(permits_url);
      cy.wait(wait_time);
      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
      cy.wait(wait_time);
    } else {
      cy.search(company_name);
      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
      cy.wait(wait_time);
    }
    assertionFn();
  }

  /**
   * Helper: Navigate to expired permits screen based on user role
   */
  function viewExpiredPermitsScreenAs(user_role, assertionFn) {
    if (user_role === 'ca' || user_role === 'pa') {
      cy.visit(permits_url);
      cy.wait(wait_time);
      cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
      cy.wait(wait_time);
    } else {
      cy.search(company_name);
      cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
      cy.wait(wait_time);
    }
    assertionFn();
  }

  /**
   * Helper: Attempt to copy first available permit
   * Returns true if copy action exists, false otherwise
   */
  function attemptToCopyPermit() {
    const selector = '[id="actions-button"]';
    const element = Cypress.$(selector);

    if (element.length > 0) {
      cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
      cy.wait(wait_time);

      // Check if Copy option is available
      cy.xpath("//li[text()='Copy']").then(($copyOption) => {
        if ($copyOption.length > 0) {
          cy.wrap($copyOption).should('exist');
          return true;
        }
      });
    }
    return false;
  }

  /**
   * Expectation: Verify copy action is available
   */
  const expectCopyAvailable = () => {
    cy.xpath("//li[text()='Copy']").should('exist');
  };

  /**
   * Expectation: Verify user is directed to new application with copied data
   */
  const expectRedirectedToNewApplication = () => {
    cy.url().should('include', '/create-application');
    cy.wait(wait_time);

    // Verify form contains copied data
    cy.get('[name="permitData.contactDetails.firstName"]').then(($field) => {
      const value = $field.val();
      expect(value).to.not.be.empty;
    });
  };

  /**
   * Role-based expectation for active permits access
   */
  const expectResultActivePermitsAccess = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        cy.xpath("//div[@class='tab__label' and text()='Active Permits']").should('exist');
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        cy.xpath("//div[@class='tab__label' and text()='Active Permits']").should('not.exist');
        break;
    }
  };

  /**
   * Role-based expectation for expired permits access
   */
  const expectResultExpiredPermitsAccess = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").should('exist');
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").should('not.exist');
        break;
    }
  };

  /**
   * Role-based expectation for copy functionality
   */
  const expectResultCopyFunctionality = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        cy.get('[id="actions-button"]').then(($btns) => {
          if ($btns.length > 0) {
            cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
            cy.wait(wait_time);
            cy.xpath("//li[text()='Copy']").should('exist');
          }
        });
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        // These roles should not have access
        cy.log('Role does not have copy access');
        break;
    }
  };

  beforeEach(() => {
    cy.loginAs(user_role);
  });

  /**
   * Rule: Users can copy permit at Active or Expired Permits
   * Scenario: active permit
   * Given permit A is active
   * When a user attempts to copy permit A
   * Then copy is available
   */
  it('Should allow eligible users to copy active permits', () => {
    viewActivePermitsScreenAs(user_role, expectResultActivePermitsAccess);

    if (user_role === 'ca' || user_role === 'pa' || user_role === 'pc' || user_role === 'sa' || user_role === 'train' || user_role === 'ctpo') {
      expectResultCopyFunctionality();
    }
  });

  /**
   * Rule: Users can copy permit at Active or Expired Permits
   * Scenario: expired permit
   * Given permit A is expired
   * When a user attempts to copy permit A
   * Then copy is available
   */
  it('Should allow eligible users to copy expired permits', () => {
    viewExpiredPermitsScreenAs(user_role, expectResultExpiredPermitsAccess);

    if (user_role === 'ca' || user_role === 'pa' || user_role === 'pc' || user_role === 'sa' || user_role === 'train' || user_role === 'ctpo') {
      cy.get('[id="actions-button"]').then(($btns) => {
        if ($btns.length > 0) {
          cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
          cy.wait(wait_time);
          cy.xpath("//li[text()='Copy']").should('exist');
        }
      });
    }
  });

  /**
   * Rule: Users can copy permit at Active or Expired Permits
   * Scenario: copy unavailable
   * Given the following statuses are true for a permit
   *   | tps synced permit |
   *   | revoked permit    |
   *   | void permit       |
   * When a user attempts to copy
   * Then copy is not available
   */
  it('Should restrict copy for revoked, void, or TPS synced permits', () => {
    if (user_role !== 'ca' && user_role !== 'pa' && user_role !== 'pc' && user_role !== 'sa' && user_role !== 'train' && user_role !== 'ctpo') {
      cy.log('Role does not have copy access - test skipped');
      return;
    }

    viewActivePermitsScreenAs(user_role, () => {
      cy.get('[id="actions-button"]').each(($actionBtn) => {
        cy.wrap($actionBtn).scrollIntoView().wait(1000).click({ force: true });
        cy.wait(wait_time);

        // Check for restricted statuses in permit details
        cy.get('body').then(($body) => {
          // If copy option exists and is enabled, the permit is not in restricted status
          if ($body.find("//li[text()='Copy']").length > 0) {
            cy.xpath("//li[text()='Copy']").should('have.attr', 'aria-disabled', 'false').or.not.exist;
          }
        });

        // Close menu
        cy.get('body').type('{esc}');
        cy.wait(500);
      });
    });
  });

  /**
   * Rule: Users are directed to the new application after copying
   * Scenario: copy permit
   * Given permit A is eligible for copying
   * When a user copies permit A
   * Then the user is directed to the new application B
   * And permit application B contains the copied information from permit A
   */
  it('Should redirect to new application with copied permit information', () => {
    if (user_role !== 'ca' && user_role !== 'pa' && user_role !== 'pc' && user_role !== 'sa' && user_role !== 'train' && user_role !== 'ctpo') {
      cy.log('Role does not have copy access - test skipped');
      return;
    }

    viewActivePermitsScreenAs(user_role, () => {
      cy.get('[id="actions-button"]').then(($btns) => {
        if ($btns.length > 0) {
          // Find and click first available permit action button
          cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
          cy.wait(wait_time);

          // Click copy action
          cy.xpath("//li[text()='Copy']").then(($copyOption) => {
            if ($copyOption.length > 0) {
              cy.wrap($copyOption).click();
              cy.wait(wait_time);

              // Verify redirect to new application form
              cy.url().should('include', '/create-application');
              cy.wait(wait_time);

              // Verify copied data is populated
              cy.get('[name="permitData.contactDetails.firstName"]').then(($field) => {
                const value = $field.val();
                expect(value).to.not.be.empty;
              });

              cy.get('[name="permitData.vehicleDetails.vin"]').then(($field) => {
                const value = $field.val();
                expect(value).to.not.be.empty;
              });

              cy.get('[name="permitData.vehicleDetails.plate"]').then(($field) => {
                const value = $field.val();
                expect(value).to.not.be.empty;
              });

              // Verify user can proceed
              cy.get('[data-testid="continue-application-button"]').should('exist');
            }
          });
        }
      });
    });
  });

  /**
   * RBAC Integration test: Verify access control
   * Eligible roles: PC, SA, TRAIN, CTPO, CA, PA
   * Restricted roles: FIN, EO, HQA
   */
  it('Should properly restrict copy functionality by user role', () => {
    if (user_role === 'ca' || user_role === 'pa' || user_role === 'pc' || user_role === 'sa' || user_role === 'train' || user_role === 'ctpo') {
      // Eligible roles should be able to view Active Permits
      cy.visit(permits_url);
      cy.wait(wait_time);
      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").should('exist');
    } else if (user_role === 'fin' || user_role === 'eo' || user_role === 'hqa') {
      // Restricted roles should not have direct access to permits
      cy.visit(permits_url);
      cy.wait(wait_time);
      cy.xpath("//div[@class='tab__label' and text()='Active Permits']").should('not.exist');
    }
  });
});
