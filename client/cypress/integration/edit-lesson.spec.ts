/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
describe("lesson screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          lesson: {
            lessonId: "lesson",
            name: "lesson",
            introduction: "introduction",
            question: "question",
            image: null,
            conclusion: ["conclusion"],
            expectations: [
              {
                expectation: "expectation 1",
                hints: [
                  {
                    text: "hint 1.1",
                  },
                ],
                features: {
                  bad: ["bad1", "bad2"],
                },
              },
            ],
            features: null,
            isTrainable: true,
            lastTrainedAt: "",
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
    cy.route({
      url:
        "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
      response: "fixtures:image.jpg,binary",
    });
  });

  it("loads edit page ", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
  });

  it("new lesson has default values", () => {
    cy.visit("/lessons/edit?lessonId=new");
    cy.get("#lesson-name").should("have.value", "Display name for the lesson");
    cy.get("#lesson-creator").should("have.value", "");
    cy.get("#intro").should(
      "have.value",
      "Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'"
    );
    cy.get("#question").should(
      "have.value",
      "Question the student needs to answer, e.g. 'What are the colors in RGB?'"
    );
    cy.get("#image").should("have.value", "");
    cy.get("#expectations").children().should("have.length", 1);
    cy.get("#expectation-0 #edit-expectation").should(
      "have.value",
      "Add a short ideal answer for an expectation, e.g. 'Red'"
    );
    cy.get("#expectation-0 .jsoneditor").contains("bad");
    cy.get("#expectation-0 .jsoneditor").contains("good");
    cy.get("#expectation-0 #hints").children().should("have.length", 1);
    cy.get("#hint-0 #edit-hint").should(
      "have.value",
      "Add a hint to help for the expectation, e.g. 'One of them starts with R'"
    );
    cy.get("#conclusions").children().should("have.length", 1);
    cy.get("#conclusion-0 #edit-conclusion").should(
      "have.value",
      "Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'"
    );
  });

  it("edits a new lesson", () => {
    cy.visit("/lessons/edit?lessonId=new");
    cy.get("#lesson-name").fill("Review Diode Current Flow");
    cy.get("#lesson-id").fill("review-diode-current-flow");
    cy.get("#intro").fill(
      "This is a warm up question on the behavior of P-N junction diodes."
    );
    cy.get("#question").fill(
      "With a DC input source, does current flow in the same or the opposite direction of the diode arrow?"
    );
    cy.get("#image").fill(
      "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg"
    );
    cy.get("#expectation-0 #edit-expectation").fill(
      "Current flows in the same direction as the arrow."
    );
    cy.get("#expectation-0 #hint-0 #edit-hint").fill(
      "What is the current direction through the diode when the input signal is DC input?"
    );
    cy.get("#conclusion-0 #edit-conclusion").fill(
      "Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode."
    );

    cy.get("#lesson-name").should("have.value", "Review Diode Current Flow");
    cy.get("#lesson-id").should("have.value", "review-diode-current-flow");
    cy.get("#lesson-creator").should("have.value", "");
    cy.get("#intro").should(
      "have.value",
      "This is a warm up question on the behavior of P-N junction diodes."
    );
    cy.get("#question").should(
      "have.value",
      "With a DC input source, does current flow in the same or the opposite direction of the diode arrow?"
    );
    cy.get("#image").should(
      "have.value",
      "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg"
    );
    cy.get("#image-thumbnail").should(
      "have.attr",
      "src",
      "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg"
    );
    cy.get("#expectation-0 #edit-expectation").should(
      "have.value",
      "Current flows in the same direction as the arrow."
    );
    cy.get("#expectation-0 #hint-0 #edit-hint").should(
      "have.value",
      "What is the current direction through the diode when the input signal is DC input?"
    );
    cy.get("#conclusion-0 #edit-conclusion").should(
      "have.value",
      "Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode."
    );
  });

  it("validates lessonId", () => {
    cy.visit("/lessons/edit?lessonId=test");
    // no capitals
    cy.get("#lesson-id").fill("A");
    cy.get("#save-button").should("be.disabled");
    cy.get("#launch-button").should("be.disabled");
    // no spaces
    cy.get("#lesson-id").fill(" ");
    cy.get("#save-button").should("be.disabled");
    cy.get("#launch-button").should("be.disabled");
    // must be a-z 0-9 -
    cy.get("#lesson-id").fill("a-0");
    cy.get("#save-button").should("not.be.disabled");
    cy.get("#launch-button").should("not.be.disabled");
  });

  it("validates expectation features json", () => {
    cy.visit("/lessons/edit?lessonId=test");
    // invalid field type
    cy.get("#expectation-0 #edit-expectation").fill("0");
    cy.get("#save-button").should("be.disabled");
    cy.get("#launch-button").should("be.disabled");
    // valid
    cy.get("#expectation-0 #edit-expectation").fill("string");
    cy.get("#save-button").should("not.be.disabled");
    cy.get("#launch-button").should("not.be.disabled");
  });

  it("opens image thumbnail", () => {
    cy.visit("/lessons/edit?lessonId=new");
    cy.get("#image").fill(
      "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg"
    );
    cy.get("#image").should(
      "have.value",
      "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg"
    );
    cy.get("#image-thumbnail").should(
      "have.attr",
      "src",
      "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg"
    );
    // cy.get("#image-thumbnail").click();
  });

  it("launches lesson", () => {
    cy.visit("/lessons/edit?lessonId=q1");
    cy.get("#launch-button").click();
    cy.location("pathname").should("eq", "/tutor");
  });

  it("launch lesson disabled if new lesson", () => {
    cy.visit("/lessons/edit?lessonId=new");
    cy.get("#launch-button").should("be.disabled");
  });

  it("can expand and collapse an expectation", () => {
    cy.visit("/lessons/edit?lessonId=new");
    // expectation is expanded by default
    cy.get("#expectation-0 #edit-expectation");
    cy.get("#expectation-0 #hints");
    cy.get("#hint-0 #edit-hint");
    // collapsing an expectation hides hints
    cy.get("#expectation-0 #expand").click();
    cy.get("#expectation-0 #edit-expectation");
    cy.get("#expectation-0 #hints").should("not.exist");
    // expanding an expectation reveals hints
    cy.get("#expectation-0 #expand").click();
    cy.get("#expectation-0 #edit-expectation");
    cy.get("#expectation-0 #hints");
    cy.get("#hint-0 #edit-hint");
  });

  it("adds and deletes an expectation", () => {
    cy.visit("/lessons/edit?lessonId=new");
    // must have at least 1 expectation
    cy.get("#expectations").children().should("have.length", 1);
    cy.get("#expectation-0 #delete").should("not.exist");
    // add and delete
    cy.get("#add-expectation").click();
    cy.get("#expectations").children().should("have.length", 2);
    cy.get("#expectation-0 #delete").click();
    cy.get("#expectations").children().should("have.length", 1);
  });

  it("adds and deletes a hint", () => {
    cy.visit("/lessons/edit?lessonId=new");
    // must have at least 1 hint
    cy.get("#hints").children().should("have.length", 1);
    cy.get("#hint-0 #delete").should("not.exist");
    // add and delete
    cy.get("#add-hint").click();
    cy.get("#hints").children().should("have.length", 2);
    cy.get("#hint-0 #delete").click();
    cy.get("#hints").children().should("have.length", 1);
  });

  it("adds and deletes a conclusion", () => {
    cy.visit("/lessons/edit?lessonId=new");
    // must have at least 1 conclusion
    cy.get("#conclusions").children().should("have.length", 1);
    cy.get("#conclusion-0 #delete").should("not.exist");
    // add and delete
    cy.get("#add-conclusion").click();
    cy.get("#conclusions").children().should("have.length", 2);
    cy.get("#conclusion-0 #delete").click();
    cy.get("#conclusions").children().should("have.length", 1);
  });

  it("save button by default not visible", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#save-button").should("not.visible");
  });

  it("making an edit toggles save button visable", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").fill("{backspace}");
    cy.get("#save-button").should("be.visible");
  });

  it("makes an edit and clicks on save", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").fill("{backspace}");
    cy.get("#save-button").click();
    // TODO: there are no expectatons here, not a meaningful test
  });
});
