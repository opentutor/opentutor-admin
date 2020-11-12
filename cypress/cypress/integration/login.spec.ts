/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
describe("Login", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("/");
  });

  it("loads home page if logged out", () => {
    cy.contains("Welcome to OpenTutor");
    cy.get("#login-menu #login-button");
  });

  it("login disabled if missing GOOGLE_CLIENT_ID", () => {
    cy.get("#login-menu #login-button").should("be.disabled");
  });

  it("login enabled if GOOGLE_CLIENT_ID is set", () => {
    cy.route("**/config", { GOOGLE_CLIENT_ID: "test" });
    cy.get("#login-menu #login-button").should("not.be.disabled");
  });

  it("redirects to lesson page if logged in", () => {
    cy.setCookie("accessToken", "accessToken");
    cy.route({
      method: "GET",
      url:
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=accessToken",
      status: 200,
      response: {
        data: {
          id: "kayla-google-id",
          given_name: "Kayla",
        },
        errors: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    cy.location("pathname").should("contain", "lessons");
    cy.get("#nav-bar").contains("Kayla");
  });

  it("logs out and returns to home page", () => {
    cy.setCookie("accessToken", "accessToken");
    cy.route({
      method: "GET",
      url:
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=accessToken",
      status: 200,
      response: {
        data: {
          id: "kayla-google-id",
          given_name: "Kayla",
        },
        errors: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    cy.get("#login-option #login-button").click();
    cy.get("#login-menu #logout").click();
    cy.location("pathname").should("not.contain", "lessons");
  });
});
