describe("edit screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          lesson: {
            lessonId: "lesson",
            name: "lesson",
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

  it("shows the edit page for a lesson with a name ", () => {
    cy.visit("/edit?lessonId=lesson");
    cy.get("#header").should("contain", "Edit");
  });

  it("types into introduction edit and shows value", () => {
    cy.visit("/edit?lessonId=lesson");
    cy.get("#intro").type("Hello World");
    cy.get("#intro").should("have", "Hello World");
  });

  it("save button by default not visible", () => {
    cy.visit("/edit?lessonId=lesson");
    cy.get("#save-button").should("not.visible");
  });

  it("making an edit toggles save button visable", () => {
    cy.visit("/edit?lessonId=lesson");
    cy.get("#lesson-name").type("{backspace}");
    cy.get("#save-button").should("be.visible");
  });

  it("making an edit and clicks on save", () => {
    cy.visit("/edit?lessonId=lesson");
    cy.get("#lesson-name").type("{backspace}");
    cy.get("#save-button").click();
  });
});
