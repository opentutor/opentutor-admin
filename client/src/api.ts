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

export const GRADER_GRAPHQL_ENDPOINT =
  process.env.GRADER_GRAPHQL_ENDPOINT || "/grading-api/graphql/";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

export async function fetchSessions(
  limit: number,
  cursor: string,
  sortBy: string,
  sortDescending: boolean
): Promise<SessionsData> {
  const result = await axios.post<GQLResponse<FetchSessions>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
      query($limit: Int!, $cursor: String!, $sortBy:String!, $sortDescending:Boolean!) {
        sessions(limit:$limit, cursor:$cursor, sortBy:$sortBy, sortDescending:$sortDescending){
          edges {
            cursor 
            node {
              sessionId
              username
              classifierGrade
              graderGrade
              createdAt
              updatedAt
              lesson {
                name
                createdBy
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
      `,
      variables: {
        limit: limit,
        cursor: cursor,
        sortBy: sortBy,
        sortDescending: sortDescending,
      },
    }
  );
  return result.data.data.sessions;
}

export async function fetchSession(sessionId: string): Promise<Session> {
  const result = await axios.post<GQLResponse<FetchSession>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        query ($sessionId: String!){
          session(sessionId: $sessionId) {
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
              createdBy
            }
          }
        }
        `,
      variables: {
        sessionId: sessionId,
      },
    }
  );
  return result.data.data.session;
}

export async function setGrade(
  sessionId: string,
  userAnswerIndex: number,
  userExpectationIndex: number,
  grade: string
): Promise<Session> {
  const result = await axios.post<GQLResponse<SetGrade>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        mutation ($sessionId: String!, $userAnswerIndex: Int!, $userExpectationIndex: Int!, $grade: String!) {
          setGrade(sessionId: $sessionId, userAnswerIndex:$userAnswerIndex, userExpectationIndex:$userExpectationIndex grade:$grade){
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
      variables: {
        sessionId: sessionId,
        userAnswerIndex: userAnswerIndex,
        userExpectationIndex: userExpectationIndex,
        grade: grade,
      },
    }
  );
  return result.data.data.setGrade;
}

export async function fetchLessons(
  limit: number,
  cursor: string,
  sortBy: string,
  sortDescending: boolean
): Promise<LessonsData> {
  const result = await axios.post<GQLResponse<FetchLessons>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
      query($limit: Int!, $cursor: String!, $sortBy:String!, $sortDescending:Boolean!){
        lessons(limit:$limit, cursor:$cursor, sortBy:$sortBy, sortDescending:$sortDescending) {
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
            endCursor
            hasNextPage
          }
        }
      }
        `,
      variables: {
        limit: limit,
        cursor: cursor,
        sortBy: sortBy,
        sortDescending: sortDescending,
      },
    }
  );
  return result.data.data.lessons;
}

export async function fetchLesson(lessonId: string): Promise<Lesson> {
  const result = await axios.post<GQLResponse<FetchLesson>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        query ($lessonId: String!){
          lesson(lessonId: $lessonId) {
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
            createdBy
            createdAt
            updatedAt
          }
        }
        `,
      variables: {
        lessonId: lessonId,
      },
    }
  );
  return result.data.data.lesson;
}

export async function updateLesson(
  lessonId: string,
  lesson: string
): Promise<Lesson> {
  const result = await axios.post<GQLResponse<UpdateLesson>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        mutation ($lessonId: String!, $lesson: String!) {
          updateLesson(lessonId: $lessonId, lesson: $lesson){
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
            createdBy
            createdAt
            updatedAt
          }
        }
        `,
      variables: {
        lessonId: lessonId,
        lesson: lesson,
      },
    }
  );
  return result.data.data.updateLesson;
}
