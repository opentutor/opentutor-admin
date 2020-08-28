export interface TrainJob {
  id: string;
  lesson: boolean;
  statusUrl: string;
}

export enum TrainState {
  FAILURE = "FAILURE",
  IN_PROGRESS = "IN_PROGRESS",
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
  lesson?: string;
  expectations?: TrainExpectionResult[];
}
