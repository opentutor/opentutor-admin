describe("sessions screen", () => {
  it("displays a table with headers Session Id, Grade", () => {
    cy.visit("/");
    const tableHead = cy.get("table thead tr");
    tableHead.get("th").eq(0).contains("Session Id");
    tableHead.get("th").eq(1).contains("Grade");
  });
});
