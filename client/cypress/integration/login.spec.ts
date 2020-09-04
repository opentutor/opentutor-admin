describe("Login", () => {
  it("loads home page", () => {
    cy.visit("/");
    cy.contains("Welcome to OpenTutor");
    cy.contains("Teacher Login");
  });

  it("is logged out by default", () => {
    cy.visit("/");
    cy.get("#nav-bar #login-button").contains("Login");
    cy.get("#login-menu #login").contains("Login");
  });

  it("disables login button if input is empty", () => {
    cy.visit("/");
    cy.get("#login-menu #login-input").clear();
    cy.get("#login-menu #login").should("be.disabled");
    cy.get("#login-menu #login-input").type("OpenTutor");
    cy.get("#login-menu #login").should("not.be.disabled");
  });

  it("logs in and redirects to lessons page", () => {
    cy.visit("/");
    cy.get("#login-menu #login-input").type("OpenTutor");
    cy.get("#login-menu #login").click();
    cy.location("pathname").should("eq", "/lessons");
  });

  it("logs out and redirects to home page", () => {
    cy.visit("/");
    cy.get("#login-menu #login-input").type("OpenTutor");
    cy.get("#login-menu #login").click();
    cy.get("#nav-bar #login-button").contains("OpenTutor");
    cy.get("#nav-bar #login-button").click();
    cy.wait(500);
    cy.get("#logout").click();
    cy.location("pathname").should("eq", "/");
    cy.get("#nav-bar #login-button").contains("Login");
  });

  it("log in button redirects to home page if logged out", () => {
    cy.visit("/lessons");
    cy.get("#nav-bar #login-button").contains("Login");
    cy.get("#nav-bar #login-button").click();
    cy.location("pathname").should("eq", "/admin");
  });
});
