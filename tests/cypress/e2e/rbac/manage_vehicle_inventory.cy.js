import { checkRoleAndSearch } from '../../support/common';

describe('Manage Vehicle Inventory', () => {

  const wait_time = Cypress.env('wait_time');
  const vehicle_inventory_url = '/manage-vehicles';
  const user_role = Cypress.env('user_role').toLowerCase();
  const roleCompanies = Cypress.env('rolesToCompanies');
  const company_name = roleCompanies[user_role];
  
  function viewVehicleInventoryScreenAs(user_role, assertionFn) {
    if(user_role === 'ca' || user_role === 'pa'){
      cy.visit(vehicle_inventory_url);
      cy.wait(wait_time);
    }
    else{
      cy.search(company_name);
    }
  
    assertionFn()
  }

  function crudPowerUnitAs(user_role, assertionFn) {
    checkRoleAndSearch(user_role, company_name);
    if(user_role !== 'fin' && user_role !== 'eo' && user_role !== 'hqa'){
      cy.get('a[href="/manage-vehicles"]').click({ force: true });
      cy.wait(wait_time);

      cy.get('button.add-vehicle__button').eq(1).click({force: true});
      cy.wait(wait_time);

      cy.contains('li', 'Power Unit').click();
      cy.wait(wait_time);

      cy.get('[name="make"]').type('Toyota');
      cy.wait(wait_time);

      cy.get('[name="year"]').type('2002');
      cy.wait(wait_time);

      cy.get('[name="vin"]').type('MCL37A');
      cy.wait(wait_time);

      cy.get('[name="plate"]').type('VB0007');
      cy.wait(wait_time);

      cy.get('[id="mui-component-select-powerUnitTypeCode"]').click({ force: true });
      cy.wait(wait_time);

      cy.get('[data-value="BUSCRUM"]').click();
      cy.wait(wait_time);

      cy.get('[id="mui-component-select-countryCode"]').scrollIntoView().click();
      cy.wait(wait_time);

      cy.get('[data-value="CA"]').click();
      cy.wait(wait_time);

      cy.get('[id="mui-component-select-provinceCode"]').click();
      cy.wait(wait_time);

      cy.get('[data-value="AB"]').click();
      cy.wait(wait_time);

      cy.get('[name="licensedGvw"]').type('2000');
      cy.wait(wait_time);

      cy.get('.css-xie432').click();
      cy.wait(wait_time);

      // update power unit
      checkRoleAndSearch(user_role, company_name);
      cy.get('a[href="/manage-vehicles"]').click({ force: true });
      cy.wait(wait_time);

      cy.get('button.onroutebc-table-row-actions__button').first().click({force: true});

      cy.xpath("//li[text()='Edit']").click();
      cy.wait(wait_time);

      cy.get('[name="make"]').clear().type('Toyota');
      cy.wait(wait_time);

      cy.get('[name="year"]').clear().type('2021');
      cy.wait(wait_time);

      cy.get('[name="licensedGvw"]').clear().type('3000');
      cy.wait(wait_time);

      cy.get('.css-xie432').click();
      cy.wait(wait_time);

      // delete power unit
      checkRoleAndSearch(user_role, company_name);
      cy.get('a[href="/manage-vehicles"]').click({ force: true });
      cy.wait(wait_time);

      cy.xpath("(//input[@type='checkbox'])[2]")
      .then(($checkbox) => {
        if (!$checkbox.prop('checked')) {
          cy.wrap($checkbox).click();
        }
      });
      cy.wait(wait_time);

      cy.get('.delete-btn--active').click();
      cy.wait(wait_time);

      cy.get('.css-1a53fri').click();
      cy.wait(wait_time);

    }
    
    assertionFn()
  }

  function crudTrailerAs(user_role, assertionFn) {
    checkRoleAndSearch(user_role, company_name);
    if(user_role !== 'fin' && user_role !== 'eo' && user_role !== 'hqa') {
      cy.get('a[href="/manage-vehicles"]').click({ force: true });
      cy.wait(wait_time);

      cy.get('button.add-vehicle__button').eq(1).click({force: true});
      cy.wait(wait_time);

      cy.contains('li', 'Trailer').click();
      cy.wait(wait_time);

      cy.get('[name="make"]').type('NISSAN');
      cy.wait(wait_time);

      cy.get('[name="year"]').type('2005');
      cy.wait(wait_time);

      cy.get('[name="vin"]').type('TCL37A');
      cy.wait(wait_time);

      cy.get('[name="plate"]').type('VT0007');
      cy.wait(wait_time);

      cy.get('[id="mui-component-select-trailerTypeCode"]').click({ force: true });
      cy.wait(wait_time);

      cy.get('[data-value="BOOSTER"]').click();
      cy.wait(wait_time);

      cy.get('[id="mui-component-select-countryCode"]').scrollIntoView().click();
      cy.wait(wait_time);

      cy.get('[data-value="CA"]').click();
      cy.wait(wait_time);

      cy.get('[id="mui-component-select-provinceCode"]').click();
      cy.wait(wait_time);

      cy.get('[data-value="BC"]').click();
      cy.wait(wait_time);

      cy.get('.css-xie432').click();
      cy.wait(wait_time);

      // update power unit
      checkRoleAndSearch(user_role, company_name);
      cy.get('a[href="/manage-vehicles"]').click({ force: true });
      cy.wait(wait_time);

      cy.get('.tab__label').contains('Trailer').click();
      cy.wait(wait_time);

      cy.get('.css-15mydm5').first().scrollIntoView().wait(3000).click({ force: true });
      cy.wait(wait_time);

      cy.xpath("//li[text()='Edit']").click({force: true});
      cy.wait(wait_time);

      cy.get('[name="make"]').clear().type('BMW');
      cy.wait(wait_time);

      cy.get('[name="year"]').clear().type('2021');
      cy.wait(wait_time);

      cy.get('.css-xie432').click();
      cy.wait(wait_time);


      // delete trailer
      checkRoleAndSearch(user_role, company_name);
      cy.get('a[href="/manage-vehicles"]').click({ force: true });
      cy.wait(wait_time);

      cy.get('.tab__label').contains('Trailer').click();
      cy.wait(wait_time);

      cy.xpath("(//input[@type='checkbox'])[2]")
      .then(($checkbox) => {
        if (!$checkbox.prop('checked')) {
          cy.wrap($checkbox).click();
        }
      });
      cy.wait(wait_time);

      cy.get('.delete-btn--active').click();
      cy.wait(wait_time);

      cy.get('.css-1a53fri').click();
      cy.wait(wait_time);

    }
    
    assertionFn()
  } 

  const expectResult = () => {
    switch (user_role) {
      case 'ca':
      case 'pa':
      case 'pc':
      case 'sa':
      case 'train':
      case 'ctpo':
        expectSuccess();
        break;
      case 'fin':
      case 'eo':
      case 'hqa':
        expectFailure();
        break;
    }
  }

  const expectSuccess = () => {
    cy.get('a[href="/manage-vehicles"]').should('exist');
  }
  
  const expectFailure = () => {
    cy.get('a[href="/manage-vehicles"]').should('not.exist');
  }
  
  beforeEach(() => {
    cy.loginAs(user_role);
  });

  it('View Vehicle Inventory screen', () => {
    viewVehicleInventoryScreenAs(user_role, expectResult);
  });

  it('Crud Power Unit', () => {
    crudPowerUnitAs(user_role, expectResult);
  });

  it('Crud Trailer', () => {
    crudTrailerAs(user_role, expectResult);
  });

});





