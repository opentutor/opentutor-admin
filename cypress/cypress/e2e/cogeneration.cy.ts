/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cySetup,
  cyMockDefault,
  cyMockModelStatus,
} from "../support/functions";

describe("cogeneration testbed screen", () => {
  describe("permissions", () => {
    it("cannot view cogeneration testbed page if not logged in", () => {
      cySetup(cy);
      cyMockModelStatus(cy);
      cy.visit("/cogeneration");
      cy.contains("Please login to view testbed.");
    });
    it("can view cogeneration testbed page if logged in", () => {
      cySetup(cy);
      cyMockModelStatus(cy);
      cyMockDefault(cy);
      cy.visit("/cogeneration");
      cy.get("[data-cy=generator-recipe]").click();

      cy.get('li[data-value="testRecipe"]')
        .should("exist")
        .should("contain.text", "Test Recipe");

      cy.get('li[data-value="multipleChoice"]')
        .should("exist")
        .should("contain.text", "MCQ Baseline");
      cy.get('li[data-value="multipleChoice"]').click();
      cy.get('li[data-value="multipleChoice"]').should("not.be.visible");
    });
  });
});
describe("new cogeneration", () => {
  it("cogenerates a question and corresponding distractors", () => {
    cySetup(cy);
    cyMockModelStatus(cy);
    cyMockDefault(cy);
    cy.visit("/cogeneration");
    cy.get("[data-cy=generator-recipe]").click();
    cy.get('li[data-value="multipleChoice"]').click();
    cy.get('li[data-value="multipleChoice"]').should("not.be.visible");

    cy.get("[data-cy=universal-context]").within(($input) => {
      cy.get("textarea").fill(
        "A large language model (LLM) is a language model notable for its ability to achieve general-purpose language understanding and generation. LLMs acquire these abilities by learning statistical relationships from text documents during a computationally intensive self-supervised and semi-supervised training process.[1] LLMs can be used for text generation, a form of generative AI, by taking an input text and repeatedly predicting the next token or word.[2]"
      );
    });

    cy.get("[data-cy=question-strategy]").click();
    cy.get('li[data-value="verification"]').click();
    cy.get('li[data-value="verification"]').should("not.be.visible");

    cy.get("[data-cy=generate-question-answer]").click();
    cy.get("[data-cy=radio-1]").click();

    cy.get("[data-cy=distractor-strategy]").click();
    cy.get('li[data-value="opposites"]').click();
    cy.get('li[data-value="opposites"]').should("not.be.visible");

    cy.get("[data-cy=generate-distractor]").click();
  });
});
