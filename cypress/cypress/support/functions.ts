/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { TrainStatus } from "./dtos";

interface MockGraphQLQuery {
  query: string;
  data: any | any[];
}

interface StaticResponse {
  /**
   * Serve a fixture as the response body.
   */
  fixture?: string;
  /**
   * Serve a static string/JSON object as the response body.
   */
  body?: string | object | object[];
  /**
   * HTTP headers to accompany the response.
   * @default {}
   */
  headers?: { [key: string]: string };
  /**
   * The HTTP status code to send.
   * @default 200
   */
  statusCode?: number;
  /**
   * If 'forceNetworkError' is truthy, Cypress will destroy the browser connection
   * and send no response. Useful for simulating a server that is not reachable.
   * Must not be set in combination with other options.
   */
  forceNetworkError?: boolean;
  /**
   * Milliseconds to delay before the response is sent.
   */
  delayMs?: number;
  /**
   * Kilobits per second to send 'body'.
   */
  throttleKbps?: number;
}

export function staticResponse(s: StaticResponse): StaticResponse {
  return {
    ...{
      headers: {
        "access-control-allow-origin": window.location.origin,
        "Access-Control-Allow-Credentials": "true",
      },
      ...s,
    },
  };
}

export function cySetup(cy) {
  cy.server();
  cy.viewport(1920, 1080);
}

export interface AppConfig {
  googleClientId: string;
}

export const CONFIG_DEFAULT: AppConfig = {
  googleClientId: "fake-google-client-id",
};

export function mockGQLConfig(appConfig: Partial<AppConfig>): MockGraphQLQuery {
  return mockGQL("FetchConfig", {
    appConfig: { ...CONFIG_DEFAULT, ...(appConfig || {}) },
  });
}

export function cyInterceptGraphQL(cy, mocks: MockGraphQLQuery[]): void {
  const queryCalls: any = {};
  for (const mock of mocks) {
    queryCalls[mock.query] = 0;
  }
  cy.intercept("/graphql", (req) => {
    const { body } = req;
    const queryBody = body.query.replace(/\s+/g, " ").replace("\n", "").trim();
    let handled = false;
    for (const mock of mocks) {
      if (
        queryBody.match(new RegExp(`^(mutation|query) ${mock.query}[{(\\s]`)) ||
        queryBody.indexOf(`{ ${mock.query}(`) !== -1 ||
        queryBody.indexOf(`{ ${mock.query} {`) !== -1
      ) {
        const data = Array.isArray(mock.data) ? mock.data : [mock.data];
        const bodyContent =
          data[Math.min(queryCalls[mock.query], data.length - 1)];
        let body = bodyContent;
        req.alias = mock.query;
        req.reply(
          staticResponse({
            body: {
              data: body,
              errors: null,
            },
          })
        );
        queryCalls[mock.query] += 1;
        handled = true;
        break;
      }
    }
    if (!handled) {
      console.error(`failed to handle query for...`);
      console.error(req);
    }
  });
}

export function mockGQL(query: string, data: any | any[]): MockGraphQLQuery {
  return {
    query,
    data,
  };
}

export function cyMockLogin(cy): void {
  cy.setCookie("accessToken", "accessToken");
}

export function cyMockDefault(
  cy,
  args: {
    appConfig?: Partial<AppConfig>;
    gqlQueries?: MockGraphQLQuery[];
    noLogin?: boolean;
    userRole?: string;
  } = {}
) {
  const appConfig = args?.appConfig || {};
  const gqlQueries = args?.gqlQueries || [];
  if (!args.noLogin) {
    cy.setCookie("accessToken", "accessToken");
  }
  cyInterceptGraphQL(cy, [
    mockGQLConfig(appConfig),
    mockGQL("Login", {
      login: {
        user: {
          id: "kayla",
          name: "Kayla",
          email: "kayla@opentutor.com",
          userRole: args.userRole || "author",
        },
        accessToken: "accessToken",
      },
    }),
    ...gqlQueries,
  ]);
}

const TRAIN_STATUS_URL = `/classifier/train/status/some-job-id`;
interface WaitFunc {
  (): void;
}
interface StatusResponse {
  status: TrainStatus;
  repeat?: number;
  responseStatusCode?: number;
}

export function cyMockTrain(
  cy: Cypress.cy,
  params: {
    statusUrl?: string;
    responseStatus?: number;
  } = {}
): WaitFunc {
  params = params || {};
  cy.intercept("POST", "**/train", {
    statusCode: params.responseStatus || 200,
    body: {
      data: {
        statusUrl: params.statusUrl || TRAIN_STATUS_URL,
      },
      errors: null,
    },
  }).as("train");
  return () => cy.wait("@train");
}

export function cyMockTrainDefault(
  cy: Cypress.cy,
  params: {
    statusUrl?: string;
    responseStatus?: number;
  } = {}
): WaitFunc {
  params = params || {};
  cy.intercept("POST", "**/train_default", {
    statusCode: params.responseStatus || 200,
    body: {
      data: {
        statusUrl: params.statusUrl || TRAIN_STATUS_URL,
      },
      errors: null,
    },
  }).as("train");
  return () => cy.wait("@train");
}

export function cyMockTrainStatusSeq(
  cy: Cypress.cy,
  responses: StatusResponse[],
  statusUrl = TRAIN_STATUS_URL
): WaitFunc {
  /**
   * What is this crazy complicated test setup?
   *
   * The model-training sequence is that the admin client
   * triggers a training job, and then polls a status url
   * until that training job completes with SUCCESS or FAILURE.
   *
   * Until the training job is done, the status url
   * will be returning other statuses,
   * like PENDING or IN_PROGRESS.
   *
   * So the purpose of this function
   * is to set up the training-status url
   * to mock a series of responses,
   * e.g. PENDING, IN_PROGRESS, IN_PROGESS, SUCCESS
   */
  let responseIndex = 0;
  let repeatCount = 0;
  let totalResponses = 0;
  const alias = "polling";
  cy.intercept("GET", `**/${statusUrl || TRAIN_STATUS_URL}`, (req) => {
    const nextResponse = responses[responseIndex];
    req.reply({
      statusCode: nextResponse.responseStatusCode || 200,
      body: {
        data: nextResponse.status,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    totalResponses++;
    const responseRepeatCount = !isNaN(Number(nextResponse.repeat))
      ? Number(nextResponse.repeat)
      : 1;
    repeatCount++;
    if (
      repeatCount >= responseRepeatCount &&
      responseIndex + 1 < responses.length
    ) {
      responseIndex++;
      repeatCount = 0;
    }
  }).as(alias);
  return () => {
    for (let i = 0; i < totalResponses; i++) {
      cy.wait(alias);
    }
  };
}
