describe("Navigation bar", () => {
  it("shows page title", () => {
    cy.visit("/");
    cy.get("#nav-bar").get("#title").contains("OpenTutor");
    cy.visit("/lessons");
    cy.get("#nav-bar").get("#title").contains("Lessons");
    cy.visit("/lessons/edit?lessonId=new");
    cy.get("#nav-bar").get("#title").contains("Edit Lesson");
    cy.visit("/sessions");
    cy.get("#nav-bar").get("#title").contains("Grading");
    cy.visit("/sessions/session");
    cy.get("#nav-bar").get("#title").contains("Grade Session");
  });

  it("opens drawer menu", () => {
    cy.visit("/");
    cy.get("#drawer").should("not.exist");
    cy.get("#nav-bar").get("#menu-button").click();
    cy.get("#drawer");
  });

  it("navigates with menu", () => {
    cy.visit("/");
    cy.get("#nav-bar").get("#menu-button").click();
    cy.get("#drawer a").eq(0).contains("Lessons");
    cy.get("#drawer a").eq(0).click();
    cy.location("pathname").should("eq", "/lessons");
    cy.wait(500);
    cy.get("#nav-bar").get("#menu-button").click();
    cy.get("#drawer a").eq(1).contains("Grading");
    cy.get("#drawer a").eq(1).click();
    cy.location("pathname").should("eq", "/sessions");
  });
});
