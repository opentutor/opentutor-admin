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
    delay: 10,
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
    delay: 10,
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

describe("edit screen", () => {
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
              },
            ],
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
  });

  it("loads edit page ", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
  });

  it("types into introduction edit and shows value", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#intro").fill("Hello World");
    cy.get("#intro").should("have", "Hello World");
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

  it("making an edit and clicks on save", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").fill("{backspace}");
    cy.get("#save-button").click();
    // TODO: there are no expectatons here, not a meaningful test
  });

  [
    {
      pendingCount: 1,
      progressCount: 1,
      info: {
        expectations: [{ accuracy: 0.17 }],
      },
      expectedAccuracy: 0.17,
      expectedFeedback: "red",
    },
    {
      pendingCount: 1,
      progressCount: 1,
      info: {
        expectations: [{ accuracy: 0.41 }],
      },
      expectedAccuracy: 0.41,
      expectedFeedback: "yellow",
    },
    {
      pendingCount: 1,
      progressCount: 1,
      info: {
        expectations: [{ accuracy: 0.61 }],
      },
      expectedAccuracy: 0.61,
      expectedFeedback: "green",
    },
  ].forEach((ex) => {
    it(`train lesson displays ${ex.expectedFeedback} feedback on success with accuracy ${ex.expectedAccuracy}`, () => {
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
      cy.get("#train-button").click();
      waitTrainLesson();
      waitComplete();
      cy.get("#train-success-accuracy").should("contain", ex.expectedAccuracy);
      cy.matchImageSnapshot(
        snapname(
          `train-success-with-accuracy-${ex.expectedAccuracy}-and-feedback-${ex.expectedFeedback}`
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
    cy.get("#train-button").click();
    waitTrainLesson();
    waitComplete();
    cy.get("#train-failure").should("contain", "TRAINING FAILED");
  });

  it("train lesson fails for http error on start", () => {
    cy.visit("/lessons/edit?lessonId=lesson&trainStatusPollInterval=10");
    const waitTrainLesson = mockTrainLesson(cy, { responseStatus: 500 });
    cy.get("#train-button").click();
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
    cy.get("#train-button").click();
    waitTrainLesson();
    waitComplete();
    cy.get("#train-failure").should("contain", "TRAINING FAILED");
  });
});
