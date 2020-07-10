// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = any;

export interface Edge {
  cursor: string;
  node: Session;
}

export interface PageInfo {
  hasNextPage: boolean;
}

export interface SessionsData {
  edges: Edge[];
  pageInfo: PageInfo;
}

export interface FetchSessions {
  sessions: SessionsData;
}

export interface Session {
  sessionId: string;
  username: string;
  createdAt: number;
  updatedAt: number;
  classifierGrade: number;
  grade: number;
}

export enum Classification {
  GOOD = "Good",
  BAD = "Bad",
}

export interface Expectation {
  text: string;
}

export interface Question {
  text: string;
  expectations: Expectation[];
}

export interface ExpectationScore {
  classifierGrade: string;
  graderGrade?: string;
}

export interface UserResponse {
  text: string;
  expectationScores: ExpectationScore[];
}

export interface UserSession {
  username: string;
  score: number;
  createdAt: number;
  updatedAt: number;
  question: Question;
  userResponses: UserResponse[];
}

export interface FetchUserSession {
  userSession: UserSession;
}

export interface SetGrade {
  setGrade: UserSession;
}
