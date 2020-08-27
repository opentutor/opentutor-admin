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
  SessionsData,
  LessonsData,
  StatusUrl,
  TrainStatus,
} from "types";

export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "/graphql";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

export async function fetchSessions(
  filter: any,
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean
): Promise<SessionsData> {
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
  return result.data.data.sessions;
}

export async function fetchSession(sessionId: string): Promise<Session> {
  const result = await axios.post<GQLResponse<FetchSession>>(GRAPHQL_ENDPOINT, {
    query: `
        query {
          session(sessionId: "${sessionId}") {
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
            }
          }
        }
      `,
  });
  return result.data.data.session;
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
            }
          }
        }
      `,
  });
  return result.data.data.setGrade;
}

export async function fetchLessons(
  filter: any,
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean
): Promise<LessonsData> {
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
  return result.data.data.lessons;
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
            conclusion
            expectations {
              expectation
              hints {
                text
              }
            }
            lastTrainedAt
            isTrainable
            createdBy
          }
        }
      `,
  });
  return result.data.data.lesson;
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
            conclusion
            expectations {
              expectation
              hints {
                text
              }
            }
            lastTrainedAt
            isTrainable
            createdBy
          }
        }
      `,
  });
  return result.data.data.updateLesson;
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
  return result.data.data.deleteLesson;
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
  return result.data.data.deleteSession;
}

export const CLASSIFIER_ENTRYPOINT =
  process.env.CLASSIFIER_ENTRYPOINT || "http://classifier/classifier";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

export async function fetchStatusUrl(lessonId: string): Promise<any> {
  const result = await axios.post<any>(`${CLASSIFIER_ENTRYPOINT}/train`, {
    lesson: lessonId,
  });
  return result.data.data.statusUrl;
}

export async function fetchTraining(statusUrl: string): Promise<any> {
  const result = await axios.get<any>(`${CLASSIFIER_ENTRYPOINT}${statusUrl}`);
  return result.data.data.trainStatus;
}
