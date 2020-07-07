import axios from "axios";

import {
  FetchSessions,
  Edge,
  FetchUserSession,
  UserSession,
  SetGrade,
} from "types";

const GRADER_GRAPHQL_ENDPOINT =
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
