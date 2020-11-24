/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup, cyLogin, cyMockGraphQL } from "../support/functions";

describe("Navigation bar", () => {
  it("shows page title", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy)],
    });
    cy.visit("/");
    cy.wait("@login");
    cy.get("#nav-bar").get("#title").contains("Lessons");
    cy.visit("/lessons/edit");
    cy.get("#nav-bar").get("#title").contains("Edit Lesson");
    cy.visit("/sessions");
    cy.get("#nav-bar").get("#title").contains("Grading");
    cy.visit("/sessions/session");
    cy.get("#nav-bar").get("#title").contains("Grade Session");
  });

  it("opens drawer menu", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy)],
    });
    cy.visit("/");
    cy.wait("@login");
    cy.get("#drawer").should("not.exist");
    cy.get("#nav-bar").get("#menu-button").trigger('mouseover').click();
    cy.get("#drawer");
  });

  it("navigates with menu", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy)],
    });
    cy.visit("/");
    cy.wait("@login");
    cy.get("#nav-bar").get("#menu-button").trigger('mouseover').click();
    cy.get("#drawer a").eq(1).contains("Grading");
    cy.get("#drawer a").eq(1).trigger('mouseover').click();
    cy.location("pathname").should("contain", "/sessions");
  });
});