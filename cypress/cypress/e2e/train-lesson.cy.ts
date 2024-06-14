/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { TrainState } from "../support/dtos";
import {
  cySetup,
  cyMockDefault,
  mockGQL,
  cyMockTrain,
  cyMockTrainStatusSeq,
  cyMockModelStatus,
} from "../support/functions";

function snapname(n) {
  return `lesson-page-${n}`;
}

const lesson = {
  lessonId: "lesson",
  name: "lesson",
  introduction: "introduction",
  question: "question",
  conclusion: ["conclusion"],
  media: null,
  learningFormat: null,
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
  isTrainable: true,
  lastTrainedAt: "",
};

describe("lesson screen - training", () => {
  [
    {
      pendingCount: 1,
      progressCount: 1,
      info: {
        expectations: [
          { accuracy: 0.1732423 },
          { accuracy: 0.976524 },
          { accuracy: 0.994324 },
        ],
      },
      expectedAccuracies: [0.17, 0.98, 0.99],
      expectedFeedback: "red",
    },
    {
      pendingCount: 1,
      progressCount: 1,
      info: {
        expectations: [{ accuracy: 0.95123 }, { accuracy: 0.41123 }],
      },
      expectedAccuracies: [0.95, 0.41],
      expectedFeedback: "yellow",
    },
    {
      pendingCount: 1,
      progressCount: 1,
      info: {
        expectations: [{ accuracy: 0.61123 }, { accuracy: 0.99123 }],
      },
      expectedAccuracies: [0.61, 0.99],
      expectedFeedback: "green",
    },
  ].forEach((ex) => {
    it(`train lesson displays ${
      ex.expectedFeedback
    } feedback on success when expectation accuracies ${JSON.stringify(
      ex.expectedAccuracies
    )}`, () => {
      cySetup(cy);
      cyMockModelStatus(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("FetchLesson", { me: { lesson } })],
        userRole: "admin",
      });
      const waitTrainLesson = cyMockTrain(cy);
      const waitComplete = cyMockTrainStatusSeq(cy, [
        { status: { state: TrainState.PENDING }, repeat: ex.pendingCount },
        { status: { state: TrainState.STARTED }, repeat: ex.progressCount },
        {
          status: {
            state: TrainState.SUCCESS,
            info: ex.info,
          },
        },
      ]);
      cy.visit("/lessons/edit?lessonId=lesson&trainStatusPollInterval=10");
      cy.get("[data-cy=train-button]").trigger("mouseover").click();
      waitTrainLesson();
      waitComplete();
      for (let i = 0; i < ex.expectedAccuracies.length; i++) {
        cy.get(`[data-cy=train-success-accuracy-${i}]`).should(
          "contain",
          ex.expectedAccuracies[i]
        );
      }
      cy.wait(1000);
      cy.get("[data-cy=train-data]").matchImageSnapshot(
        snapname(
          `train-success-displays-${
            ex.expectedFeedback
          }-for-expectation-accuracies-${ex.expectedAccuracies.join("-")}`
        )
      );
    });
  });

  it("train lesson fails for state FAILURE", () => {
    cySetup(cy);
    cyMockModelStatus(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchLesson", { me: { lesson } })],
      userRole: "admin",
    });
    cy.visit("/lessons/edit?lessonId=lesson&trainStatusPollInterval=10");
    const waitTrainLesson = cyMockTrain(cy);
    const waitComplete = cyMockTrainStatusSeq(cy, [
      { status: { state: TrainState.PENDING } },
      { status: { state: TrainState.STARTED } },
      {
        status: {
          state: TrainState.FAILURE,
        },
      },
    ]);
    cy.get("[data-cy=train-button]").trigger("mouseover").click();
    waitTrainLesson();
    waitComplete();
    cy.get("[data-cy=train-failure]").should("contain", "Training Failed");
  });

  it("train lesson fails for http error on start", () => {
    cySetup(cy);
    cyMockModelStatus(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchLesson", { me: { lesson } })],
      userRole: "admin",
    });
    cy.visit("/lessons/edit?lessonId=lesson&trainStatusPollInterval=10");
    const waitTrainLesson = cyMockTrain(cy, { responseStatus: 500 });
    cy.get("[data-cy=train-button]").trigger("mouseover").click();
    waitTrainLesson();
    cy.get("[data-cy=train-failure]").should("contain", "Training Failed");
  });

  it("train lesson fails for http error on poll status", () => {
    cySetup(cy);
    cyMockModelStatus(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchLesson", { me: { lesson } })],
      userRole: "admin",
    });
    cy.visit("/lessons/edit?lessonId=lesson&trainStatusPollInterval=10");
    const waitTrainLesson = cyMockTrain(cy);
    const waitComplete = cyMockTrainStatusSeq(cy, [
      { status: { state: TrainState.PENDING } },
      { status: { state: TrainState.STARTED } },
      {
        status: {
          state: TrainState.FAILURE,
        },
        responseStatusCode: 500,
      },
    ]);
    cy.get("[data-cy=train-button]").trigger("mouseover").click();
    waitTrainLesson();
    waitComplete();
    cy.get("[data-cy=train-failure]").should("contain", "Training Failed");
  });
});
