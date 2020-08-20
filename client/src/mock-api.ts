// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from "axios";

import { StatusUrl, TrainStatus } from "mock-types";

export const GRAPHQL_ENDPOINT = "opentutor.org/training/train";

interface GQLResponse<T> {
  errors: { message: string }[];
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchStatusUrl(lessonId: string): Promise<StatusUrl> {
  // const result = await axios.post<GQLResponse<StatusUrl>>(GRAPHQL_ENDPOINT, {
  //   query: `
  //     query{
  //         statusUrl{
  //           statusUrl
  //         }
  //       }
  //       `,
  //   variables: {
  //     lessonId: lessonId,
  //   },
  // });
  return { statusUrl: "/training/status/{jobId}" };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchTraining(
  statusUrl: string,
  count: number
): Promise<TrainStatus> {
  // const result = await axios.get<GQLResponse<TrainStatus>>(
  //   "opentutor.org" + statusUrl
  // );
  if (count < 3) {
    return {
      status: "IN_PROGRESS",
      success: false,
      info: {
        accuracy: 0,
      },
    };
  } else {
    return {
      status: "COMPLETE",
      success: true,
      info: {
        accuracy: 0.83,
      },
    };
  }
}
