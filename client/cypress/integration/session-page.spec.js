describe("session screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          username: "username1",
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
              userResponseExpectationScores: [
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
              userResponseExpectationScores: [
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
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("shows session username", () => {
    cy.visit("/session");
    cy.get("#username").should("contain", "username1");
  });

  it("shows first user answer", () => {
    cy.visit("/session");
    cy.get("#answer-0").should("contain", "answer 1");
  });

  it("shows first classifier grade", () => {
    cy.visit("/session");
    cy.get("#classifier-grade-0-0").should("contain", "Good");
  });

  it("selects grade for first expectation", () => {
    cy.visit("/session");
    cy.get("#select-grade-0-0").should("have.value", "");
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql/",
      status: 200,
      response: {
        data: {
          username: "username1",
          question: {
            text: "question?",
            expectations: [
              { text: "expected text 1" },
              { text: "expected text 2" },
            ],
          },
          userResponses: [
            {
              text: "answer1",
              userResponseExpectationScores: [
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
              text: "answer2",
              userResponseExpectationScores: [
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
