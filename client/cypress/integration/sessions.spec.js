describe("sessions screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql/",
      status: 200,
      response: {
        data: {
          sessions: {
            edges: [
              {
                node: {
                  sessionId: "session 1",
                  classifierGrade: 1,
                  grade: 1,
                },
              },
              {
                node: {
                  sessionId: "session 2",
                  classifierGrade: 0.5,
                  grade: null,
                },
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

  it("displays a table with headers Session Id, Grade", () => {
    cy.visit("/");
    const tableHead = cy.get("table thead tr");
    tableHead.get("th").eq(0).should("contain", "Session Id");
    tableHead.get("th").eq(1).should("contain", "Classifier Grade");
    tableHead.get("th").eq(2).should("contain", "Grade");
  });

  it("displays a list of ungraded sessions by default", () => {
    cy.visit("/");
    const tableBody = cy.get("table tbody");
    tableBody.get("tr").should("have.length", 2);
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(1)").should(
      "contain",
      "session 2"
    );
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(2)").should(
      "contain",
      "0.5"
    );
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(3)").should("contain", "");
  });

  it("toggles a list of graded and ungraded session", () => {
    cy.visit("/");
    cy.get("#toggle").click();
    const tableBody = cy.get("table tbody");
    tableBody.get("tr").should("have.length", 3);
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(1)").should(
      "contain",
      "session 1"
    );
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(2)").should(
      "contain",
      "1"
    );
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(3)").should(
      "contain",
      "1"
    );
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(1)").should(
      "contain",
      "session 2"
    );
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(2)").should(
      "contain",
      "0.5"
    );
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(3)").should("contain", "");
  });

  it("displays an option to view already graded sessions", () => {
    cy.visit("/");
    const option = cy.get("#show-graded-checkbox");
    option.should("not.have.attr", "checked");
  });

  it("opens grading for a session on tap link", () => {
    cy.visit("/");
    cy.get("#session-0 a").click();
    cy.get("#session-display-name").should("contain", "session 2");
  });
});
