/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup, cyMockDefault, mockGQL } from "../support/functions";
import { users } from "../fixtures/users";

describe("users screen", () => {
  it("displays a list of users to an admin", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchUsers", { me: { users } })],
      userRole: "admin",
    });
    cy.visit("/users");
    cy.get("[data-cy=users]").children().should("have.length", 3);
    cy.get("[data-cy=user-0]").find("[data-cy=name]").contains("Admin");
    cy.get("[data-cy=user-0]")
      .find("[data-cy=email]")
      .contains("admin@opentutor.org");
    cy.get("[data-cy=user-0]").find("[data-cy=role]").contains("Admin");
    cy.get("[data-cy=user-1]")
      .find("[data-cy=name]")
      .contains("Content Manager");
    cy.get("[data-cy=user-1]")
      .find("[data-cy=email]")
      .contains("contentmanager@opentutor.org");
    cy.get("[data-cy=user-1]")
      .find("[data-cy=role]")
      .contains("Content Manager");
    cy.get("[data-cy=user-2]").find("[data-cy=name]").contains("Author");
    cy.get("[data-cy=user-2]")
      .find("[data-cy=email]")
      .contains("author@opentutor.org");
    cy.get("[data-cy=user-2]").find("[data-cy=role]").contains("Author");
  });

  it("displays a list of users to a content manager", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchUsers", { me: { users } })],
      userRole: "contentManager",
    });
    cy.visit("/users");
    cy.get("[data-cy=users]").children().should("have.length", 3);
    cy.get("[data-cy=user-0]").find("[data-cy=name]").contains("Admin");
    cy.get("[data-cy=user-0]")
      .find("[data-cy=email]")
      .contains("admin@opentutor.org");
    cy.get("[data-cy=user-0]").find("[data-cy=role]").contains("Admin");
    cy.get("[data-cy=user-1]")
      .find("[data-cy=name]")
      .contains("Content Manager");
    cy.get("[data-cy=user-1]")
      .find("[data-cy=email]")
      .contains("contentmanager@opentutor.org");
    cy.get("[data-cy=user-1]")
      .find("[data-cy=role]")
      .contains("Content Manager");
    cy.get("[data-cy=user-2]").find("[data-cy=name]").contains("Author");
    cy.get("[data-cy=user-2]")
      .find("[data-cy=email]")
      .contains("author@opentutor.org");
    cy.get("[data-cy=user-2]").find("[data-cy=role]").contains("Author");
  });

  it("hides users if not logged in", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      noLogin: true,
      gqlQueries: [mockGQL("FetchUsers", { me: { users } })],
    });
    cy.visit("/users");
    cy.contains("Please login to view users.");
  });

  it("hides users if not admin or content manager", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchUsers", { me: { users } })],
    });
    cy.visit("/users");
    cy.contains("You must be an admin or content manager to view this page.");
  });
});
