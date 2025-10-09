/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
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

export interface AppConfig {
  googleClientId: string;
  logoIcon: string;
  logoLargeIcon: string;
  featuredLessons: string[];
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
  lastGradedByName: string;
  lastGradedAt: string;
  deleted: boolean;
}

export interface Question {
  text: string;
  expectations: Expectation[];
}

export interface Expectation {
  expectationId: string;
  text: string;
}

export interface UserResponse {
  _id: string;
  text: string;
  expectationScores: ExpectationScore[];
}

export interface ExpectationScore {
  expectationId: string;
  invalidated: boolean;
  classifierGrade: string;
  graderGrade?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Features = Record<string, any>;

export interface Lesson {
  lessonId: string;
  arch: string;
  llmModelName?: string;
  name: string;
  intro: string;
  dialogCategory: string;
  question: string;
  media?: Media | null;
  learningFormat: string;
  expectations: LessonExpectation[];
  conclusion: string[];
  lastTrainedAt: string;
  features: Features;
  isTrainable?: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface Media {
  url: string;
  type: string;
  props?: Array<{ name: string; value: string }>;
}

export enum MediaType {
  NONE = "none",
  IMAGE = "image",
  VIDEO = "video",
}

export interface LessonExpectation {
  expectationId: string;
  expectation: string;
  features: Features;
  hints: Hint[];
}

export interface Hint {
  text: string;
}

export interface TrainJob {
  id: string;
  lesson: boolean;
  statusUrl: string;
}

export enum TrainState {
  FAILURE = "FAILURE",
  NONE = "NONE",
  SUCCESS = "SUCCESS",
}

export interface TrainStatus {
  state: TrainState;
  status?: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  userRole: string;
}

export const UserRole = {
  AUTHOR: "author",
  CONTENT_MANAGER: "contentManager",
  ADMIN: "admin",
};

export interface UserAccessToken {
  user: User;
  accessToken: string;
  expirationDate: string;
}

export interface Login {
  login: UserAccessToken;
}

export interface LoginGoogle {
  loginGoogle: UserAccessToken;
}

export interface FetchSession {
  me: {
    session: Session;
  };
}

export interface FetchSessions {
  me: {
    sessions: Connection<Session>;
  };
}

export interface FetchLesson {
  me: {
    lesson: Lesson;
  };
}

export interface FetchLessons {
  me: {
    lessons: Connection<Lesson>;
  };
}

export interface FetchUsers {
  me: {
    users: Connection<User>;
  };
}

export interface UpdateLesson {
  me: {
    updateLesson: Lesson;
  };
}

export interface DeleteLesson {
  me: {
    deleteLesson: Lesson;
  };
}

export interface SetGrade {
  me: {
    setGrade: Session;
  };
}

export interface DeleteSession {
  me: {
    deleteSession: Session;
  };
}

export interface UpdateUserPermissions {
  me: {
    updateUserPermissions: User;
  };
}

export interface ExpectationsDataFilter {
  dirty: boolean;
  hideUngraded: boolean;
  hideInvalid: boolean;
}

export interface OfflineVideoData {
  uri: string;
  startTime: number;
  endTime: number;
}

export interface OfflineLessonData {
  id: string;
  lessonId: string;
  name: string;
  intro: string;
  question: string;
  expectations: LessonExpectation[];
  conclusion: string[];
  dialogCategory: string;
  learningFormat?: string;
  image?: string;
  video?: OfflineVideoData;
}

export enum RecipeType {
  MCQ = "multipleChoice",
  Lesson = "lesson",
}
