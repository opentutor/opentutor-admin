describe("lessons screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          lessons: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lessonId: "lesson1",
                  name: "lesson 1",
                  updatedAt: "0",
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lessonId: "lesson2",
                  name: "lesson 2",
                  updatedAt: "1",
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
    });
  });

  it("displays a table with header Lesson and Date", () => {
    cy.visit("/lessons");
    const tableHead = cy.get("table thead tr");
    tableHead.get("th").eq(1).should("contain", "Lesson");
    tableHead.get("th").eq(2).should("contain", "Created By");
    tableHead.get("th").eq(3).should("contain", "Date");
  });

  it("displays 2 lesson names by row", () => {
    cy.visit("/lessons");
    const tableBody = cy.get("table tbody");
    tableBody.get("tr").should("have.length", 3);
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(2)").should(
      "contain",
      "lesson 1"
    );
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(2)").should(
      "contain",
      "lesson 2"
    );
  });

  it("opens edit for a lesson on tap link", () => {
    cy.visit("/lessons");
    cy.get("#lesson-name-0 a").click();
  });

  it("clicks on create lesson and opens to an edit page for the lesson", () => {
    cy.visit("/lessons");
    cy.get("#create-button").click();
  });
});
