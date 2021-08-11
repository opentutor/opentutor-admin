/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios, { AxiosResponse } from "axios";
import { AppConfig } from "config";
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
  FetchUsers,
  UpdateUserPermissions,
  LoginGoogle,
  Login,
  UserAccessToken,
  User,
  UserRole,
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

function findOrThrow<T>(res: AxiosResponse<GQLResponse<T>>): T {
  if (!res.data.data) {
    throw new Error(`invalid result body: ${JSON.stringify(res.data)}`);
  }
  return res.data.data;
}

export async function fetchAppConfig(): Promise<AppConfig> {
  const gqlRes = await axios.post<GQLResponse<{ appConfig: AppConfig }>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      query FetchConfig {
        appConfig {
          googleClientId
        }
      }
    `,
    }
  );
  if (gqlRes.status !== 200) {
    throw new Error(`appConfig load failed: ${gqlRes.statusText}}`);
  }
  if (gqlRes.data.errors) {
    throw new Error(
      `errors reponse to appConfig query: ${JSON.stringify(gqlRes.data.errors)}`
    );
  }
  if (!gqlRes.data.data) {
    throw new Error(
      `no data in non-error reponse: ${JSON.stringify(gqlRes.data)}`
    );
  }
  return gqlRes.data.data.appConfig;
}

export async function fetchSessions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  filter: any,
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean,
  accessToken: string
): Promise<Connection<Session>> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<FetchSessions>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      query FetchSessions($filter: String!, $limit: Int!, $cursor: String!, $sortBy: String!, $sortAscending: Boolean!) {
        me {
          sessions(
            filter: $filter,
            limit: $limit,
            cursor: $cursor,
            sortBy: $sortBy,
            sortAscending: $sortAscending
          ) {
            edges {
              cursor
              node {
                userResponses {
                  expectationScores {
                    classifierGrade
                  }
                }
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
                lessonCreatedBy
                lastGradedByName
                lastGradedAt
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
      variables: {
        filter: JSON.stringify(filter),
        limit,
        cursor,
        sortBy,
        sortAscending,
      },
    },
    { headers: headers }
  );
  return findOrThrow<FetchSessions>(result).me.sessions;
}

interface FetchSessionsData {
  me: {
    sessions: Connection<Session>;
    lesson: Lesson;
  };
}
interface SessionsData {
  sessions: Connection<Session>;
  lesson: Lesson;
}
export async function fetchSessionsData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  filter: any,
  limit: number,
  accessToken: string,
  lessonId: string
): Promise<SessionsData> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<FetchSessionsData>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      query FetchSessions($filter: String!, $limit: Int!, $lessonId: String!) {
        me {
          sessions(
            filter: $filter,
            limit: $limit,
          ) {
            edges {
              node {
                sessionId
                createdAt
                username
                userResponses {
                  _id
                  text
                  expectationScores {
                    invalidated
                    graderGrade
                    classifierGrade
                  }
                }
              }
            }
          }
          lesson(lessonId: $lessonId) {
            expectations {
              expectation
            }
          }
        }
      }
      `,
      variables: {
        filter: JSON.stringify(filter),
        limit,
        lessonId,
      },
    },
    { headers: headers }
  );
  return findOrThrow<FetchSessionsData>(result).me;
}
export interface InvalidateResponseInput {
  sessionId: string;
  responseIds: string[];
}
interface InvalidateResponses {
  me: {
    invalidateResponses: Session[];
  };
}
export async function invalidateResponses(
  expectation: number,
  invalid: boolean,
  responses: InvalidateResponseInput[],
  accessToken: string
): Promise<Session[]> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<InvalidateResponses>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
        mutation InvalidateResponse($expIndex: Int!, $invalid: Boolean!, $invalidateResponses: [InvalidateResponseInputType!]) {
          me {
            invalidateResponses(expectation: $expIndex, invalid: $invalid, invalidateResponses: $invalidateResponses) { 
              sessionId
              createdAt
              username
              userResponses {
                _id
                text
                expectationScores {
                  invalidated
                  graderGrade
                  classifierGrade
                }
              }
            }
          }
        }
      `,
      variables: {
        expIndex: parseInt(expectation.toString()),
        invalid,
        invalidateResponses: responses,
      },
    },
    { headers: headers }
  );
  return findOrThrow<InvalidateResponses>(result).me.invalidateResponses;
}

export async function fetchSession(
  sessionId: string,
  accessToken: string
): Promise<Session> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<FetchSession>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      query FetchSession($sessionId: String!) {
        me {
          session(sessionId: $sessionId) {
            username
            graderGrade
            createdAt
            question {
              text
              expectations {
                expectationId
                text
              }
            }
            userResponses {
              text
              expectationScores {
                expectationId
                classifierGrade
                graderGrade
              }
            }
            lesson {
              name
              lessonId
              createdBy
            }
          }
        }
      }
    `,
      variables: { sessionId },
    },
    { headers: headers }
  );
  return findOrThrow<FetchSession>(result).me.session;
}

