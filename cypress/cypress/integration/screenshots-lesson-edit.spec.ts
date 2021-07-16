/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup, cyMockDefault, mockGQL } from "../support/functions";

function snapname(n) {
  return `screenshots-lesson-edit-${n}`;
}

describe("screenshots - lesson edit", () => {
  it("displays lesson form on load", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLesson", {
          me: {
            lesson: {
              lessonId: "lesson",
              name: "lesson",
              intro: "intro",
              question: "question",
              conclusion: ["conclusion"],
              expectations: [
                {
                  expectation: "expectation 1",
                  hints: [
                    {
                      text: "hint 1.1",
                    },
                  ],
                  features: {},
                },
              ],
              features: {},
              lastTrainedAt: "",
              isTrainable: true,
            },
          },
        }),
      ],
      userRole: "admin",
    });
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("[data-cy=lesson-edit-grid]", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.matchImageSnapshot(snapname("displays-lesson-form-on-load"));
  });

  it("displays save button enabled after edits", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLesson", {
          me: {
            lesson: {
              lessonId: "lesson",
              name: "lesson",
              question: "question",
              intro: "intro",
              conclusion: ["conclusion"],
              expectations: [
                {
                  expectation: "expectation 1",
                  hints: [
                    {
                      text: "hint 1.1",
                    },
                  ],
                },
              ],
              lastTrainedAt: "",
              isTrainable: true,
            },
          },
        }),
      ],
      userRole: "admin",
    });
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("[data-cy=intro]").within(($input) => {
      cy.get("textarea").fill("Hello World");
    });
    cy.matchImageSnapshot(snapname("displays-save-button-enabled-after-edits"));
  });
});
