/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { lessons } from "../fixtures/lesson";
import { cySetup, cyMockDefault, mockGQL } from "../support/functions";

describe("lessons screen", () => {
  describe("permissions", () => {
    it("cannot view lessons list if not logged in", () => {
      cySetup(cy);
      cy.visit("/lessons");
      cy.contains("Please login to view lessons.");
    });

    it("disables edit, grade, and delete if user does not have edit permissions", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("lessons", lessons, true)],
      });
      cy.visit("/lessons");
      cy.get("#lesson-0 #delete-button").should("be.disabled");
      cy.get("#lesson-0 #grade-button").should("be.disabled");
      cy.get("#lesson-0 #name").should("not.have.class", "a");
      cy.get("#lesson-1 #delete-button").should("be.disabled");
      cy.get("#lesson-1 #grade-button").should("be.disabled");
      cy.get("#lesson-1 #name").should("not.have.class", "a");
    });

    it("enables edit, grade, and delete if user is an admin", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("lessons", lessons, true)],
        userRole: "admin",
      });
      cy.visit("/lessons");
      cy.get("#lesson-0 #delete-button").should("not.be.disabled");
      cy.get("#lesson-0 #grade-button").should("not.be.disabled");
    });

    it("enables edit, grade, and delete if user is a contentManager", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("lessons", lessons, true)],
        userRole: "contentManager",
      });
      cy.visit("/lessons");
      cy.get("#lesson-0 #delete-button").should("not.be.disabled");
      cy.get("#lesson-0 #grade-button").should("not.be.disabled");
    });

    it("enables edit, grade, and delete if user created lesson", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL(
            "lessons",
            {
              edges: [
                {
                  cursor: "cursor 1",
                  node: {
                    lessonId: "lesson1",
                    name: "lesson 1",
                    updatedAt: "1/1/20000, 12:00:00 AM",
                    createdBy: "kayla",
                    createdByName: "Kayla",
                    userPermissions: {
                      edit: false,
                      view: false,
                    },
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: "cursor 2",
              },
            },
            true
          ),
        ],
      });
      cy.visit("/lessons");
      cy.get("#lesson-0 #delete-button").should("not.be.disabled");
      cy.get("#lesson-0 #grade-button").should("not.be.disabled");
    });
  });

  it("displays lesson table with headers", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("lessons", lessons, true)],
      userRole: "admin",
    });
    cy.visit("/lessons");
    cy.get("#column-header");
    cy.get("#column-header #name").contains("Lesson");
    cy.get("#column-header #updatedAt").contains("Date");
    cy.get("#column-header #createdByName").contains("Created By");
  });

  it("displays a list of lessons", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("lessons", lessons, true)],
      userRole: "admin",
    });
    cy.visit("/lessons");
    cy.get("#lessons").children().should("have.length", 2);
    cy.get("#lesson-0 #name").contains("lesson 1");
    cy.get("#lesson-0 #launch-button").should("not.be.disabled");
    cy.get("#lesson-0 #grade-button").should("not.be.disabled");
    cy.get("#lesson-0 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#lesson-0 #creator").contains("teacher 1");
    cy.get("#lesson-0 #delete-button").should("not.be.disabled");
    cy.get("#lesson-1 #name").contains("lesson 2");
    cy.get("#lesson-1 #launch-button").should("not.be.disabled");
    cy.get("#lesson-1 #grade-button").should("not.be.disabled");
    cy.get("#lesson-1 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#lesson-1 #creator").contains("teacher 2");
    cy.get("#lesson-1 #delete-button").should("not.be.disabled");
  });

  it("opens edit for a lesson", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("lessons", lessons, true)],
      userRole: "admin",
    });
    cy.visit("/lessons");
    cy.get("#lesson-0 #name a").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/lessons/edit");
    cy.location("search").should("eq", "?lessonId=lesson1");
  });

  it("opens grade for a lesson", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("lessons", lessons, true)],
      userRole: "admin",
    });
    cy.visit("/lessons");
    cy.get("#lesson-0 #grade-button").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/sessions");
    cy.location("search").should("eq", "?lessonId=lesson1");
  });

  it("opens copy for a lesson", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("lessons", lessons, true)],
      userRole: "admin",
    });
    cy.visit("/lessons");
    cy.get("#lesson-0 #copy-button").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/lessons/edit");
    cy.location("search").should("eq", "?copyLesson=lesson1");
  });

  it("launches a lesson", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("lessons", lessons, true)],
      userRole: "admin",
    });
    cy.visit("/lessons");
    cy.get("#lesson-0 #launch-button").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/tutor");
    cy.location("search").should("contain", "lesson=lesson1");
    cy.location("search").should("contain", "guest=Kayla");
    cy.location("search").should("contain", "admin=true");
  });

  it("clicks on create lesson and opens to an edit page for new lesson", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("lessons", lessons, true)],
      userRole: "admin",
    });
    cy.visit("/lessons");
    cy.get("#create-button").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/lessons/edit");
  });
});