export async function setGrade(
  sessionId: string,
  userAnswerIndex: number,
  userExpectationIndex: number,
  grade: string,
  accessToken: string
): Promise<Session> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<SetGrade>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      mutation SetGrade($sessionId: String!, $userAnswerIndex: Int!, $userExpectationIndex: Int!, $grade: String!){
        me {
          setGrade(
            sessionId: $sessionId,
            userAnswerIndex: $userAnswerIndex,
            userExpectationIndex: $userExpectationIndex
            grade: $grade
          ) {
            username
            graderGrade
            createdAt
            question {
              text
              expectations {
                expectationId
                text
              }
            }
            userResponses {
              text
              expectationScores {
                expectationId
                classifierGrade
                graderGrade
              }
            }
            lesson {
              name
              lessonId
              createdBy
            }
          }
        }
      }
    `,
      variables: { sessionId, userAnswerIndex, userExpectationIndex, grade },
    },
    { headers: headers }
  );
  return findOrThrow<SetGrade>(result).me.setGrade;
}

export async function fetchLessons(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  filter: any,
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean,
  accessToken: string
): Promise<Connection<Lesson>> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<FetchLessons>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      query FetchLessons(
        $filter: String!
        $limit: Int!,
        $cursor: String!,
        $sortBy: String!,
        $sortAscending: Boolean!
      ){
        me {
          lessons(
            filter: $filter,
            limit: $limit,
            cursor: $cursor,
            sortBy: $sortBy,
            sortAscending: $sortAscending
          ) {
            edges {
              cursor
              node {
                lessonId
                name
                createdBy
                createdByName
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
      variables: {
        filter: JSON.stringify(filter),
        limit: limit,
        cursor: cursor,
        sortBy: sortBy,
        sortAscending: sortAscending,
      },
    },
    { headers: headers }
  );
  return findOrThrow<FetchLessons>(result).me.lessons;
}

export async function fetchLesson(
  lessonId: string,
  accessToken: string
): Promise<Lesson> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<FetchLesson>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      query FetchLesson($lessonId: String!){
        me {
          lesson(lessonId: $lessonId) {
            lessonId
            intro
            dialogCategory
            name
            question
            media {
              url
              type
              props {
                name
                value
              }
            }
            learningFormat
            conclusion
            expectations {
              expectationId
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
          }
        }
      }
    `,
      variables: { lessonId },
    },
    { headers: headers }
  );
  return findOrThrow<FetchLesson>(result).me.lesson;
}

export async function updateLesson(
  lessonId: string,
  lesson: Lesson,
  accessToken: string
): Promise<Lesson> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<UpdateLesson>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      mutation UpdateLesson($lessonId: ID!, $lesson: UpdateLessonInputType!) {
        me {
          updateLesson(lessonId: $lessonId, lesson: $lesson){
            lessonId
            intro
            dialogCategory
            name
            question
            media {
              url
              type
              props {
                name
                value
              }
            }
            learningFormat
            conclusion
            expectations {
              expectationId
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
          }
        }
      }
      `,
      variables: {
        lessonId,
        lesson: {
          lessonId: lesson.lessonId,
          name: lesson.name,
          intro: lesson.intro,
          dialogCategory: lesson.dialogCategory,
          question: lesson.question,
          media: lesson.media,
          learningFormat: lesson.learningFormat,
          expectations: lesson.expectations,
          conclusion: lesson.conclusion,
          lastTrainedAt: lesson.lastTrainedAt,
          features: lesson.features,
          createdBy: lesson.createdBy,
          deleted: lesson.deleted,
        },
      },
    },
    { headers: headers }
  );
  return findOrThrow<UpdateLesson>(result).me.updateLesson;
}

export async function deleteLesson(
  lessonId: string,
  accessToken: string
): Promise<Lesson> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<DeleteLesson>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      mutation DeleteLesson($lessonId: String!) {
        me {
          deleteLesson(lessonId: $lessonId){
            deleted
          }  
        }
      }
      `,
      variables: {
        lessonId,
      },
    },
    { headers: headers }
  );
  return findOrThrow<DeleteLesson>(result).me.deleteLesson;
}

