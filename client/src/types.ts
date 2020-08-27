// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = any;

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

export interface Session {
  sessionId: string;
  username: string;
  graderGrade: number;
  classifierGrade: number;
  question: Question;
  userResponses: UserResponse[];
  createdAt: string;
  updatedAt: string;
  lesson: Lesson;
  lessonName: string;
  lessonCreatedBy: string;
  deleted: boolean;
}

export interface Question {
  text: string;
  expectations: Expectation[];
}

export interface Expectation {
  text: string;
}

export interface UserResponse {
  text: string;
  expectationScores: ExpectationScore[];
}

export interface ExpectationScore {
  classifierGrade: string;
  graderGrade?: string;
}

export interface FetchSession {
  session: Session;
}

export interface FetchSessions {
  sessions: Connection<Session>;
}

export interface SetGrade {
  setGrade: Session;
}

export interface Lesson {
  id: string;
  lessonId: string;
  name: string;
  intro: string;
  question: string;
  conclusion: string[];
  expectations: LessonExpectation[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastTrainedAt: string;
  isTrainable: boolean;
  deleted: boolean;
}

export interface LessonExpectation {
  expectation: string;
  hints: Hint[];
}

export interface Hint {
  text: string;
}

export interface FetchLesson {
  lesson: Lesson;
}

export interface FetchLessons {
  lessons: Connection<Lesson>;
}

export interface UpdateLesson {
  updateLesson: Lesson;
}

export interface DeleteLesson {
  deleteLesson: Lesson;
}

export interface DeleteSession {
  deleteSession: Session;
}

export interface TrainJob {
  id: string;
  lesson: boolean;
  statusUrl: string;
}

export enum TrainStatusType {
  FAILURE = "FAILURE",
  NONE = "NONE",
  SUCCESS = "SUCCESS",
}

export interface TrainStatus {
  status: TrainStatusType;
  info?: TrainingInfo;
}

export interface TrainExpectionResult {
  accuracy: number;
}

export interface TrainResult {
  expectations: TrainExpectionResult[];
}

export interface TrainingInfo {
  lesson: string;
  expectations?: TrainExpectionResult[];
}
