import { ActionType, State } from "./types";

export const initialState: State = {};

export default function reducer(
  state = initialState,
  action: ActionType
): State {
  switch (action.type) {
    default:
      return state;
  }
}
