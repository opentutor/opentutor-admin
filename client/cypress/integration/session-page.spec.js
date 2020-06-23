describe("sessions screen", () => {
    beforeEach(() => {
      cy.server();
      cy.route({
        method: "POST",
        url: "/grader/graphql/",
        status: 200,
        response: {
          data: 
            {
              username: "username1",
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
  });
  