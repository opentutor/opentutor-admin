/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { session } from "../fixtures/session";
import { cySetup, cyMockDefault, mockGQL } from "../support/functions";

describe("session screen", () => {
  describe("permissions", () => {
    it("cannot view session page if not logged in", () => {
      cySetup(cy);
      cy.visit("/sessions/session?sessionId=session1");
      cy.contains("Please login to view session.");
    });

    it("cannot view session if user does not have permission to edit", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("FetchSession", { me: { session } })],
      });
      cy.visit("/sessions/session?sessionId=session1");
      cy.contains("You do not have permission to grade this session.");
    });

    it("can view session if user is admin", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("FetchSession", { me: { session } })],
        userRole: "admin",
      });
      cy.visit("/sessions/session?sessionId=session1");
      cy.get("[data-cy=lesson]");
    });

    it("can view session if user is contentManager", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("FetchSession", { me: { session } })],
        userRole: "contentManager",
      });
      cy.visit("/sessions/session?sessionId=session1");
      cy.get("[data-cy=lesson]");
    });

    it("can view session if user created lesson", () => {
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
                  createdBy: "kayla",
                },
                graderGrade: null,
                question: {
                  text: "question?",
                  expectations: [
                    { text: "expected text 1" },
                    { text: "expected text 2" },
                  ],
                },
                userResponses: [
                  {
                    text: "answer 1",
                    expectationScores: [
                      {
                        classifierGrade: "Good",
                        graderGrade: "",
                      },
                      {
                        classifierGrade: "Bad",
                        graderGrade: "",
                      },
                    ],
                  },
                  {
                    text: "answer 2",
                    expectationScores: [
                      {
                        classifierGrade: "Bad",
                        graderGrade: "",
                      },
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
      });
      cy.visit("/sessions/session?sessionId=session1");
      cy.get("[data-cy=lesson]");
    });
  });

  it("shows lesson name", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session } })],
      userRole: "admin",
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("[data-cy=lesson]").should("contain", "lesson 1");
  });

  it("shows session username", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session } })],
      userRole: "admin",
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("[data-cy=username]").should("contain", "username1");
  });

  it("shows session date", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session } })],
      userRole: "admin",
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("[data-cy=date]").should("contain", "1/1/2001");
  });

  it("shows lesson question", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session } })],
      userRole: "admin",
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("[data-cy=question]").should("contain", "question?");
  });

  it("shows session score", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session } })],
      userRole: "admin",
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("[data-cy=score]").should("contain", "Score: ?");
  });

  it("shows user responses", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session } })],
      userRole: "admin",
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("[data-cy=response-0]")
      .find("[data-cy=answer]")
      .should("contain", "answer 1");
    cy.get("[data-cy=response-0]")
      .find("[data-cy=grade-0]")
      .find("[data-cy=classifier-grade]")
      .should("contain", "Good");
    cy.get("[data-cy=response-0]")
      .find("[data-cy=grade-1]")
      .find("[data-cy=classifier-grade]")
      .should("contain", "Bad");
    cy.get("[data-cy=response-1]")
      .find("[data-cy=answer]")
      .should("contain", "answer 2");
    cy.get("[data-cy=response-1]")
      .find("[data-cy=grade-0]")
      .find("[data-cy=classifier-grade]")
      .should("contain", "Bad");
    cy.get("[data-cy=response-1]")
      .find("[data-cy=grade-1]")
      .find("[data-cy=classifier-grade]")
      .should("contain", "Good");
  });

  it("grades first response", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session } })],
      userRole: "admin",
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("[data-cy=response-0]")
      .find("[data-cy=grade-0]")
      .find("[data-cy=select-grade]")
      .should("have.value", "");
    cy.get("[data-cy=response-0]")
      .find("[data-cy=grade-0]")
      .find("[data-cy=select-grade]")
      .trigger("mouseover")
      .click();
    cy.get("[data-cy=good]").trigger("mouseover").click();
  });
});
