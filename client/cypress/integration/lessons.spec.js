describe("lessons screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          lessons: [
            {
              lessonName: "lesson 1",
              lessonId: "lesson1",
              expectations: [
                {
                  expectation: "expectation 1",
                },
                {
                  expectation: "expectation 2",
                },
              ],
              hints: [
                {
                  hint: "hint 1",
                },
                {
                  expectation: "hint 2",
                },
              ],
            },
            {
              lessonName: "lesson 2",
              lessonId: "lesson2",
              expectations: [
                {
                  expectation: "expectation 1",
                },
                {
                  expectation: "expectation 2",
                },
              ],
              hints: [
                {
                  hint: "hint 1",
                },
                {
                  expectation: "hint 2",
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

  it("displays a table with headers Lesson", () => {
    cy.visit("/lessons");
    const tableHead = cy.get("table thead tr");
    tableHead.get("th").eq(0).should("contain", "Lesson");
  });
});
