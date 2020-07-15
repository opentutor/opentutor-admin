describe("lesson screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          lessonId: "lesson1",
          name: "lesson 1",
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("shows session lesson name", () => {
    cy.visit("/edit?lessonId=lesson1");
    cy.get("#header").should("contain", "Edit");
  });
});
