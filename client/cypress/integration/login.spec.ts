/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
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
    cy.location("pathname").should("contain", "/lessons");
  });

  it("logs out and redirects to home page", () => {
    cy.visit("/");
    cy.get("#login-menu #login-input").type("OpenTutor");
    cy.get("#login-menu #login").click();
    cy.get("#nav-bar #login-button").contains("OpenTutor");
    cy.get("#nav-bar #login-button").click();
    cy.wait(500);
    cy.get("#logout").click();
    cy.location("pathname").should("not.contain", "/lessons");
    cy.get("#nav-bar #login-button").contains("Login");
  });

  it("log in button redirects to home page if logged out", () => {
    cy.visit("/lessons");
    cy.get("#nav-bar #login-button").contains("Login");
    cy.get("#nav-bar #login-button").click();
    cy.location("pathname").should("eq", "/admin");
  });
});
