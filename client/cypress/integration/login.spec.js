it("loads home page", () => {
  cy.visit("/");
  cy.get("#nav-title").contains("OpenTutor");
  cy.contains("Welcome to OpenTutor");
  cy.contains("Teacher Login");
});

it("is logged out by default", () => {
  cy.visit("/");
  cy.get("#nav-login-button").contains("Login");
  cy.get("#login-button").contains("Login");
  cy.get("#login-button").should("be.disabled");
});

it("logs in and redirects to lessons", () => {
  cy.visit("/");
  cy.get("#login-text-field").fill("OpenTutor");
  cy.get("#login-button").should("not.be.disabled");
  cy.get("#login-button").click();
  cy.get("#nav-title").contains("Lessons");
  cy.get("#nav-login-button").contains("OpenTutor");
});

it("logs out and redirects to home page", () => {
  cy.visit("/");
  cy.get("#login-text-field").fill("OpenTutor");
  cy.get("#login-button").click();
  cy.get("#nav-login-button").click();
  cy.get("#nav-login-menu").contains("Logout");
  cy.get("#nav-login-menu-logout").click();
  cy.get("#nav-login-button").contains("Login");
  cy.get("#login-button").contains("Login");
  cy.get("#login-button").should("be.disabled");
});

it("nav login redirects to home page", () => {
  cy.visit("/lessons");
  cy.get("#nav-login-button").contains("Login");
  cy.get("#nav-login-button").click();
});
