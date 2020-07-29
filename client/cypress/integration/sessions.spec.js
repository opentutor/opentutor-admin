describe("sessions screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          userSessions: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lesson: {
                    name: "lesson 1",
                  },
                  sessionId: "session 1",
                  classifierGrade: 1,
                  graderGrade: 1,
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lesson: {
                    name: "lesson 2",
                  },
                  sessionId: "session 2",
                  classifierGrade: 0.5,
                  graderGrade: null,
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

  it("displays a table with headers Session Id, Username, Date, Classifier Grade, Grade", () => {
    cy.visit("/sessions");
    const tableHead = cy.get("table thead tr");
    tableHead.get("th").eq(0).should("contain", "Session");
    tableHead.get("th").eq(1).should("contain", "Username");
    tableHead.get("th").eq(2).should("contain", "Date");
    tableHead.get("th").eq(3).should("contain", "Classifier Grade");
    tableHead.get("th").eq(4).should("contain", "Grade");
  });

  it("displays a list of ungraded sessions by default", () => {
    cy.visit("/sessions");
    const tableBody = cy.get("table tbody");
    tableBody.get("tr").should("have.length", 2);
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(1)").should(
      "contain",
      "lesson 2"
    );
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(4)").should(
      "contain",
      "50"
    );
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(5)").should(
      "contain",
      "?"
    );
  });

  it("toggles a list of graded and ungraded session", () => {
    cy.visit("/sessions");
    cy.get("#toggle").click();
    const tableBody = cy.get("table tbody");
    tableBody.get("tr").should("have.length", 3);
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(1)").should(
      "contain",
      "lesson 1"
    );
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(4)").should(
      "contain",
      "100"
    );
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(5)").should(
      "contain",
      "100"
    );
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(1)").should(
      "contain",
      "lesson 2"
    );
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(4)").should(
      "contain",
      "50"
    );
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(5)").should(
      "contain",
      "?"
    );
  });

  it("displays an option to view already graded sessions", () => {
    cy.visit("/sessions");
    const option = cy.get("#show-graded-checkbox");
    option.should("not.have.attr", "checked");
  });

  it("opens grading for a session on tap link", () => {
    cy.visit("/sessions");
    cy.get("#session-0 a").click();
    cy.get("#session-display-name").should("contain", "No Lesson Name");
  });
});
