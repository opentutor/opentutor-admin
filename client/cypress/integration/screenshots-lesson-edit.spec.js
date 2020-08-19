function snapname(n) {
  return `screenshots-lesson-edit-${n}`;
}

describe("screenshots - lesson edit", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it("displays lesson form on load", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          lesson: {
            lessonId: "lesson",
            name: "lesson",
            intro: "intro",
            question: "question",
            conclusion: ["conclusion"],
            expectations: [
              {
                expectation: "expectation 1",
                hints: [
                  {
                    text: "hint 1.1",
                  },
                ],
              },
            ],
            lastTrainedAt: "",
            isTrainable: true,
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("getLesson");
    cy.visit("/lessons/edit?lessonId=lesson");

    cy.wait("@getLesson");
    cy.matchImageSnapshot(snapname("displays-lesson-form-on-load"));
  });

  it("displays save button enabled after edits", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          lesson: {
            lessonId: "lesson",
            name: "lesson",
            question: "question",
            intro: "intro",
            conclusion: ["conclusion"],
            expectations: [
              {
                expectation: "expectation 1",
                hints: [
                  {
                    text: "hint 1.1",
                  },
                ],
              },
            ],
            lastTrainedAt: "",
            isTrainable: true,
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("getLesson");
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.wait("@getLesson");
    cy.get("#intro").type("Hello World");
    cy.matchImageSnapshot(snapname("displays-save-button-enabled-after-edits"));
  });
});
