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

// Helper functions for vehicle inventory operations
const navigateToVehicleInventory = () => {
    cy.contains('a', 'Vehicle Inventory').click();
    cy.wait(wait_time);
}

const selectVehicleTab = (tabName) => {
    cy.contains('.tab', tabName).click();
    cy.wait(wait_time);
}

const getVehicleRow = (rowIndex = 0) => {
    return cy.get('.vehicle-table tbody tr').eq(rowIndex);
}

const editVehicle = (rowIndex = 0) => {
    getVehicleRow(rowIndex).find('[data-cy="edit-vehicle-button"]').click();
    cy.wait(wait_time);
}

const saveVehicleChanges = () => {
    cy.get('[data-cy="save-vehicle-button"]').click();
    cy.wait(wait_time);
}

const cancelVehicleEdit = () => {
    cy.get('[data-cy="cancel-edit-button"]').click();
    cy.wait(wait_time);
}

const updateVehicleField = (fieldName, value) => {
    cy.get(`[data-cy="vehicle-${fieldName.toLowerCase().replace(/\s+/g, '-')}"]`).clear().type(value);
    cy.wait(wait_time);
}

const clearVehicleField = (fieldName) => {
    cy.get(`[data-cy="vehicle-${fieldName.toLowerCase().replace(/\s+/g, '-')}"]`).clear();
    cy.wait(wait_time);
}

const verifyFieldValue = (fieldName, expectedValue) => {
    cy.get(`[data-cy="vehicle-${fieldName.toLowerCase().replace(/\s+/g, '-')}"]`).should('have.value', expectedValue);
}

const verifyFieldRequired = (fieldName) => {
    cy.get(`[data-cy="vehicle-${fieldName.toLowerCase().replace(/\s+/g, '-')}"]`).should('have.attr', 'required');
}

const verifyErrorDisplayed = (expectedError) => {
    cy.get('.error-message').should('contain', expectedError);
}

const verifySuccessMessage = (expectedMessage) => {
    cy.get('.success-message').should('contain', expectedMessage);
}

const verifyRowHovered = (rowIndex, isHovered = true) => {
    const row = getVehicleRow(rowIndex);
    if (isHovered) {
        row.should('have.class', 'hovered');
    } else {
        row.should('not.have.class', 'hovered');
    }
}

describe('Scenario 1: Indicate chosen vehicle', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToVehicleInventory();
    });

    // Test 1: Power unit – mouse over line
    it('should shade power unit row on mouse over', () => {
        selectVehicleTab('Power Units');
        
        const firstRow = getVehicleRow(0);
        const secondRow = getVehicleRow(1);
        
        // Mouse over first row
        firstRow.trigger('mouseover');
        verifyRowHovered(0, true);
        verifyRowHovered(1, false);
        
        // Mouse over second row
        secondRow.trigger('mouseover');
        verifyRowHovered(0, false);
        verifyRowHovered(1, true);
    });

    // Test 2: Trailer – mouse over line
    it('should shade trailer row on mouse over', () => {
        selectVehicleTab('Trailers');
        
        const firstRow = getVehicleRow(0);
        const secondRow = getVehicleRow(1);
        
        // Mouse over first row
        firstRow.trigger('mouseover');
        verifyRowHovered(0, true);
        verifyRowHovered(1, false);
        
        // Mouse over second row
        secondRow.trigger('mouseover');
        verifyRowHovered(0, false);
        verifyRowHovered(1, true);
    });

});

