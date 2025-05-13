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
    cy.get('svg.fa-truck-moving').should('exist');
  }
  
  const expectFailureViewPaymentAndRefundSummaryReport = () => {
    cy.get('svg.fa-truck-moving').should('not.exist');
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
    cy.get('svg.fa-truck-moving').should('exist');
  }
  
  const expectFailureViewPaymentAndRefundDetailReport = () => {
    cy.get('svg.fa-truck-moving').should('not.exist');
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



