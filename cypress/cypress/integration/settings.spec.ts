/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cySetup,
  cyMockDefault,
  mockGQL
} from "../support/functions";
import { users } from "../fixtures/users";

describe("settings screen", () => {
  it("displays settings to an admin", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin"
    })
    cy.visit("/settings");
    cy.get("[data-cy=train-default-button]").should("exist")
  });

  it("hides settings if not logged in", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      noLogin: true,
    })
    cy.visit("/settings");
    cy.contains("Please login to view settings.")
    cy.get("[data-cy=train-default-button]").should("not.exist")
  });

  it("hides settings if not admin", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "contentManager"
    })
    cy.visit("/settings");
    cy.contains("You must be an admin to view this page.")
    cy.get("[data-cy=train-default-button]").should("not.exist")
  });
});
