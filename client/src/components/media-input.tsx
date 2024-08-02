/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";

import { Grid, TextField } from "@mui/material";
import { Lesson, MediaType } from "types";

export interface LessonEditSearch {
  lessonId: string;
  trainStatusPollInterval?: number;
  copyLesson?: string;
}
interface LessonUnderEdit {
  lesson?: Lesson;
  dirty?: boolean;
}
interface MediaClasses {
  image: string;
  thumbnail: string;
}

interface Prop {
  name: string;
  value: string;
}

export function ImageInputField(props: {
  lessonUnderEdit: LessonUnderEdit;
  setLesson: (lesson?: Lesson, dirty?: boolean) => void;
  classes: MediaClasses;
  newLesson: Lesson;
}): JSX.Element {
  const { lessonUnderEdit, setLesson, classes, newLesson } = props;

  const handleImageURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        media: {
          ...(lessonUnderEdit.lesson || newLesson).media,
          type: MediaType.IMAGE,
          url: (e.target.value as string) || "",
        },
      },
      true
    );
  };
  return (
    <Grid item xs={12}>
      <div className={classes.image}>
        <TextField
          data-cy="image"
          label="Image"
          placeholder="Image URL"
          required
          multiline
          maxRows={4}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={lessonUnderEdit.lesson?.media?.url || ""}
          onChange={handleImageURL}
          variant="outlined"
        />
        <img
          className={classes.thumbnail}
          data-cy="image-thumbnail"
          src={lessonUnderEdit.lesson?.media?.url}
          onClick={() => {
            window.open(lessonUnderEdit.lesson?.media?.url || "", "_blank");
          }}
        />
      </div>
    </Grid>
  );
}

export function VideoInputField(props: {
  lessonUnderEdit: LessonUnderEdit;
  setLesson: (lesson?: Lesson, dirty?: boolean) => void;
  search: LessonEditSearch;
  classes: MediaClasses;
  newLesson: Lesson;
}): JSX.Element {
  const { lessonUnderEdit, setLesson, newLesson } = props;

  function getProp(props: Array<Prop>, key: string): string {
    return props.find((p) => p.name === key)?.value || "";
  }

  function copyAndSetProp(props: Array<Prop>, prop: Prop): Array<Prop> {
    const pix = props.findIndex((p) => p.name === prop.name);
    if (pix >= 0) {
      return props.map((existing, i) => {
        if (i === pix) {
          return prop;
        } else {
          return existing;
        }
      });
    } else {
      return [...props, prop];
    }
  }

  const handleVideoStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        media: {
          url: lessonUnderEdit.lesson?.media?.url || "",
          type: MediaType.VIDEO,
          props: copyAndSetProp(
            (lessonUnderEdit.lesson || newLesson).media?.props || [],
            {
              name: "start",
              value: String(parseFloat(e.target.value) || 0) || "",
            }
          ),
        },
      },
      true
    );
  };

  const handleVideoEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        media: {
          url: lessonUnderEdit.lesson?.media?.url || "",
          type: MediaType.VIDEO,
          props: copyAndSetProp(
            (lessonUnderEdit.lesson || newLesson).media?.props || [],
            {
              name: "end",
              value:
                String(parseFloat(e.target.value) || Number.MAX_SAFE_INTEGER) ||
                "",
            }
          ),
        },
      },
      true
    );
  };

  const handleVideoURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        media: {
          ...(lessonUnderEdit.lesson || newLesson).media,
          type: MediaType.VIDEO,
          url: (e.target.value as string) || "",
        },
      },
      true
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          data-cy="video-url"
          label="Video"
          placeholder="YouTube Video URL"
          required
          multiline
          maxRows={4}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={lessonUnderEdit.lesson?.media?.url || ""}
          onChange={handleVideoURL}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container direction={"row"} spacing={2}>
          <Grid item xs={6}>
            <TextField
              data-cy="video-start"
              label="Video Start Time"
              placeholder="0.0"
              type="number"
              required
              multiline
              maxRows={1}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={
                lessonUnderEdit.lesson?.media &&
                lessonUnderEdit.lesson?.media.props
                  ? parseFloat(
                      getProp(lessonUnderEdit.lesson.media.props, "start")
                    ) || 0
                  : 0
              }
              onChange={handleVideoStart}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              data-cy="video-end"
              label="Video End Time"
              placeholder="180.0"
              type="number"
              required
              multiline
              fullWidth
              maxRows={1}
              InputLabelProps={{
                shrink: true,
              }}
              value={
                lessonUnderEdit.lesson?.media &&
                lessonUnderEdit.lesson?.media.props
                  ? parseFloat(
                      getProp(lessonUnderEdit.lesson.media.props, "end")
                    ) || Number.MAX_SAFE_INTEGER
                  : Number.MAX_SAFE_INTEGER
              }
              onChange={handleVideoEnd}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
