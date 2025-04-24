describe('Logout Test', () => {
    it('logs in and logs out successfully', () => {
      cy.visit('http://localhost:3000/Login');
      cy.get('input[type="email"]').type(Cypress.env('TEST_EMAIL'));
      cy.get('input[type="password"]').type(Cypress.env('TEST_PASSWORD'), { log: false });
      cy.get('button[type="submit"]').click();
      cy.url().should('eq', 'http://localhost:3000/');
      
      cy.visit('http://localhost:3000/Profile');
      cy.contains('button', 'Logout').click();
      cy.url().should('eq', 'http://localhost:3000/Login');
    });
  });
  