import axios from "axios";
import { FetchSessions, UserSession } from "types";

const GRADER_GRAPHQL_ENDPOINT =
  process.env.GRADER_GRAPHQL_ENDPOINT || "/grading-api/graphql/";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

export async function fetchSessions(): Promise<FetchSessions> {
  const result = await axios.post<GQLResponse<FetchSessions>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
          {
            sessions {
              edges {
                cursor node {
                  sessionId
                  classifierGrade
                  grade
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
  return result.data.data;
}

export async function fetchUserSession(
  sessionId: string
): Promise<UserSession> {
  const result = await axios.post<GQLResponse<UserSession>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        {
          userSession(sessionId: session 1) {
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
          }
        }
        `,
      variable: {
        sessionId: sessionId,
      },
    }
  );
  return result.data.data;
}

export async function setUserSessionGrade(
  sessionId: string,
  userAnswerIndex: number,
  userExpectationIndex: number,
  grade: string
): Promise<UserSession> {
  const result = await axios.post<GQLResponse<UserSession>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        mutation ($sessionId: String!, $userAnswerIndex: number!, $userExpectationIndex: number!, $grade: String!) {
          setGrade(sessionID: $sessionId, userAnswerIndex:$userAnswerIndex, expectationAnswerIndex:$number, grade:$grade){
            username
            question {
              text
              expectations {
                text
              }
            }
            
            userResponses {
              text
              userResponseExpectationScores {
                classifierGrade
                graderGrade
              }
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
  return result.data.data;
}
