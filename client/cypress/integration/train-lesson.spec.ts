/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { TrainStatus, TrainState } from "../support/dtos";

const TRAIN_STATUS_URL = `/classifier/train/status/some-job-id`;

function snapname(n) {
  return `lesson-page-${n}`;
}

interface WaitFunc {
  (): void;
}

function mockTrainLesson(
  cy: Cypress.cy,
  params: {
    statusUrl?: string;
    responseStatus?: number;
  } = {}
): WaitFunc {
  params = params || {};
  cy.route({
    method: "POST",
    url: "**/train",
    status: params.responseStatus || 200,
    response: {
      data: {
        statusUrl: params.statusUrl || TRAIN_STATUS_URL,
      },
      errors: null,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).as("trainLesson");
  return () => cy.wait("@trainLesson");
}

interface StatusResponse {
  status: TrainStatus;
  repeat?: number;
  responseStatusCode?: number;
}

function mockTrainStatus(
  cy: Cypress.cy,
  params: {
    status?: TrainStatus;
    seq?: number;
    statusUrl?: string;
    responseStatusCode?: number;
  } = {}
): string {
  params = params || {};
  const alias = params.status
    ? `trainStatus${params.status.state}${params.seq}`
    : "";
  cy.route({
    method: "GET",
    url: `**/${params.statusUrl || TRAIN_STATUS_URL}`,
    status: params.responseStatusCode || 200,
    response: {
      data: params.status,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).as(alias);
  return `@${alias}`;
}

function mockTrainStatusSeq(
  cy: Cypress.cy,
  responses: StatusResponse[],
  statusUrl = TRAIN_STATUS_URL
): WaitFunc {
  let responseIndex = 0;
  let seq = 0;
  let curAlias = mockTrainStatus(cy, {
    status: responses[0].status,
    seq: ++seq,
  });
  return () => {
    cy.wait(curAlias);
    for (let i = responseIndex; i < responses.length; i++) {
      const repeatCount = !isNaN(Number(responses[i].repeat))
        ? Number(responses[i].repeat)
        : 1;
      for (let j = 0; j < repeatCount; j++) {
        cy.wait(
          mockTrainStatus(cy, {
            status: responses[i].status,
            seq: ++seq,
            statusUrl: statusUrl,
            responseStatusCode: !isNaN(Number(responses[i].responseStatusCode))
              ? Number(responses[i].responseStatusCode)
              : 200,
          })
        );
      }
    }
  };
}

describe("lesson screen - training", () => {
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
            isTrainable: true,
            lastTrainedAt: "",
          },
        },
        errors: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

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
      const waitTrainLesson = mockTrainLesson(cy);
      const waitComplete = mockTrainStatusSeq(cy, [
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
      cy.wait(500);
      cy.get("#train-button").trigger("mouseover").click();
      waitTrainLesson();
      waitComplete();
      for (let i = 0; i < ex.expectedAccuracies.length; i++) {
        cy.get(`#train-success-accuracy-${i}`).should(
          "contain",
          ex.expectedAccuracies[i]
        );
      }
      cy.get("#train-data").matchImageSnapshot(
        snapname(
          `train-success-displays-${
            ex.expectedFeedback
          }-for-expectation-accuracies-${ex.expectedAccuracies.join("-")}`
        )
      );
    });
  });

  it("train lesson fails for state FAILURE", () => {
    cy.visit("/lessons/edit?lessonId=lesson&trainStatusPollInterval=10");
    const waitTrainLesson = mockTrainLesson(cy);
    const waitComplete = mockTrainStatusSeq(cy, [
      { status: { state: TrainState.PENDING } },
      { status: { state: TrainState.STARTED } },
      {
        status: {
          state: TrainState.FAILURE,
        },
      },
    ]);
    cy.wait(500);
    cy.get("#train-button").trigger("mouseover").click();
    waitTrainLesson();
    waitComplete();
    cy.get("#train-failure").should("contain", "TRAINING FAILED");
  });

  it("train lesson fails for http error on start", () => {
    cy.visit("/lessons/edit?lessonId=lesson&trainStatusPollInterval=10");
    const waitTrainLesson = mockTrainLesson(cy, { responseStatus: 500 });
    cy.wait(500);
    cy.get("#train-button").trigger("mouseover").click();
    waitTrainLesson();
    cy.get("#train-failure").should("contain", "TRAINING FAILED");
  });

  it("train lesson fails for http error on poll status", () => {
    cy.visit("/lessons/edit?lessonId=lesson&trainStatusPollInterval=10");
    const waitTrainLesson = mockTrainLesson(cy);
    const waitComplete = mockTrainStatusSeq(cy, [
      { status: { state: TrainState.PENDING } },
      { status: { state: TrainState.STARTED } },
      {
        status: {
          state: TrainState.FAILURE,
        },
        responseStatusCode: 500,
      },
    ]);
    cy.wait(500);
    cy.get("#train-button").trigger("mouseover").click();
    waitTrainLesson();
    waitComplete();
    cy.get("#train-failure").should("contain", "TRAINING FAILED");
  });
});
