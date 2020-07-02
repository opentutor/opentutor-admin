describe("sessions screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api",
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
                  graderGrade: "Bad",
                },
              ],
            },
            {
              text: "answer2",
              userResponseExpectationScores: [
                {
                  classifierGrade: "Bad",
                  graderGrade: "Good",
                },
                {
                  classifierGrade: "Good",
                  graderGrade: "Good",
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
    cy.get("#answer-0").should("contain", "answer1");
  });

  it("shows first classifier grade", () => {
    cy.visit("/session");
    cy.get("#classifier-grade-1-0").should("contain", "Bad");
  });

  it("selects grade for first expectation", () => {
    cy.visit("/session");
    cy.get("#select-grade-0-0").should("have.value", "");
    cy.route({
      method: "POST",
      url: "**/grading/graphql/",
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
