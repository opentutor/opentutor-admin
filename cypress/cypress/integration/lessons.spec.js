/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
describe("lessons screen", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("/");
    cy.route("**/config", { GOOGLE_CLIENT_ID: "test" });
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          login: {
            name: "Kayla",
            email: "kayla@opentutor.com"
          },
        },
        errors: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).as("login");
    cy.setCookie("accessToken", "accessToken");
    cy.wait("@login");
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          lessons: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lessonId: "lesson1",
                  name: "lesson 1",
                  updatedAt: "1/1/20000, 12:00:00 AM",
                  createdBy: {name: "teacher 1"},
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lessonId: "lesson2",
                  name: "lesson 2",
                  updatedAt: "1/1/20000, 12:00:00 AM",
                  createdBy: {name: "teacher 2"},
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2",
            },
          },
        },
        errors: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("displays lesson table with headers", () => {
    cy.get("#column-header");
    cy.get("#column-header #name").contains("Lesson");
    cy.get("#column-header #launch").contains("Launch");
    cy.get("#column-header #grade").contains("Grade");
    cy.get("#column-header #updatedAt").contains("Date");
    cy.get("#column-header #createdBy").contains("Created By");
    cy.get("#column-header #delete").contains("Delete");
  });

  it("displays a list of lessons", () => {
    cy.get("#lessons").children().should("have.length", 2);
    cy.get("#lesson-0 #name").contains("lesson 1");
    cy.get("#lesson-0 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#lesson-0 #creator").contains("teacher 1");
    cy.get("#lesson-1 #name").contains("lesson 2");
    cy.get("#lesson-1 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#lesson-1 #creator").contains("teacher 2");
  });

  it("opens edit for a lesson", () => {
    cy.get("#lesson-0 #name a").trigger('mouseover').click();
    cy.location("pathname").should("contain", "/lessons/edit");
    cy.location("search").should("eq", "?lessonId=lesson1");
  });

  it("opens grade for a lesson", () => {
    cy.get("#lesson-0 #grade").trigger('mouseover').click();
    cy.location("pathname").should("contain", "/sessions");
    cy.location("search").should("eq", "?lessonId=lesson1");
  });

  it("clicks on create lesson and opens to an edit page for new lesson", () => {
    cy.get("#create-button").trigger('mouseover').click();
    cy.location("pathname").should("contain", "/lessons/edit");
    cy.location("search").should("eq", "?lessonId=new");
  });

  it("can toggle lessons by creator", () => {
    cy.get("#toggle-creator");
  });

  it("launches a lesson as logged in user", () => {
    cy.get("#lesson-0 #launch button").trigger('mouseover').click();
    cy.location("pathname").should("contain", "/tutor");
    cy.location("search").should("contain", "lesson=lesson1");
    cy.location("search").should("contain", "guest=Kayla");
    cy.location("search").should("contain", "admin=true");
  });
});
