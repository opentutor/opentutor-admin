describe("session screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          userSession: {
            sessionId: "session1",
            lesson: {
              name: "lesson 1",
            },
            username: "username1",
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
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("shows session username", () => {
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("#username").should("contain", "username1");
  });

  it("shows first user answer", () => {
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("#answer-0").should("contain", "answer 1");
  });

  it("shows first classifier grade", () => {
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("#classifier-grade-0-0").should("contain", "Good");
  });

  it("shows Good after select grade for first expectation, background should be green", () => {
    cy.visit("/sessions/session?sessionId=session1");
    cy.get("#select-grade-0-0").should("have.value", "");
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          userSession: {
            username: "username1",
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
                    graderGrade: "Good",
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
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
    cy.get("#select-grade-0-0")
      .click()
      .get("#good-grade-0-0")
      .click()
      .contains("Good");
  });
});
