import { ActionType, State } from "./types";

export const initialState: State = {
  sessions: [
    {
      sessionId: "session 1",
      grade: 1.0,
    },
    {
      sessionId: "session 2",
      grade: 0.5,
    },
  ],
};

export default function reducer(
  state = initialState,
  action: ActionType
): State {
  switch (action.type) {
    default:
      return state;
  }
}
