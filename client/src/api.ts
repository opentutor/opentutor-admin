import axios from "axios";
import {
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
} from "types";

export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "/graphql";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

export async function fetchSessions(
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
          sessions(limit:${limit}, cursor:"${cursor}", sortBy:"${sortBy}", sortAscending:${sortAscending}){
            edges {
              cursor 
              node {
                sessionId
                username
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
          setGrade(sessionId: "${sessionId}", userAnswerIndex:${userAnswerIndex}, userExpectationIndex:${userExpectationIndex} grade:"${grade}"){
            username
            graderGrade
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
              createdBy
            }
          }
        }
      `,
  });
  return result.data.data.setGrade;
}

export async function fetchLessons(
  limit: number,
  cursor: string,
  sortBy: string,
  sortAscending: boolean
): Promise<LessonsData> {
  const result = await axios.post<GQLResponse<FetchLessons>>(GRAPHQL_ENDPOINT, {
    query: `
        query {
          lessons(limit:${limit}, cursor:"${cursor}", sortBy:"${sortBy}", sortAscending:${sortAscending}) {
            edges {
              cursor
              node {
                id
                lessonId
                name
                intro
                question
                conclusion
                expectations {
                  expectation
                  hints {
                    text
                  }
                }
                createdBy
                createdAt
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
            id
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
            createdAt
            updatedAt
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
            id
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
            createdAt
            updatedAt
          }
        }
      `,
  });
  return result.data.data.updateLesson;
}
