/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup, cyMockDefault, mockGQL } from "../support/functions";
import { users } from "../fixtures/users";

export const me = {
  sessions: {
    edges: [
      {
        node: {
          sessionId: "session1",
          createdAt: "6/28/2021, 8:11:31 PM",
          username: "Daniel Budziwojski",
          userResponses: [
            {
              text: "PAL3",
              expectationScores: [
                {
                  graderGrade: "Good",
                  classifierGrade: "Bad",
                },
                {
                  graderGrade: "Good",
                  classifierGrade: "Good",
                },
              ],
            },
          ],
        },
      },
      {
        node: {
          sessionId: "session2",
          createdAt: "6/28/2021, 8:09:45 PM",
          username: "Daniel Budziwojski",
          userResponses: [
            {
              text: "Hello",
              expectationScores: [
                {
                  graderGrade: "",
                  classifierGrade: "Bad",
                },
                {
                  graderGrade: "",
                  classifierGrade: "Bad",
                },
              ],
            },
            {
              text: "not sure",
              expectationScores: [
                {
                  graderGrade: "",
                  classifierGrade: "Bad",
                },
                {
                  graderGrade: "",
                  classifierGrade: "Bad",
                },
              ],
            },
            {
              text: "human resource",
              expectationScores: [
                {
                  graderGrade: "",
                  classifierGrade: "Good",
                },
                {
                  graderGrade: "",
                  classifierGrade: "Bad",
                },
              ],
            },
            {
              text: "OpenTutor?",
              expectationScores: [
                {
                  graderGrade: "",
                  classifierGrade: "Bad",
                },
                {
                  graderGrade: "",
                  classifierGrade: "Bad",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  lesson: {
    lessonId: "q1",
    name: "lesson",
    intro: "introduction",
    question: "question",
    image: null,
    conclusion: ["conclusion"],
    expectations: [
      {
        expectation: "expectation 1",
        hints: [
          {
            text: "hint 1.1",
          },
        ],
        features: {
          bad: ["bad1", "bad2"],
        },
      },
      {
        expectation: "expectation 2",
        hints: [
          {
            text: "hint 2.1",
          },
        ],
        features: {
          bad: ["bad1", "bad2"],
        },
      },
    ],
    createdBy: "opentutor",
    createdByName: "OpenTutor",
  },
};

describe("expectation data page", () => {
  it("hides settings if not logged in", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      noLogin: true,
    });
    cy.visit("/sessions/data?lessonId=q1&expectation=1");
    cy.contains("Please login to view settings.");
    cy.get("[data-cy=train-default-button]").should("not.exist");
  });

  it("hides settings if not admin", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "contentManager",
    });
    cy.visit("/sessions/data?lessonId=q1&expectation=1");
    cy.contains("You must be an admin to view this page.");
    cy.get("[data-cy=train-default-button]").should("not.exist");
  });

  it("throws an error if missing query params", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin",
    });
    cy.visit("/sessions/data");
    cy.get("[data-cy=malformed-link]").should("exist");
  });

  it("shows a populated table to an admin", () => {
    const expectationToTest = 0;
    let counter = 0;

    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin",
      gqlQueries: [mockGQL("FetchSessions", { me }, false, true)],
    });
    cy.visit(`/sessions/data?lessonId=q1&expectation=${expectationToTest}`);
    cy.get("[data-cy=malformed-link]").should("not.exist");
    cy.get("[data-cy=expectation-table]").should("exist");
    [
      "[data-cy=date]",
      "[data-cy=username]",
      "[data-cy=userAnswer]",
      "[data-cy=grade]",
      "[data-cy=classifierGrade]",
      "[data-cy=confidence]",
      "[data-cy=accurate]",
    ].map((header) => {
      cy.get(header).should("exist");
    });
    cy.get("[data-cy=table-title]").contains(
      me.lesson.expectations[expectationToTest].expectation
    );
    me.sessions.edges.map((session) => {
      session.node.userResponses.map((userResponse, index) => {
        cy.get(`[data-cy=table-row-${counter}]`).contains(userResponse.text);
        counter++;
      });
    });
  });

  it("filters", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin",
      gqlQueries: [mockGQL("FetchSessions", { me }, false, true)],
    });
    cy.visit("/sessions/data?lessonId=q1&expectation=0");
    cy.get("[data-cy=filter-button]").should("exist");
  });

  it("paginates", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      userRole: "admin",
      gqlQueries: [mockGQL("FetchSessions", { me }, false, true)],
    });
    cy.visit("/sessions/data?lessonId=q1&expectation=0");
    cy.contains("Rows per page");
  });
});
