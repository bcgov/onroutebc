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

const tagVehicle = (rowIndex = 0) => {
    getVehicleRow(rowIndex).find('[data-cy="vehicle-checkbox"]').check({ force: true });
    cy.wait(wait_time);
}

const untagVehicle = (rowIndex = 0) => {
    getVehicleRow(rowIndex).find('[data-cy="vehicle-checkbox"]').uncheck({ force: true });
    cy.wait(wait_time);
}

const toggleAllVehicles = () => {
    cy.get('[data-cy="toggle-all-checkbox"]').click();
    cy.wait(wait_time);
}

const deleteVehicle = (rowIndex = null) => {
    if (rowIndex !== null) {
        getVehicleRow(rowIndex).find('[data-cy="row-delete-button"]').click();
    } else {
        cy.get('[data-cy="table-delete-button"]').click();
    }
    cy.wait(wait_time);
}

const cancelDelete = () => {
    cy.get('[data-cy="cancel-delete"]').click();
    cy.wait(wait_time);
}

const confirmDelete = () => {
    cy.get('[data-cy="confirm-delete"]').click();
    cy.wait(wait_time);
}

const verifyVehicleCount = (expectedCount) => {
    cy.get('.vehicle-table tbody tr').should('have.length', expectedCount);
}

const verifySuccessMessage = (message) => {
    cy.get('.success-message').should('contain', message);
}

const verifyWarningMessage = (message) => {
    cy.get('.warning-dialog').should('contain', message);
}

const verifyRowHighlighted = (rowIndex, isHighlighted = true) => {
    const row = getVehicleRow(rowIndex);
    if (isHighlighted) {
        row.should('have.class', 'highlighted');
    } else {
        row.should('not.have.class', 'highlighted');
    }
}

const verifyRowHovered = (rowIndex, isHovered = true) => {
    const row = getVehicleRow(rowIndex);
    if (isHovered) {
        row.should('have.class', 'hovered');
    } else {
        row.should('not.have.class', 'hovered');
    }
}

describe('Scenario 1: Choose a vehicle to perform an action on', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToVehicleInventory();
    });

    // Test 1: Power unit – mouse over
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

    // Test 2: Power unit – tag single row
    it('should tag and highlight single power unit row', () => {
        selectVehicleTab('Power Units');
        
        tagVehicle(0);
        verifyRowHighlighted(0, true);
        verifyRowHighlighted(1, false);
    });

    // Test 3: Power unit – tag multiple row
    it('should tag and highlight multiple power unit rows', () => {
        selectVehicleTab('Power Units');
        
        tagVehicle(0);
        tagVehicle(1);
        tagVehicle(2);
        
        verifyRowHighlighted(0, true);
        verifyRowHighlighted(1, true);
        verifyRowHighlighted(2, true);
        verifyRowHighlighted(3, false);
    });

    // Test 4: Power unit – untag row
    it('should untag single row while keeping others tagged', () => {
        selectVehicleTab('Power Units');
        
        // Tag multiple rows first
        tagVehicle(0);
        tagVehicle(1);
        tagVehicle(2);
        
        // Untag middle row
        untagVehicle(1);
        
        verifyRowHighlighted(0, true);
        verifyRowHighlighted(1, false);
        verifyRowHighlighted(2, true);
    });

    // Test 5: Trailer – mouse over
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

    // Test 6: Trailer – tag single row
    it('should tag and highlight single trailer row', () => {
        selectVehicleTab('Trailers');
        
        tagVehicle(0);
        verifyRowHighlighted(0, true);
        verifyRowHighlighted(1, false);
    });

    // Test 7: Trailer – tag multiple row
    it('should tag and highlight multiple trailer rows', () => {
        selectVehicleTab('Trailers');
        
        tagVehicle(0);
        tagVehicle(1);
        tagVehicle(2);
        
        verifyRowHighlighted(0, true);
        verifyRowHighlighted(1, true);
        verifyRowHighlighted(2, true);
        verifyRowHighlighted(3, false);
    });

    // Test 8: Trailer – untag row
    it('should untag single trailer row while keeping others tagged', () => {
        selectVehicleTab('Trailers');
        
        // Tag multiple rows first
        tagVehicle(0);
        tagVehicle(1);
        tagVehicle(2);
        
        // Untag middle row
        untagVehicle(1);
        
        verifyRowHighlighted(0, true);
        verifyRowHighlighted(1, false);
        verifyRowHighlighted(2, true);
    });

    // Additional test: Toggle all functionality
    it('should toggle all vehicles selection', () => {
        selectVehicleTab('Power Units');
        
        // Get initial count
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            // Toggle all to select
            toggleAllVehicles();
            cy.get('.vehicle-table tbody tr input:checked').should('have.length', initialCount);
            
            // Toggle all to deselect
            toggleAllVehicles();
            cy.get('.vehicle-table tbody tr input:checked').should('have.length', 0);
            
            // Toggle all again to select
            toggleAllVehicles();
            cy.get('.vehicle-table tbody tr input:checked').should('have.length', initialCount);
        });
    });

});