export async function deleteSession(
  sessionId: string,
  accessToken: string
): Promise<Session> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<DeleteSession>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      mutation DeleteSession {
        me {
          deleteSession(sessionId: $sessionId){
            deleted
          }  
        }
      }
      `,
      variables: { sessionId },
    },
    { headers: headers }
  );
  return findOrThrow<DeleteSession>(result).me.deleteSession;
}

export async function trainLesson(lessonId: string): Promise<TrainJob> {
  const result = await axios.post<GQLResponse<TrainJob>>(
    urljoin(CLASSIFIER_ENTRYPOINT, "train"),
    {
      lesson: lessonId,
    }
  );
  return findOrThrow<TrainJob>(result);
}

export async function trainDefault(): Promise<TrainJob> {
  const result = await axios.post<GQLResponse<TrainJob>>(
    urljoin(CLASSIFIER_ENTRYPOINT, "train_default"),
    {}
  );
  return findOrThrow<TrainJob>(result);
}

export async function fetchTrainingStatus(
  statusUrl: string
): Promise<TrainStatus> {
  const result = await axios.get<GQLResponse<TrainStatus>>(statusUrl);
  return findOrThrow<TrainStatus>(result);
}

export async function fetchUsers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  filter: any,
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean,
  accessToken: string
): Promise<Connection<User>> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<FetchUsers>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      query FetchUsers($filter: String!, $limit: Int!, $cursor: String!, $sortBy: String!, $sortAscending: Boolean!) {
        me {
          users(
            filter: $filter,
            limit: $limit,
            cursor: $cursor,
            sortBy: $sortBy,
            sortAscending: $sortAscending
          ) {
            edges {
              cursor
              node {
                id
                name
                email
                userRole
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
      variables: {
        filter: JSON.stringify(filter),
        limit,
        cursor,
        sortBy,
        sortAscending,
      },
    },
    { headers }
  );
  return findOrThrow<FetchUsers>(result).me.users;
}

export async function updateUserPermissions(
  userId: string,
  permissionLevel: string,
  accessToken: string
): Promise<User> {
  const headers = { Authorization: `bearer ${accessToken}` };
  const result = await axios.post<GQLResponse<UpdateUserPermissions>>(
    GRAPHQL_ENDPOINT,
    {
      query: `
      mutation UpdateUserPermissions($userId: String!, $permissionLevel: String!) {
        me {
          updateUserPermissions(
            userId:$userId,
            permissionLevel:$permissionLevel
          ) {
            id
            name
            email
            userRole
          }
        }
      }
    `,
      variables: { userId, permissionLevel },
    },
    { headers: headers }
  );
  return findOrThrow<UpdateUserPermissions>(result).me.updateUserPermissions;
}

export async function login(accessToken: string): Promise<UserAccessToken> {
  const result = await axios.post<GQLResponse<Login>>(GRAPHQL_ENDPOINT, {
    query: `
      mutation Login($accessToken: String!) {
        login(accessToken: $accessToken) {
          user {
            id
            name
            userRole
          }
          accessToken
        }
      }
    `,
    variables: { accessToken },
  });
  return findOrThrow<Login>(result).login;
}

export async function loginGoogle(
  accessToken: string
): Promise<UserAccessToken> {
  const result = await axios.post<GQLResponse<LoginGoogle>>(GRAPHQL_ENDPOINT, {
    query: `
      mutation LoginGoogle($accessToken: String!) {
        loginGoogle(accessToken: $accessToken) {
          user {
            id
            name
            userRole
          }
          accessToken
        }
      }
    `,
    variables: { accessToken },
  });
  return findOrThrow<LoginGoogle>(result).loginGoogle;
}

export function userCanEdit(
  lesson: Lesson | undefined,
  user: User | undefined
): boolean {
  return Boolean(
    lesson &&
      user &&
      (`${lesson.createdBy}` === `${user.id}` || userIsElevated(user))
  );
}

export function userIsElevated(user: User | undefined): boolean {
  return Boolean(
    user &&
      (user.userRole === UserRole.ADMIN ||
        user.userRole === UserRole.CONTENT_MANAGER)
  );
}
