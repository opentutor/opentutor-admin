/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cySetup,
  cyLogin,
  cyMockGraphQL,
  cyMockByQueryName,
  MockGraphQLQuery,
} from "../support/functions";

function cyMockUsers(): MockGraphQLQuery {
  return cyMockByQueryName("users", {
    me: {
      users: {
        edges: [
          {
            cursor: "cursor 1",
            node: {
              id: "admin",
              name: "Admin",
              email: "admin@opentutor.org",
              isAdmin: true,
              isContentManager: false,
            },
          },
          {
            cursor: "cursor 2",
            node: {
              id: "contentmanager",
              name: "Content Manager",
              email: "contentmanager@opentutor.org",
              isAdmin: false,
              isContentManager: true,
            },
          },
          {
            cursor: "cursor 2",
            node: {
              id: "author",
              name: "Author",
              email: "author@opentutor.org",
              isAdmin: false,
              isContentManager: false,
            },
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: "cursor 2",
        },
      },
    }
  });
}

describe("users screen", () => {
  it("displays a list of users to an admin", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy, true), cyMockUsers()],
    });
    cy.visit("/users");
    cy.wait("@login");
    cy.wait("@users");
    cy.get("#users").children().should("have.length", 3);
    cy.get("#user-0 #name").contains("Admin");
    cy.get("#user-0 #email").contains("admin@opentutor.org");
    cy.get("#user-0 #role").contains("Admin");
    cy.get("#user-1 #name").contains("Content Manager");
    cy.get("#user-1 #email").contains("contentmanager@opentutor.org");
    cy.get("#user-1 #role").contains("Content Manager");
    cy.get("#user-2 #name").contains("Author");
    cy.get("#user-2 #email").contains("author@opentutor.org");
    cy.get("#user-2 #role").contains("Author");
  });

  it("displays a list of users to a content manager", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy, false, true), cyMockUsers()],
    });
    cy.visit("/users");
    cy.wait("@login");
    cy.wait("@users");
    cy.get("#users").children().should("have.length", 3);
    cy.get("#user-0 #name").contains("Admin");
    cy.get("#user-0 #email").contains("admin@opentutor.org");
    cy.get("#user-0 #role").contains("Admin");
    cy.get("#user-1 #name").contains("Content Manager");
    cy.get("#user-1 #email").contains("contentmanager@opentutor.org");
    cy.get("#user-1 #role").contains("Content Manager");
    cy.get("#user-2 #name").contains("Author");
    cy.get("#user-2 #email").contains("author@opentutor.org");
    cy.get("#user-2 #role").contains("Author");
  });


  it("hides users if not admin or content manager", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy), cyMockUsers()],
    });
    cy.visit("/users");
    cy.wait("@login");
    cy.contains("Only Admins and Content Managers can view this page");
  });
});