describe('Scenario 2: Delete vehicle warning', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToVehicleInventory();
    });

    // Test 1: Power unit single row delete
    it('should show warning for single power unit row delete', () => {
        selectVehicleTab('Power Units');
        
        deleteVehicle(0);
        
        verifyWarningMessage('Are you sure you want to delete this? This action cannot be undone.');
        cy.get('[data-cy="confirm-delete"]').should('exist');
        cy.get('[data-cy="cancel-delete"]').should('exist');
    });

    // Test 2: Power unit multiple row delete
    it('should show warning for multiple power unit row delete', () => {
        selectVehicleTab('Power Units');
        
        tagVehicle(0);
        tagVehicle(1);
        deleteVehicle(); // Table delete button
        
        verifyWarningMessage('Are you sure you want to delete this? This action cannot be undone.');
        cy.get('[data-cy="confirm-delete"]').should('exist');
        cy.get('[data-cy="cancel-delete"]').should('exist');
    });

    // Test 3: Trailer single row delete
    it('should show warning for single trailer row delete', () => {
        selectVehicleTab('Trailers');
        
        deleteVehicle(0);
        
        verifyWarningMessage('Are you sure you want to delete this? This action cannot be undone.');
        cy.get('[data-cy="confirm-delete"]').should('exist');
        cy.get('[data-cy="cancel-delete"]').should('exist');
    });

    // Test 4: Trailer multiple row delete
    it('should show warning for multiple trailer row delete', () => {
        selectVehicleTab('Trailers');
        
        tagVehicle(0);
        tagVehicle(1);
        deleteVehicle(); // Table delete button
        
        verifyWarningMessage('Are you sure you want to delete this? This action cannot be undone.');
        cy.get('[data-cy="confirm-delete"]').should('exist');
        cy.get('[data-cy="cancel-delete"]').should('exist');
    });

});

describe('Scenario 3: Delete a vehicle continue with delete', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToVehicleInventory();
    });

    // Test 1: Power unit delete row
    it('should delete power unit row and show success message', () => {
        selectVehicleTab('Power Units');
        
        // Get initial count
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            deleteVehicle(0);
            confirmDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify success message
            verifySuccessMessage('Vehicle Deleted');
            
            // Verify vehicle count decreased
            verifyVehicleCount(initialCount - 1);
        });
    });

    // Test 2: Power unit delete row, cancel at warning
    it('should cancel power unit delete and keep vehicle', () => {
        selectVehicleTab('Power Units');
        
        // Get initial count
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            deleteVehicle(0);
            cancelDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify vehicle count unchanged
            verifyVehicleCount(initialCount);
        });
    });

    // Test 3: Trailer delete row
    it('should delete trailer row and show success message', () => {
        selectVehicleTab('Trailers');
        
        // Get initial count
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            deleteVehicle(0);
            confirmDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify success message
            verifySuccessMessage('Vehicle Deleted');
            
            // Verify vehicle count decreased
            verifyVehicleCount(initialCount - 1);
        });
    });

    // Test 4: Trailer delete row, cancel at warning
    it('should cancel trailer delete and keep vehicle', () => {
        selectVehicleTab('Trailers');
        
        // Get initial count
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            deleteVehicle(0);
            cancelDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify vehicle count unchanged
            verifyVehicleCount(initialCount);
        });
    });

});

