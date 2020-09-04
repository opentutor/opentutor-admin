describe("lessons screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
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
                  updatedAt: "1/1/20000, 12:00:00 AM",
                  createdBy: "teacher 1",
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lessonId: "lesson2",
                  name: "lesson 2",
                  updatedAt: "1/1/20000, 12:00:00 AM",
                  createdBy: "teacher 2",
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

  it("displays lesson table with headers", () => {
    cy.visit("/lessons");
    cy.get("#column-header");
    cy.get("#column-header #name").contains("Lesson");
    cy.get("#column-header #launch").contains("Launch");
    cy.get("#column-header #grade").contains("Grade");
    cy.get("#column-header #updatedAt").contains("Date");
    cy.get("#column-header #createdBy").contains("Created By");
    cy.get("#column-header #delete").contains("Delete");
  });

  it("displays a list of lessons", () => {
    cy.visit("/lessons");
    cy.get("#lessons").children().should("have.length", 2);
    cy.get("#lesson-0 #name").contains("lesson 1");
    cy.get("#lesson-0 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#lesson-0 #creator").contains("teacher 1");
    cy.get("#lesson-1 #name").contains("lesson 2");
    cy.get("#lesson-1 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#lesson-1 #creator").contains("teacher 2");
  });

  it("opens edit for a lesson", () => {
    cy.visit("/lessons");
    cy.get("#lesson-0 #name a").click();
    cy.location("pathname").should("eq", "/lessons/edit");
    cy.location("search").should("eq", "?lessonId=lesson1");
  });

  it("opens grade for a lesson", () => {
    cy.visit("/lessons");
    cy.get("#lesson-0 #grade").click();
    cy.location("pathname").should("eq", "/sessions");
    cy.location("search").should("eq", "?lessonId=lesson1");
  });

  it("clicks on create lesson and opens to an edit page for new lesson", () => {
    cy.visit("/lessons");
    cy.get("#create-button").click();
    cy.location("pathname").should("eq", "/lessons/edit");
    cy.location("search").should("eq", "?lessonId=new");
  });
});