describe('Scenario 2: Edit vehicle details', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToVehicleInventory();
    });

    // Test 1: Power unit – happy path – change fields
    it('should save all changed power unit fields successfully', () => {
        selectVehicleTab('Power Units');
        
        editVehicle(0);
        
        // Change all values
        updateVehicleField('Unit Number', 'TEST123');
        updateVehicleField('Make', 'TestMake');
        updateVehicleField('Model', 'TestModel');
        updateVehicleField('Year', '2023');
        updateVehicleField('Steer Axle Tire Size', '275');
        updateVehicleField('Vehicle Weight', '10000');
        updateVehicleField('License Plate', 'TESTPLATE');
        
        saveVehicleChanges();
        
        // Verify returned to vehicle inventory
        cy.url().should('include', '/vehicle-inventory');
        
        // Verify changes by editing again
        editVehicle(0);
        verifyFieldValue('Unit Number', 'TEST123');
        verifyFieldValue('Make', 'TestMake');
        verifyFieldValue('Model', 'TestModel');
        verifyFieldValue('Year', '2023');
        verifyFieldValue('Steer Axle Tire Size', '275');
        verifyFieldValue('Vehicle Weight', '10000');
        verifyFieldValue('License Plate', 'TESTPLATE');
        
        cancelVehicleEdit(); // Don't save changes from verification
    });

    // Test 2: Power unit – happy path – delete optional field
    it('should save optional fields as empty without errors', () => {
        selectVehicleTab('Power Units');
        
        editVehicle(0);
        
        // Delete optional fields
        clearVehicleField('Unit Number');
        clearVehicleField('Steer Axle Tire Size');
        
        saveVehicleChanges();
        
        // Verify returned to vehicle inventory
        cy.url().should('include', '/vehicle-inventory');
        
        // Verify fields are empty by editing again
        editVehicle(0);
        verifyFieldValue('Unit Number', '');
        verifyFieldValue('Steer Axle Tire Size', '');
        
        cancelVehicleEdit(); // Don't save changes from verification
    });

    // Test 3: Power unit – delete mandatory fields
    it('should show error when mandatory fields are deleted', () => {
        selectVehicleTab('Power Units');
        
        editVehicle(0);
        
        // Attempt to delete mandatory field
        clearVehicleField('Make');
        
        saveVehicleChanges();
        
        // Verify error message
        verifyErrorDisplayed('Make is a required field');
        
        // Verify still on edit page
        cy.url().should('include', '/edit-vehicle');
        
        cancelVehicleEdit();
    });

    // Test 4: Trailer – happy path – change fields
    it('should save all changed trailer fields successfully', () => {
        selectVehicleTab('Trailers');
        
        editVehicle(0);
        
        // Change all values
        updateVehicleField('Unit Number', 'TRAILER123');
        updateVehicleField('Make', 'TrailerMake');
        updateVehicleField('Model', 'TrailerModel');
        updateVehicleField('Year', '2023');
        updateVehicleField('Trailer Type', 'Flatbed');
        updateVehicleField('Vehicle Weight', '15000');
        updateVehicleField('License Plate', 'TRAILERPL');
        
        saveVehicleChanges();
        
        // Verify returned to vehicle inventory
        cy.url().should('include', '/vehicle-inventory');
        
        // Verify changes by editing again
        editVehicle(0);
        verifyFieldValue('Unit Number', 'TRAILER123');
        verifyFieldValue('Make', 'TrailerMake');
        verifyFieldValue('Model', 'TrailerModel');
        verifyFieldValue('Year', '2023');
        verifyFieldValue('Trailer Type', 'Flatbed');
        verifyFieldValue('Vehicle Weight', '15000');
        verifyFieldValue('License Plate', 'TRAILERPL');
        
        cancelVehicleEdit(); // Don't save changes from verification
    });

    // Test 5: Trailer – happy path – delete optional field
    it('should save optional trailer fields as empty without errors', () => {
        selectVehicleTab('Trailers');
        
        editVehicle(0);
        
        // Delete optional fields
        clearVehicleField('Unit Number');
        clearVehicleField('License Plate');
        
        saveVehicleChanges();
        
        // Verify returned to vehicle inventory
        cy.url().should('include', '/vehicle-inventory');
        
        // Verify fields are empty by editing again
        editVehicle(0);
        verifyFieldValue('Unit Number', '');
        verifyFieldValue('License Plate', '');
        
        cancelVehicleEdit(); // Don't save changes from verification
    });

    // Test 6: Trailer – delete mandatory fields
    it('should show error when mandatory trailer fields are deleted', () => {
        selectVehicleTab('Trailers');
        
        editVehicle(0);
        
        // Attempt to delete mandatory field
        clearVehicleField('Make');
        
        saveVehicleChanges();
        
        // Verify error message
        verifyErrorDisplayed('Make is a required field');
        
        // Verify still on edit page
        cy.url().should('include', '/edit-vehicle');
        
        cancelVehicleEdit();
    });

});

