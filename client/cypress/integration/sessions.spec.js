describe("sessions screen", () => {
  it("displays a table with headers Session Id, Grade", () => {
    cy.visit("/");
    const tableHead = cy.get("table thead tr");
    tableHead.get("th").eq(0).should("contain", "Session Id");
    tableHead.get("th").eq(1).should("contain", "Classifier Grade");
    tableHead.get("th").eq(2).should("contain", "Grade");
  });

  it("displays a list of ungraded session by default", () => {
    cy.visit("/");
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
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(3)").should(
      "contain",
      "0.5"
    );
  });

  it("displays an option to view already graded sessions", () => {
    cy.visit("/");
    const option = cy.get("#show-graded-checkbox");
    option.should("not.have.attr", "checked");
  });
});
