import axios from "axios";

import {
  FetchSessions,
  Edge,
  FetchUserSession,
  UserSession,
  SetGrade,
  Lesson,
  LessonEdge,
  FetchLessons,
  FetchLesson,
  CreateLesson,
  UpdateLesson,
} from "types";

export const GRADER_GRAPHQL_ENDPOINT =
  process.env.GRADER_GRAPHQL_ENDPOINT || "/grading-api/graphql/";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

export async function fetchSessions(): Promise<Edge[]> {
  const result = await axios.post<GQLResponse<FetchSessions>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        {
          sessions {
            edges {
              cursor node {
                sessionId
                username
                createdAt
                updatedAt
                classifierGrade
                grade
                lesson {
                  name
                }
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
        `,
    }
  );
  return result.data.data.sessions.edges;
}

export async function fetchUserSession(
  sessionId: string
): Promise<UserSession> {
  const result = await axios.post<GQLResponse<FetchUserSession>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        query ($sessionId: String!){
          userSession(sessionId: $sessionId) {
            username
            score
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
            }
          }
        }
        `,
      variables: {
        sessionId: sessionId,
      },
    }
  );
  return result.data.data.userSession;
}

export async function setGrade(
  sessionId: string,
  userAnswerIndex: number,
  userExpectationIndex: number,
  grade: string
): Promise<UserSession> {
  const result = await axios.post<GQLResponse<SetGrade>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        mutation ($sessionId: String!, $userAnswerIndex: Int!, $userExpectationIndex: Int!, $grade: String!) {
          setGrade(sessionId: $sessionId, userAnswerIndex:$userAnswerIndex, userExpectationIndex:$userExpectationIndex grade:$grade){
            username
            score
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

export async function fetchLessons(): Promise<LessonEdge[]> {
  const result = await axios.post<GQLResponse<FetchLessons>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
      {
        lessons {
          edges {
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
              createdAt
              updatedAt
            }
          }
        }
      }
        `,
    }
  );
  return result.data.data.lessons.edges;
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

export async function createLesson(): Promise<Lesson> {
  const result = await axios.post<GQLResponse<CreateLesson>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        mutation {
          createLesson {
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
          }
        }
        `,
    }
  );
  return result.data.data.createLesson;
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
