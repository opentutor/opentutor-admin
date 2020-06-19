// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = any;

export interface Session {
  sessionId: string;
  grade: number;
}

export interface State {
  sessions: Session[];
}
