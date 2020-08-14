export interface StatusUrl {
  statusUrl: string;
}

export interface TrainStatus {
  status: string;
  success: boolean;
  info: TrainingInfo;
}

export interface TrainingInfo {
  accuracy: number;
}
