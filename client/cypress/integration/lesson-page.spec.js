describe("edit screen", () => {
  beforeEach(() => {
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
            introduction: "introduction",
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
            isTrainable: true,
            lastTrainedAt: "",
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

  it("loads edit page ", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
  });

  it("types into introduction edit and shows value", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#intro").fill("Hello World");
    cy.get("#intro").should("have", "Hello World");
  });

  it("save button by default not visible", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#save-button").should("not.visible");
  });

  it("making an edit toggles save button visable", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").fill("{backspace}");
    cy.get("#save-button").should("be.visible");
  });

  it("making an edit and clicks on save", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").fill("{backspace}");
    cy.get("#save-button").click();
  });

  it("train lesson and return success", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.route({
      method: "POST",
      url: "**/train",
      status: 200,
      response: {
        data: {
          statusUrl: "/training/status/{jobId}",
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
    cy.get("#train-button").click();
    for (let i = 0; i < 3; i++) {
      cy.route({
        method: "GET",
        url: "**/training/**",
        status: 200,
        response: {
          data: {
            trainStatus: {
              status: "IN_PROGRESS",
            },
          },
          errors: null,
        },
        delay: 10,
        headers: {
          "Content-Type": "application/json",
        },
      }).as(`inProgress`);
      cy.wait(`@inProgress`);
    }
    cy.route({
      method: "GET",
      url: "**/training/**",
      status: 200,
      response: {
        data: {
          trainStatus: {
            status: "COMPLETE",
            success: true,
            info: {
              accuracy: 0.83,
            },
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

  it("train lesson and return fail", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.route({
      method: "POST",
      url: "**/train",
      status: 200,
      response: {
        data: {
          statusUrl: "/training/status/{jobId}",
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
    cy.get("#train-button").click();
    for (let i = 0; i < 3; i++) {
      cy.route({
        method: "GET",
        url: "**/training/**",
        status: 200,
        response: {
          data: {
            trainStatus: {
              status: "IN_PROGRESS",
            },
          },
          errors: null,
        },
        delay: 10,
        headers: {
          "Content-Type": "application/json",
        },
      }).as(`inProgress`);
      cy.wait(`@inProgress`);
    }
    cy.route({
      method: "GET",
      url: "**/training/**",
      status: 200,
      response: {
        data: {
          trainStatus: {
            status: "COMPLETE",
            success: false,
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
});
