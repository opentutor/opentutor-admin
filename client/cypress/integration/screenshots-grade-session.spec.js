function snapname(n) {
  return `screenshots-grade-session-${n}`;
}

describe("screenshots - grade session", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it("displays feedback after answer marked good", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          session: {
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
              {
                text: "answer 3",
                expectationScores: [
                  {
                    classifierGrade: "Bad",
                    graderGrade: "",
                  },
                  {
                    classifierGrade: "Bad",
                    graderGrade: "Bad",
                  },
                ],
              },
              {
                text: "answer 4",
                expectationScores: [
                  {
                    classifierGrade: "Good",
                    graderGrade: "Good",
                  },
                  {
                    classifierGrade: "Bad",
                    graderGrade: "Bad",
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
    }).as("getSession");
    cy.visit("/sessions/session?sessionId=session1");
    cy.wait("@getSession");
    cy.matchImageSnapshot(
      snapname("displays-feedback-after-answer-marked-good")
    );
  });
});
