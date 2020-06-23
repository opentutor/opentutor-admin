import axios from "axios";
import { Session, SessionLog } from "types";

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

export async function fetchSessionLog(): Promise<SessionLog[]> {
  const result = await axios.post<GQLResponse<SessionLog[]>>(
    GRADER_GRAPHQL_ENDPOINT,
    {
      query: `
            sessionLog {
                {
                  sessionLog {
                    username
                  }
                }
              }
            `,
    }
  );
  return result.data.data;
}
