/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios from "axios";
import {
  DeleteLesson,
  DeleteSession,
  FetchSessions,
  FetchSession,
  Session,
  SetGrade,
  Lesson,
  FetchLessons,
  FetchLesson,
  UpdateLesson,
  TrainJob,
  TrainStatus,
  Connection,
} from "types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const urljoin = require("url-join");

export const CLASSIFIER_ENTRYPOINT =
  process.env.CLASSIFIER_ENTRYPOINT || "/classifier";
export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "/graphql";

interface GQLResponse<T> {
  errors?: { message: string }[];
  data?: T;
}

export async function fetchSessions(
  filter: any,
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean
): Promise<Connection<Session>> {
  const result = await axios.post<GQLResponse<FetchSessions>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
        query {
          sessions(
            filter:"${encodeURI(JSON.stringify(filter))}"
            limit:${limit},
            cursor:"${cursor}",
            sortBy:"${sortBy}",
            sortAscending:${sortAscending}
          ) {
            edges {
              cursor 
              node {
                username
                sessionId
                classifierGrade
                graderGrade
                createdAt
                lesson {
                  name
                  lessonId
                  createdBy
                }
              }
            }
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
              hasNextPage
            }
          }
        }
      `,
    }
  );
  // TODO: must handle errors including in tests
  return result.data.data!.sessions;
}

export async function fetchSession(sessionId: string): Promise<Session> {
  const result = await axios.post<GQLResponse<FetchSession>>(GRAPHQL_ENDPOINT, {
    query: `
        query {
          session(sessionId: "${sessionId}") {
            username
            graderGrade
            createdAt
            question {
              text
              expectations {
                text
              }
            }
            userResponses {
              text
              expectationScores {
                classifierGrade
                graderGrade
              }
            }
            lesson {
              name
              lessonId
            }
          }
        }
      `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.session;
}

export async function setGrade(
  sessionId: string,
  userAnswerIndex: number,
  userExpectationIndex: number,
  grade: string
): Promise<Session> {
  const result = await axios.post<GQLResponse<SetGrade>>(GRAPHQL_ENDPOINT, {
    query: `
        mutation {
          setGrade(
            sessionId: "${sessionId}",
            userAnswerIndex:${userAnswerIndex},
            userExpectationIndex:${userExpectationIndex}
            grade:"${grade}"
          ) {
            username
            graderGrade
            createdAt
            question {
              text
              expectations {
                text
              }
            }
            userResponses {
              text
              expectationScores {
                classifierGrade
                graderGrade
              }
            }
            lesson {
              name
              lessonId
            }
          }
        }
      `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.setGrade;
}

export async function fetchLessons(
  filter: any,
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean
): Promise<Connection<Lesson>> {
  const result = await axios.post<GQLResponse<FetchLessons>>(GRAPHQL_ENDPOINT, {
    query: `
        query {
          lessons(
            filter:"${encodeURI(JSON.stringify(filter))}"
            limit:${limit},
            cursor:"${cursor}",
            sortBy:"${sortBy}",
            sortAscending:${sortAscending}
          ) {
            edges {
              cursor
              node {
                lessonId
                name
                createdBy
                updatedAt
              }
            }
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
              hasNextPage
            }
          }
        }
      `,
  });

  // TODO: must handle errors including in tests
  return result.data.data!.lessons;
}

export async function fetchLesson(lessonId: string): Promise<Lesson> {
  const result = await axios.post<GQLResponse<FetchLesson>>(GRAPHQL_ENDPOINT, {
    query: `
        query {
          lesson(lessonId: "${lessonId}") {
            lessonId
            intro
            name
            question
            image
            conclusion
            expectations {
              expectation
              features
              hints {
                text
              }
            }
            features
            lastTrainedAt
            isTrainable
            createdBy
          }
        }
      `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.lesson;
}

export async function updateLesson(
  lessonId: string,
  lesson: string
): Promise<Lesson> {
  const result = await axios.post<GQLResponse<UpdateLesson>>(GRAPHQL_ENDPOINT, {
    query: `
        mutation {
          updateLesson(lessonId: "${lessonId}", lesson: "${lesson}"){
            lessonId
            intro
            name
            question
            image
            conclusion
            expectations {
              expectation
              features
              hints {
                text
              }
            }
            features
            lastTrainedAt
            isTrainable
            createdBy
          }
        }
      `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.updateLesson;
}

export async function deleteLesson(lessonId: string): Promise<Lesson> {
  const result = await axios.post<GQLResponse<DeleteLesson>>(GRAPHQL_ENDPOINT, {
    query: `
        mutation {
          deleteLesson(lessonId: "${lessonId}"){
            deleted
          }
        }
      `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.deleteLesson;
}

export async function deleteSession(sessionId: string): Promise<Session> {
  const result = await axios.post<GQLResponse<DeleteSession>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
        mutation {
          deleteSession(sessionId: "${sessionId}"){
            deleted
          }
        }
      `,
    }
  );
  // TODO: must handle errors including in tests
  return result.data.data!.deleteSession;
}

export async function trainLesson(lessonId: string): Promise<TrainJob> {
  const res = await axios.post<GQLResponse<TrainJob>>(
    urljoin(CLASSIFIER_ENTRYPOINT, "train"),
    {
      lesson: lessonId,
    }
  );
  return res.data.data!;
}

export async function fetchTrainingStatus(
  statusUrl: string
): Promise<TrainStatus> {
  const result = await axios.get<GQLResponse<TrainStatus>>(statusUrl);
  return result.data.data!;
}
