export function checkRoleAndSearch(user_role, company_name) {
    if (!(user_role === 'ca' || user_role === 'pa')) {
      cy.search(company_name);
    }
  }