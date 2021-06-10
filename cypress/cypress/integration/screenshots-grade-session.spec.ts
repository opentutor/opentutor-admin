/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup, cyMockDefault, mockGQL } from "../support/functions";

function snapname(n) {
  return `screenshots-grade-session-${n}`;
}

describe("screenshots - grade session", () => {
  it("displays feedback after answer marked good", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL(
          "session",
          {
            sessionId: "session1",
            lesson: {
              name: "lesson 1",
              createdByName: "username1",
            },
            graderGrade: null,
            question: {
              text: "question?",
              expectations: [
                { text: "expected text 1" },
                { text: "expected text 2" },
              ],
            },
            userResponses: [
              {
                text: "answer 1",
                expectationScores: [
                  {
                    classifierGrade: "Good",
                    graderGrade: "Good",
                  },
                  {
                    classifierGrade: "Bad",
                    graderGrade: "",
                  },
                ],
              },
              {
                text: "answer 2",
                expectationScores: [
                  {
                    classifierGrade: "Bad",
                    graderGrade: "",
                  },
                  {
                    classifierGrade: "Good",
                    graderGrade: "",
                  },
                ],
              },
              {
                text: "answer 3",
                expectationScores: [
                  {
                    classifierGrade: "Bad",
                    graderGrade: "",
                  },
                  {
                    classifierGrade: "Bad",
                    graderGrade: "Bad",
                  },
                ],
              },
              {
                text: "answer 4",
                expectationScores: [
                  {
                    classifierGrade: "Good",
                    graderGrade: "Good",
                  },
                  {
                    classifierGrade: "Bad",
                    graderGrade: "Bad",
                  },
                ],
              },
            ],
          },
          true
        ),
      ],
    });
    cy.visit("/sessions/session?sessionId=session1");
    cy.matchImageSnapshot(
      snapname("displays-feedback-after-answer-marked-good")
    );
  });
});
