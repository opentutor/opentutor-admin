function snapname(n) {
  return `screenshots-lesson-list-${n}`;
}

describe("screenshots - lesson list", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it("displays a list of lessons", () => {
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
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lessonId: "lesson2",
                  name: "lesson 2",
                  updatedAt: "1/1/20000, 12:00:00 AM",
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
    }).as("lessonsList");
    cy.visit("/lessons");
    cy.wait("@lessonsList");
    cy.matchImageSnapshot(snapname("displays-a-list-of-lessons"));
  });
});
