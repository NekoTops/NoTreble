describe("Signup, Login, Logout Flow", () => {
  const random = Math.floor(Math.random() * 100000);
  const email = `test${random}@example.com`;
  const password = "password123";

  it("should sign up a new user", () => {
    cy.visit("http://localhost:3000/Signup"); // Adjust port if needed

    cy.get('input[type="name"]').type(`Test User ${random}`);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').eq(0).type(password);
    cy.get('input[type="password"]').eq(1).type(password);
    cy.get('button[type="submit"]').contains("Sign Up").click();

    cy.url().should("include", "/"); // Assumes redirect to home after signup
  });

  it("should log in the user", () => {
    cy.visit("http://localhost:3000/Login");

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').contains("Login").click();

    cy.url().should("include", "/"); // Assumes redirect to home after login
  });

  it("should log out the user", () => {
    cy.visit("http://localhost:3000/Profile");

    cy.contains("Logout").click();

    cy.url().should("include", "/Login"); // Assumes redirect to Login after logout
  });
});