describe('Scenario 4: Bulk delete multiple vehicles', () => {
    beforeEach(() => {
        user_role = user_ca['user_role'];
        loginLogoutAs(user_role, expectSuccessLoginLogout);
        navigateToVehicleInventory();
    });

    // Test 1: Power unit tag 1 row, delete
    it('should delete single tagged power unit row', () => {
        selectVehicleTab('Power Units');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            tagVehicle(0);
            deleteVehicle(); // Table delete button
            confirmDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify success message
            verifySuccessMessage('Vehicle Deleted');
            
            // Verify vehicle count decreased
            verifyVehicleCount(initialCount - 1);
        });
    });

    // Test 2: Power unit tag 1 row, delete, cancel at warning
    it('should cancel delete of single tagged power unit row', () => {
        selectVehicleTab('Power Units');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            tagVehicle(0);
            deleteVehicle(); // Table delete button
            cancelDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify vehicle count unchanged
            verifyVehicleCount(initialCount);
        });
    });

    // Test 3: Power unit tag multiple row, delete
    it('should delete multiple tagged power unit rows', () => {
        selectVehicleTab('Power Units');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            tagVehicle(0);
            tagVehicle(1);
            tagVehicle(2);
            deleteVehicle(); // Table delete button
            confirmDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify success message
            verifySuccessMessage('Vehicle Deleted');
            
            // Verify vehicle count decreased by 3
            verifyVehicleCount(initialCount - 3);
        });
    });

    // Test 4: Power unit tag multiple row, delete, cancel at warning
    it('should cancel delete of multiple tagged power unit rows', () => {
        selectVehicleTab('Power Units');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            tagVehicle(0);
            tagVehicle(1);
            deleteVehicle(); // Table delete button
            cancelDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify vehicle count unchanged
            verifyVehicleCount(initialCount);
        });
    });

    // Test 5: Power unit tag zero rows, delete
    it('should handle delete when no power unit rows are tagged', () => {
        selectVehicleTab('Power Units');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            // Don't tag any rows, just click table delete button
            deleteVehicle(); // Table delete button
            
            // Warning should still be displayed
            verifyWarningMessage('Are you sure you want to delete this? This action cannot be undone.');
            
            // Cancel the warning
            cancelDelete();
            
            // Verify vehicle count unchanged
            verifyVehicleCount(initialCount);
            
            // Try again but confirm delete
            deleteVehicle(); // Table delete button
            confirmDelete();
            
            // Success message should still be displayed but no vehicles deleted
            verifySuccessMessage('Vehicle Deleted');
            verifyVehicleCount(initialCount);
        });
    });

    // Test 6: Trailer tag 1 row, delete
    it('should delete single tagged trailer row', () => {
        selectVehicleTab('Trailers');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            tagVehicle(0);
            deleteVehicle(); // Table delete button
            confirmDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify success message
            verifySuccessMessage('Vehicle Deleted');
            
            // Verify vehicle count decreased
            verifyVehicleCount(initialCount - 1);
        });
    });

    // Test 7: Trailer tag 1 row, delete, cancel at warning
    it('should cancel delete of single tagged trailer row', () => {
        selectVehicleTab('Trailers');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            tagVehicle(0);
            deleteVehicle(); // Table delete button
            cancelDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify vehicle count unchanged
            verifyVehicleCount(initialCount);
        });
    });

    // Test 8: Trailer tag multiple row, delete
    it('should delete multiple tagged trailer rows', () => {
        selectVehicleTab('Trailers');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            tagVehicle(0);
            tagVehicle(1);
            tagVehicle(2);
            deleteVehicle(); // Table delete button
            confirmDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify success message
            verifySuccessMessage('Vehicle Deleted');
            
            // Verify vehicle count decreased by 3
            verifyVehicleCount(initialCount - 3);
        });
    });

    // Test 9: Trailer tag multiple row, delete, cancel at warning
    it('should cancel delete of multiple tagged trailer rows', () => {
        selectVehicleTab('Trailers');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            tagVehicle(0);
            tagVehicle(1);
            deleteVehicle(); // Table delete button
            cancelDelete();
            
            // Verify redirected back to vehicle inventory
            cy.url().should('include', '/vehicle-inventory');
            
            // Verify vehicle count unchanged
            verifyVehicleCount(initialCount);
        });
    });

    // Test 10: Trailer tag zero rows, delete
    it('should handle delete when no trailer rows are tagged', () => {
        selectVehicleTab('Trailers');
        
        cy.get('.vehicle-table tbody tr').then($rows => {
            const initialCount = $rows.length;
            
            // Don't tag any rows, just click table delete button
            deleteVehicle(); // Table delete button
            
            // Warning should still be displayed
            verifyWarningMessage('Are you sure you want to delete this? This action cannot be undone.');
            
            // Cancel the warning
            cancelDelete();
            
            // Verify vehicle count unchanged
            verifyVehicleCount(initialCount);
            
            // Try again but confirm delete
            deleteVehicle(); // Table delete button
            confirmDelete();
            
            // Success message should still be displayed but no vehicles deleted
            verifySuccessMessage('Vehicle Deleted');
            verifyVehicleCount(initialCount);
        });
    });

});