describe('Scenario 3: Cancel vehicle edit', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToVehicleInventory();
    });

    // Test 1: Power unit – cancel edit
    it('should cancel power unit edit and restore original values', () => {
        selectVehicleTab('Power Units');
        
        // Get original values
        let originalMake, originalModel;
        editVehicle(0);
        cy.get('[data-cy="vehicle-make"]').invoke('val').then(val => originalMake = val);
        cy.get('[data-cy="vehicle-model"]').invoke('val').then(val => originalModel = val);
        cancelVehicleEdit();
        
        // Edit again and change values
        editVehicle(0);
        updateVehicleField('Make', 'ChangedMake');
        updateVehicleField('Model', 'ChangedModel');
        cancelVehicleEdit();
        
        // Verify original values are restored
        editVehicle(0);
        verifyFieldValue('Make', originalMake);
        verifyFieldValue('Model', originalModel);
        
        cancelVehicleEdit();
    });

    // Test 2: Trailer – cancel edit
    it('should cancel trailer edit and restore original values', () => {
        selectVehicleTab('Trailers');
        
        // Get original values
        let originalMake, originalModel;
        editVehicle(0);
        cy.get('[data-cy="vehicle-make"]').invoke('val').then(val => originalMake = val);
        cy.get('[data-cy="vehicle-model"]').invoke('val').then(val => originalModel = val);
        cancelVehicleEdit();
        
        // Edit again and change values
        editVehicle(0);
        updateVehicleField('Make', 'ChangedMake');
        updateVehicleField('Model', 'ChangedModel');
        cancelVehicleEdit();
        
        // Verify original values are restored
        editVehicle(0);
        verifyFieldValue('Make', originalMake);
        verifyFieldValue('Model', originalModel);
        
        cancelVehicleEdit();
    });

});

describe('Scenario 4: Field validation', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToVehicleInventory();
    });

    // Test 1: Power unit – validate year field
    it('should validate power unit year field format', () => {
        selectVehicleTab('Power Units');
        
        editVehicle(0);
        
        // Test invalid year
        updateVehicleField('Year', 'abc');
        saveVehicleChanges();
        verifyErrorDisplayed('Year must be a valid number');
        
        // Test year out of range
        updateVehicleField('Year', '1800');
        saveVehicleChanges();
        verifyErrorDisplayed('Year must be between 1900 and current year');
        
        cancelVehicleEdit();
    });

    // Test 2: Power unit – validate weight field
    it('should validate power unit weight field format', () => {
        selectVehicleTab('Power Units');
        
        editVehicle(0);
        
        // Test invalid weight
        updateVehicleField('Vehicle Weight', 'abc');
        saveVehicleChanges();
        verifyErrorDisplayed('Vehicle Weight must be a valid number');
        
        // Test negative weight
        updateVehicleField('Vehicle Weight', '-1000');
        saveVehicleChanges();
        verifyErrorDisplayed('Vehicle Weight must be positive');
        
        cancelVehicleEdit();
    });

    // Test 3: Trailer – validate year field
    it('should validate trailer year field format', () => {
        selectVehicleTab('Trailers');
        
        editVehicle(0);
        
        // Test invalid year
        updateVehicleField('Year', 'abc');
        saveVehicleChanges();
        verifyErrorDisplayed('Year must be a valid number');
        
        cancelVehicleEdit();
    });

});