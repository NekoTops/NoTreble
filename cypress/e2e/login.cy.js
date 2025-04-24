describe('Login Test', () => {
  it('logs in successfully with test credentials', () => {
    cy.visit('http://localhost:3000/Login');

    cy.get('input[type="email"]').type(Cypress.env('TEST_EMAIL'));
    cy.get('input[type="password"]').type(Cypress.env('TEST_PASSWORD'), { log: false });
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:3000/');
  });
});

