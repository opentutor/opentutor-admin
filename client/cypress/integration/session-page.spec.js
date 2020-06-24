describe("sessions screen", () => {
    beforeEach(() => {
      cy.server();
      cy.route({
        method: "POST",
        url: "**/grading/graphql/",
        status: 200,
        response: {
          data: 
            {
              username: "username1",
              answers: ["answer1", "answer2"],
            }
          ,
          errors: null,
        },
        delay: 10,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  
    it("shows session username", () => {
      cy.visit("/session");
      cy.get("#username").should("contain", "username1");
    });

    it.only("table with user answer for each row",  () => {
      cy.visit("/session");
      const tableBody = cy.get("table tbody");
      tableBody.get("tr").should("have.length", 3);
      cy.get("table>tbody>tr:nth-child(1)>td:nth-child(1)").should(
        "contain",
        "answer1"
      );
      cy.get("table>tbody>tr:nth-child(2)>td:nth-child(1)").should(
        "contain",
        "answer2"
      );
    });
    
  });
  