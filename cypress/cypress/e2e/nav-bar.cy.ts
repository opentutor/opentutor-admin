/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { lessons } from "../fixtures/lesson";
import { sessions } from "../fixtures/session";
import { users } from "../fixtures/users";
import { cySetup, cyMockDefault, mockGQL } from "../support/functions";

describe("Navigation bar", () => {
  describe("navigation", () => {
    it("navigates to /lessons", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        userRole: "admin",
      });
      cy.visit("/");
      cy.get("[data-cy=nav-bar]")
        .get("[data-cy=menu-button]")
        .trigger("mouseover")
        .click();
      cy.get("[data-cy=drawer] a").eq(0).contains("Lessons");
      cy.get("[data-cy=drawer] a").eq(0).trigger("mouseover").click();
      cy.location("pathname").should("contain", "/lessons");
    });

    it("navigates to /sessions", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        userRole: "admin",
      });
      cy.visit("/");
      cy.get("[data-cy=nav-bar]")
        .get("[data-cy=menu-button]")
        .trigger("mouseover")
        .click();
      cy.get("[data-cy=drawer] a").eq(1).contains("Grading");
      cy.get("[data-cy=drawer] a").eq(1).trigger("mouseover").click();
      cy.location("pathname").should("contain", "/sessions");
    });

    it("navigates to /users", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        userRole: "admin",
      });
      cy.visit("/");
      cy.get("[data-cy=nav-bar]")
        .get("[data-cy=menu-button]")
        .trigger("mouseover")
        .click();
      cy.get("[data-cy=drawer] a").eq(2).contains("Users");
      cy.get("[data-cy=drawer] a").eq(2).trigger("mouseover").click();
      cy.location("pathname").should("contain", "/users");
    });
  });

  describe("permissions", () => {
    it("hides /users if user does not have elevated permissions", () => {
      cySetup(cy);
      cyMockDefault(cy);
      cy.visit("/");
      cy.get("[data-cy=nav-bar]")
        .get("[data-cy=menu-button]")
        .trigger("mouseover")
        .click();
      cy.get("[data-cy=drawer] a").eq(0).contains("Lessons");
      cy.get("[data-cy=drawer] a").eq(1).contains("Grading");
      cy.get("[data-cy=drawer] a").should("have.length", 2);
    });

    it("shows /users if user is an admin", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        userRole: "admin",
      });
      cy.visit("/");
      cy.get("[data-cy=nav-bar]")
        .get("[data-cy=menu-button]")
        .trigger("mouseover")
        .click();
      cy.get("[data-cy=drawer] a").eq(2).contains("Users");
    });

    it("shows /users if user is a content manager", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        userRole: "contentManager",
      });
      cy.visit("/");
      cy.get("[data-cy=nav-bar]")
        .get("[data-cy=menu-button]")
        .trigger("mouseover")
        .click();
      cy.get("[data-cy=drawer] a").eq(2).contains("Users");
    });
  });

  it("shows page title", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin",
      gqlQueries: [
        mockGQL("FetchLessons", { me: { lessons } }),
        mockGQL("FetchSessions", { me: { sessions } }),
        mockGQL("FetchUsers", { me: { users } }),
      ],
    });
    cy.visit("/lessons");
    cy.get("[data-cy=nav-bar]").get("[data-cy=title]").contains("Lessons");
    cy.visit("/lessons/edit");
    cy.get("[data-cy=nav-bar]")
      .get("[data-cy=title]")
      .contains("Create Lesson");
    cy.visit("/sessions");
    cy.get("[data-cy=nav-bar]").get("[data-cy=title]").contains("Grading");
    cy.visit("/sessions/session");
    cy.get("[data-cy=nav-bar]")
      .get("[data-cy=title]")
      .contains("Grade Session");
    cy.visit("/users");
    cy.get("[data-cy=nav-bar]").get("[data-cy=title]").contains("Manage Users");
  });

  it("opens drawer menu", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin",
    });
    cy.visit("/");
    cy.get("[data-cy=drawer] a").should("not.exist");
    cy.get("[data-cy=nav-bar]")
      .get("[data-cy=menu-button]")
      .trigger("mouseover")
      .click();
    cy.get("[data-cy=drawer] a");
    cy.get("[data-cy=drawer] a").eq(0).contains("Lessons");
    cy.get("[data-cy=drawer] a").eq(1).contains("Grading");
    cy.get("[data-cy=drawer] a").eq(2).contains("Users");
  });

  it("shows back button on session page instead of menu button", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchSession", {
          me: {
            session: {
              username: "username1",
              sessionId: "session1",
              createdAt: "1/1/2001",
              lesson: {
                name: "lesson 1",
              },
              graderGrade: null,
              question: {
                text: "question?",
                expectations: [{ text: "expected text 1" }],
              },
              userResponses: [
                {
                  text: "answer 1",
                  expectationScores: [
                    {
                      classifierGrade: "Good",
                      graderGrade: "",
                    },
                  ],
                },
              ],
            },
          },
        }),
      ],
      userRole: "admin",
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("[data-cy=nav-bar]").get("[data-cy=back-button");
  });
});
