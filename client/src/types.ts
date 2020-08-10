// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = any;

export interface Edge {
  cursor: string;
  node: Session;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface SessionsData {
  edges: Edge[];
  pageInfo: PageInfo;
}

export interface FetchSessions {
  userSessions: SessionsData;
}

export interface SessionLesson {
  name: string;
}

export interface Session {
  sessionId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  classifierGrade: number;
  graderGrade: number;
  lesson: SessionLesson;
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

export interface SessionLesson {
  name: string;
}

export interface UserSession {
  username: string;
  graderGrade: number;
  createdAt: string;
  updatedAt: number;
  question: Question;
  lesson: SessionLesson;
  userResponses: UserResponse[];
}

export interface FetchUserSession {
  userSession: UserSession;
}

export interface SetGrade {
  setGrade: UserSession;
}

export interface Hint {
  text: string;
}

export interface LessonExpectation {
  expectation: string;
  hints: Hint[];
}

export interface Lesson {
  id: string;
  lessonId: string;
  name: string;
  intro: string;
  question: string;
  conclusion: string[];
  expectations: LessonExpectation[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonEdge {
  cursor: string;
  node: Lesson;
}

export interface LessonsData {
  edges: LessonEdge[];
  pageInfo: PageInfo;
}

export interface FetchLessons {
  lessons: LessonsData;
}

export interface FetchLesson {
  lesson: Lesson;
}

export interface CreateLesson {
  createLesson: Lesson;
}

export interface UpdateLesson {
  updateLesson: Lesson;
}
