describe('Reports', () => {
  const wait_time = Cypress.env('wait_time');
  const user_role = Cypress.env('user_role').toLowerCase();

  function viewPaymentAndRefundSummaryReportAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      // TBD
      
    }

    assertionFn();

  }

  const expectResultViewPaymentAndRefundSummaryReport = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'fin':
      case 'ctpo':
      case 'hqa':
        expectSuccessViewPaymentAndRefundSummaryReport();
        break;
      default:
        expectFailureViewPaymentAndRefundSummaryReport();
        break;
    }
  }

  const expectSuccessViewPaymentAndRefundSummaryReport = () => {
    cy.get('button.nav-button--report').should('exist');
    cy.get('button.nav-button--report').click();
    cy.wait(wait_time);
    cy.contains('strong', 'Payment and Refund Summary').should('exist');
    cy.get('button[aria-label="View Report"]').click();
    cy.wait(wait_time);


  }
  
  const expectFailureViewPaymentAndRefundSummaryReport = () => {
    cy.get('button.nav-button--report').should('not.exist');
  }


  function viewPaymentAndRefundDetailReportAs(user_role, assertionFn) {
    if(user_role !== 'ca' && user_role !== 'pa'){
      // TBD
      
    }

    assertionFn();

  }

  const expectResultViewPaymentAndRefundDetailReport = () => {
    switch (user_role) {
      case 'pc':
      case 'sa':
      case 'train':
      case 'fin':
      case 'ctpo':
      case 'hqa':
        expectSuccessViewPaymentAndRefundDetailReport();
        break;
      default:
        expectFailureViewPaymentAndRefundDetailReport();
        break;
    }
  }

  const expectSuccessViewPaymentAndRefundDetailReport = () => {
    cy.get('button.nav-button--report').should('exist');
    cy.get('button.nav-button--report').click();
    cy.wait(wait_time);
    cy.contains('strong', 'Payment and Refund Detail').should('exist');
    cy.get('input[type="radio"].PrivateSwitchBase-input').eq(1).click({ force: true });
    cy.wait(wait_time);
    cy.get('button[aria-label="View Report"]').click();
    cy.wait(wait_time);
  }
  
  const expectFailureViewPaymentAndRefundDetailReport = () => {
    cy.get('button.nav-button--report').should('not.exist');
  }

  
  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('Should View Payment and Refund Summary Report', () => {
    viewPaymentAndRefundSummaryReportAs(user_role, expectResultViewPaymentAndRefundSummaryReport);
  });

  it('Should View Payment and Refund Detail Report', () => {
    viewPaymentAndRefundDetailReportAs(user_role, expectResultViewPaymentAndRefundDetailReport);
  });


});



