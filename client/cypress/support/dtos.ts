export interface TrainJob {
  id: string;
  lesson: boolean;
  statusUrl: string;
}

export enum TrainState {
  FAILURE = "FAILURE",
  PENDING = "PENDING",
  STARTED = "STARTED",
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
