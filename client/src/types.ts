// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = any;

export interface Session {
  sessionId: string;
  classifierGrade: number;
  grade: number;
}

export enum Classification {
  GOOD= "Good",
  BAD= "Bad"
}

export interface Expectation {
  text: string;
}

export interface Question {
  text: string;
  expectations: Expectation[];
}

export interface UserResponseExpectationScore {
  classifierGrade: string;
  graderGrade?: string;
}

export interface UserResponse {
  text: string;
  userResponseExpectationScores: UserResponseExpectationScore[]; 
}

export interface UserSession {
  username: string;
  question: Question;
  userResponses: UserResponse[];
}