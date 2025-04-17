describe('Manage Permits', () => {
  const wait_time = Cypress.env('wait_time');
  const permits_url = '/applications';
  const new_tros_url = '/create-application/TROS';
  const new_trow_url = '/create-application/TROW';
   
    
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Permits screen', () => {
    cy.visit(permits_url);
    cy.wait(wait_time);
  });

  it('Should View Active Permits', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);
  });

  it('Should View individual Active Permit PDF', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);

    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link')
    .first()
    .should('be.visible')
    .click();
    cy.wait(wait_time);

  });

  it('Should View permit receipt', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Active Permits']").click();
    cy.wait(wait_time);

    cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='View Receipt']").click();
    cy.wait(wait_time);
  });

  it('Should View list of Expired Permits', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);
  });

  it('Should View individual Expired Permit PDF', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);

    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link')
    .first()
    .should('be.visible')
    .click();
    cy.wait(wait_time);

  });

  it('Should View Expired permit receipt', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.xpath("//div[@class='tab__label' and text()='Expired Permits']").click();
    cy.wait(wait_time);

    cy.get('[id="actions-button"]').first().scrollIntoView().wait(3000).click({ force: true });
    cy.wait(wait_time);

    cy.xpath("//li[text()='View Receipt']").click();
    cy.wait(wait_time);
  });

});

describe('Manage Profile', () => {
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('bceid_username');
  const password = Cypress.env('bceid_password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Company Information', () => {
    cy.get('.search-button').click();
    cy.wait(wait_time);

    cy.get('[value="companies"]').click();
    cy.wait(wait_time);

    cy.get('.css-1pog434').type(company_sa);
    cy.wait(wait_time);
    cy.get('.search-by__search').click();
    cy.wait(wait_time);
    cy.get('button.MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.MuiLink-button.custom-action-link.css-mn35dv')
      .first()
      .click();
    cy.wait(wait_time);

    cy.get('a[href="/manage-profiles"]').click({ force: true });
    cy.wait(wait_time);

    cy.get('h4[data-testid="company-banner-name"]')
    .should('not.be.empty')  // Verifies the content is not empty
    .invoke('text')           // Gets the text content
    .should('not.be.empty');  // Asserts that the text is not empty

    cy.contains('Company Mailing Address')
      .next()
      .should('exist')
      .and('not.be.empty')
      .invoke('text') 
      .should('not.match', /^\s*$/); 

    cy.contains('Company Contact Details')
      .next()
      .should('exist')
      .and('not.be.empty')
      .invoke('text') 
      .should('not.match', /^\s*$/); 

    cy.contains('Company Primary Contact')
      .next()
      .should('exist')
      .and('not.be.empty')
      .invoke('text') 
      .should('not.match', /^\s*$/); 
  });

});


describe('Manage Settings', () => {
  const wait_time = Cypress.env('wait_time');
  const manage_profiles_url = '/manage-profiles';
  const settings_url = '/settings';

   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View/download LOA letter PDF', () => {
    
  });

  it('Should Access Expired LOAs link', () => {
    
  });

  it('Should View Credit Account tab - Account Holder', () => {
    
  });

  it('Should View Credit Account Users - Account Holder', () => {
    
  });

  it('Should Manage Credit Account Users - Account Holder', () => {
    
  });

  it('Should View Credit Account Details - Account Holder', () => {
    
  });

  it('Should Perform Credit Account Detail actions - Account Holder', () => {
    
  });

  it('Should View Hold/Close History - Account Holder', () => {
    
  });

  it('Should View Credit Account tab - Account User', () => {
    
  });

  it('Should View Credit Account Users - Account User', () => {
    
  });

  it('Should View Credit Account Details - Account User', () => {
    
  });

  it('Should View Credit Account tab - Non-Holder/user', () => {
    
  });

  it('Should Add Credit Account - Non-Holder/user', () => {
    
  });

  it('Should View Suspend Company info', () => {
    
  });

  it('Should Update Suspend Company flag', () => {
    
  });



}); 

describe('Sticky Side Bar', () => {
  const wait_time = Cypress.env('wait_time');

  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  

  it('Should View Sticky Side Bar', () => {
    cy.visit('/');
    cy.wait(wait_time);

    cy.get('.nav-icon-side-bar .nav-button').eq(0).should('exist');// home button
    cy.get('.nav-icon-side-bar .nav-button').eq(1).should('exist');// reports button
    cy.get('.nav-icon-side-bar .nav-button').eq(2).should('exist');// Bridge Calculation Tool
    cy.wait(wait_time);

  });

});

describe('Reports', () => {
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('bceid_username');
  const password = Cypress.env('bceid_password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should Payment and Refund Summary Report', () => {
    // TBD
  });

  it('Should Payment and Refund Detail Report', () => {
    // TBD
  });

});

describe('Global Search', () => {
  const wait_time = Cypress.env('wait_time');
  const username = Cypress.env('bceid_username');
  const password = Cypress.env('bceid_password');
  const manage_profiles_url = '/manage-profiles';
  const update_trailer_url = Cypress.env('update_trailer_url');
  const manage_vehicle_url = '/manage-vehicles';
   
  beforeEach(() => {
    cy.userLoginIdir();
  });

  it('Should View Global Search screen', () => {
    // TBD
  });

  it('Should Search for Company', () => {
    // TBD
  });

  it('Should Search for Active Permit', () => {
    // TBD
  });

  it('Should Resend', () => {
    // TBD
  });

});





