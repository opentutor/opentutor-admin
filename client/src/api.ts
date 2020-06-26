import axios from "axios";
import { Session,
  Classification,
  Expectation, 
  Question,
  UserResponseExpectationScore,
  UserResponse,
  UserSession} from "types";

const GRADER_GRAPHQL_ENDPOINT =
  process.env.GRADER_GRAPHQL_ENDPOINT || "/grading/graphql/";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

export async function fetchSessions(): Promise<Session[]> {
  const result = await axios.post<GQLResponse<Session[]>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
            query Sessions {
                {
                sessions {
                    sessionId
                    classifierGrade
                    grade
                }
                }
            `,
    }
  );
  return result.data.data;
}

export async function fetchUserSession(): Promise<UserSession> {
  const result = await axios.post<GQLResponse<UserSession>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        query userSession {
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
        `,
    }
  );
  return result.data.data;
}

export async function setGrade(sessionId: String, userAnswerIndex: number, grade: String ): Promise<any> {
  const result = await axios.post<GQLResponse<any>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
        mutation setGrade($sessionId: String!, $userAnswerIndex: number!, $grade: Classification!) {
          setGrade(sessionID: $sessionId, userAnswerIndex:$userAnswerIndex, grade:$grade){
            grade
          }
        }
        `,
      variables: {
        "sessionId": sessionId,
        "userAnswerIndex": userAnswerIndex,
        "grade": grade
      }
    }
  );
  return result.data.data;
}

