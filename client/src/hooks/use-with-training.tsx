/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { fetchTrainingStatus, trainDefault, trainLesson } from "api";
import { useState } from "react";
import { Lesson, TrainState, TrainStatus } from "types";
import useInterval from "./use-interval";

export interface TrainingStatus {
  isTraining: boolean;
  trainingMessage: string | undefined;
  statusUrl: string;
  trainStatus: TrainStatus;
  startLessonTraining: (lesson: Lesson) => void;
  startDefaultTraining: () => void;
  dismissTrainingMessage: () => void;
}

export function useWithTraining(pollingInterval = 1000): TrainingStatus {
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const [statusUrl, setStatusUrl] = useState<string>("");
  const [trainStatus, setTrainStatus] = useState<TrainStatus>({
    state: TrainState.NONE,
  });

  useInterval(
    (isCancelled) => {
      if (!statusUrl || isCancelled()) {
        return;
      }
      fetchTrainingStatus(statusUrl)
        .then((status) => {
          setTrainStatus(status);
          if (isCancelled()) {
            setIsTraining(false);
            return;
          }
          if (status.state === TrainState.SUCCESS) {
            setIsTraining(false);
            setMessage("Training Succeeded");
          }
          if (status.state === TrainState.FAILURE) {
            setIsTraining(false);
            setMessage("Training Failed");
          }
        })
        .catch((err: Error) => {
          console.error(err);
          setIsTraining(false);
          setTrainStatus({ state: TrainState.FAILURE, status: err.message });
          setMessage("Training Failed");
        });
    },
    isTraining ? pollingInterval : null
  );

  function startLessonTraining(lesson: Lesson) {
    if (isTraining) {
      return;
    }
    if (!lesson.isTrainable) {
      setMessage(
        "Not enough graded data. Please grade more sessions and try again."
      );
      return;
    }
    trainLesson(lesson.lessonId, lesson.arch)
      .then((trainJob) => {
        setStatusUrl(trainJob.statusUrl);
        setIsTraining(true);
      })
      .catch((err: Error) => {
        console.error(err);
        setTrainStatus({
          state: TrainState.FAILURE,
          status: err.message || `${err}`,
        });
        setIsTraining(false);
        setMessage("Training Failed");
      });
  }

  function startDefaultTraining() {
    if (isTraining) {
      return;
    }
    trainDefault()
      .then((trainJob) => {
        setStatusUrl(trainJob.statusUrl);
        setIsTraining(true);
      })
      .catch((err: Error) => {
        console.error(err);
        setTrainStatus({
          state: TrainState.FAILURE,
          status: err.message || `${err}`,
        });
        setIsTraining(false);
        setMessage("Training Failed");
      });
  }

  function dismissTrainingMessage() {
    setMessage(undefined);
  }

  return {
    isTraining,
    trainingMessage: message,
    statusUrl,
    trainStatus,
    startLessonTraining,
    startDefaultTraining,
    dismissTrainingMessage,
  };
}
