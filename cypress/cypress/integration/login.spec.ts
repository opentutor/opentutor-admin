/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup, cyLoginGoogle, cyMockGraphQL } from "../support/functions";

describe("Login", () => {
  it("loads home page", () => {
    cySetup(cy);
    cy.visit("/");
    cy.contains("Welcome to OpenTutor");
    cy.get("#login-menu #login-button");
  });

  it("login disabled if missing GOOGLE_CLIENT_ID", () => {
    cySetup(cy);
    cy.visit("/");
    cy.get("#login-menu #login-button").should("be.disabled");
  });

  it("login enabled if GOOGLE_CLIENT_ID is set", () => {
    cySetup(cy);
    cy.visit("/");
    cy.route("**/config", { GOOGLE_CLIENT_ID: "test" });
    cy.get("#login-menu #login-button").should("not.be.disabled");
  });

  it("redirects to lesson page after logging in", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLoginGoogle(cy)],
    });
    cy.visit("/");
    cy.wait("@loginGoogle");
    cy.location("pathname").should("contain", "lessons");
  });

  it("redirects to home page after logging out", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLoginGoogle(cy)],
    });
    cy.visit("/");
    cy.wait("@loginGoogle");
    cy.get("#login-option #login-button").trigger('mouseover').click();
    cy.get("#logout").trigger('mouseover').click();
    cy.location("pathname").should("not.contain", "lessons");
  });

  it("cannot view lessons page if not logged in", () => {
    cySetup(cy);
    cy.visit("/lessons");
    cy.location("pathname").should("not.contain", "lessons");
    cy.visit("/lessons/edit");
    cy.location("pathname").should("not.contain", "lessons/edit");
  });

  it("cannot view sessions page if not logged in", () => {
    cySetup(cy);
    cy.visit("/sessions");
    cy.location("pathname").should("not.contain", "sessions");
    cy.visit("/sessions/session?sessionId=session1");
    cy.location("pathname").should("not.contain", "sessions/session");
  });

});
