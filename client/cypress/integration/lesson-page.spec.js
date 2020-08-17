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
    cy.get("#intro").type("Hello World");
    cy.get("#intro").should("have", "Hello World");
  });

  it("save button by default not visible", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#save-button").should("not.visible");
  });

  it("making an edit toggles save button visable", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").type("{backspace}");
    cy.get("#save-button").should("be.visible");
  });

  it("making an edit and clicks on save", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").type("{backspace}");
    cy.get("#save-button").click();
  });
});
