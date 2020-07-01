import axios from "axios";
import { FetchSessions,
  FetchUserSession, 
  UserSession} from "types";

const GRADER_GRAPHQL_ENDPOINT =
  process.env.GRADER_GRAPHQL_ENDPOINT || "/grading/graphql/";

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

export async function fetchUserSession(sessionId: string): Promise<UserSession> {
  const result = await axios.post<GQLResponse<FetchUserSession>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        query($sessionId: String!){
          userSession(sessionId: $sessionId) {
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
        sessionId: sessionId
      }
    }
  );
  return result.data.data.userSession;
}

export async function setUserSessionGrade(sessionId: string, userAnswerIndex: number, userExpectationIndex: number, grade: string): Promise<UserSession> {
  const result = await axios.post<GQLResponse<FetchUserSession>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
          mutation ($sessionId: String!, $userAnswerIndex: Number!, $userExpectationIndex: Number!, $grade: String!) {
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
        grade: grade
      }
    }
  );
  return result.data.data.userSession;
}

