import axios from "axios";
import { Session } from "types";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "grader/graphql/";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

export async function fetchSessions(): Promise<Session[]> {
  const result = await axios.post<GQLResponse<Session[]>>(GRAPHQL_ENDPOINT, {
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
  });
  return result.data.data;
}
