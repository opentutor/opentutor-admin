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
  LoginGoogle,
  Login,
  UserAccessToken,
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
  sortAscending: boolean,
  accessToken: string
): Promise<Connection<Session>> {
  const result = await axios.post<GQLResponse<FetchSessions>>(
    GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
      query: `
        query {
          me {
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
                    userPermissions {
                      view
                      edit
                    }
                  }
                  lessonCreatedBy
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
        }
      `,
    }
  );
  // TODO: must handle errors including in tests
  return result.data.data!.me.sessions;
}

export async function fetchSession(
  sessionId: string,
  accessToken: string
): Promise<Session> {
  const result = await axios.post<GQLResponse<FetchSession>>(GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
    query: `
      query {
        me {
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
              createdBy
              userPermissions {
                view
                edit
              }
            }
          }
        }
      }
    `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.me.session;
}

export async function setGrade(
  sessionId: string,
  userAnswerIndex: number,
  userExpectationIndex: number,
  grade: string,
  accessToken: string
): Promise<Session> {
  const result = await axios.post<GQLResponse<SetGrade>>(GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
    query: `
      mutation {
        me {
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
              createdBy
              userPermissions {
                view
                edit
              }
            }
          }
        }
      }
    `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.me.setGrade;
}

export async function fetchLessons(
  filter: any,
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean,
  accessToken: string
): Promise<Connection<Lesson>> {
  const result = await axios.post<GQLResponse<FetchLessons>>(GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
    query: `
      query {
        me {
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
                createdByName
                userPermissions {
                  view
                  edit
                }
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
      }
    `,
  });

  // TODO: must handle errors including in tests
  return result.data.data!.me.lessons;
}

export async function fetchLesson(
  lessonId: string,
  accessToken: string
): Promise<Lesson> {
  const result = await axios.post<GQLResponse<FetchLesson>>(GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
    query: `
      query {
        me {
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
            createdByName
            userPermissions {
              view
              edit
            }
          }
        }
      }
    `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.me.lesson;
}

export async function updateLesson(
  lessonId: string,
  lesson: string,
  accessToken: string
): Promise<Lesson> {
  const result = await axios.post<GQLResponse<UpdateLesson>>(GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
    query: `
      mutation {
        me {
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
            createdByName
            userPermissions {
              view
              edit
            }
          }
        }
      }
    `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.me.updateLesson;
}

export async function deleteLesson(
  lessonId: string,
  accessToken: string
): Promise<Lesson> {
  const result = await axios.post<GQLResponse<DeleteLesson>>(GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
    query: `
      mutation {
        me {
          deleteLesson(lessonId: "${lessonId}"){
            deleted
          }  
        }
      }
    `,
  });
  // TODO: must handle errors including in tests
  return result.data.data!.me.deleteLesson;
}

export async function deleteSession(
  sessionId: string,
  accessToken: string
): Promise<Session> {
  const result = await axios.post<GQLResponse<DeleteSession>>(
    GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
      query: `
        mutation {
          me {
            deleteSession(sessionId: "${sessionId}"){
              deleted
            }  
          }
        }
      `,
    }
  );
  // TODO: must handle errors including in tests
  return result.data.data!.me.deleteSession;
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

export async function login(accessToken: string): Promise<UserAccessToken> {
  const result = await axios.post<GQLResponse<Login>>(GRAPHQL_ENDPOINT, {
    query: `
      mutation {
        login(accessToken: "${accessToken}") {
          user {
            id
            name  
          }
          accessToken
        }
      }
    `,
  });
  return result.data.data!.login;
}

export async function loginGoogle(
  accessToken: string
): Promise<UserAccessToken> {
  const result = await axios.post<GQLResponse<LoginGoogle>>(GRAPHQL_ENDPOINT, {
    query: `
      mutation {
        loginGoogle(accessToken: "${accessToken}") {
          user {
            id
            name  
          }
          accessToken
        }
      }
    `,
  });
  return result.data.data!.loginGoogle;
}
