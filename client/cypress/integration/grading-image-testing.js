describe("visual testing grading screen", () => {
  it("shows Good after select grade for first expectation, background should be green", () => {
    cy.server();
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
    cy.matchImageSnapshot();
  });

  it("displays grading list with default don't show grade", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          userSessions: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lesson: {
                    name: "lesson 1",
                  },
                  sessionId: "session 1",
                  classifierGrade: 1,
                  graderGrade: 1,
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lesson: {
                    name: "lesson 2",
                  },
                  sessionId: "session 2",
                  classifierGrade: 0.5,
                  graderGrade: null,
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2 ",
            },
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("sessionsList");
    cy.visit("/sessions");

    cy.wait("@sessionsList");
    cy.matchImageSnapshot();
  });

  it("displays grading list with show grade", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          userSessions: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lesson: {
                    name: "lesson 1",
                  },
                  sessionId: "session 1",
                  classifierGrade: 1,
                  graderGrade: 1,
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lesson: {
                    name: "lesson 2",
                  },
                  sessionId: "session 2",
                  classifierGrade: 0.5,
                  graderGrade: null,
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2 ",
            },
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("sessionsList");
    cy.visit("/sessions");
    cy.get("#toggle").check();
    //option.should("not.have.attr", "checked");
    cy.wait("@sessionsList");
    cy.matchImageSnapshot();
  });
});
