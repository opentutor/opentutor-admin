/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";

import {
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import {
  GpsNotFixed as GPSNotFixedIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import { Lesson } from "types";

export interface LessonEditSearch {
  lessonId: string;
  trainStatusPollInterval?: number;
  copyLesson?: string;
}
interface LessonUnderEdit {
  lesson?: Lesson;
  dirty?: boolean;
}
interface HeaderClasses {
  selectForm: string;
  divider: string;
}

export function LessonHeader(props: {
  lessonUnderEdit: LessonUnderEdit;
  setLesson: (lesson?: Lesson, dirty?: boolean) => void;
  newLesson: Lesson;
  classes: HeaderClasses;
}): JSX.Element {
  const { lessonUnderEdit, newLesson, setLesson, classes } = props;

  const handleLessonName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        name: e.target.value || "",
      },
      true
    );
  };

  const handleLessonType = (e: SelectChangeEvent<string>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        learningFormat: (e.target.value as string) || "default",
      },
      true
    );
  };

  return (
    <Grid container data-cy="lesson-edit-grid" spacing={2}>
      <Grid item xs={8}>
        <TextField
          data-cy="lesson-name"
          label="Lesson Title"
          placeholder="Lesson Name"
          fullWidth
          multiline
          InputLabelProps={{
            shrink: true,
          }}
          value={lessonUnderEdit.lesson?.name || ""}
          onChange={handleLessonName}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl className={classes.selectForm} variant="outlined">
          <InputLabel shrink id="lesson-format-label">
            Lesson Type
          </InputLabel>
          <Select
            data-cy="lesson-format"
            labelId="lesson-format-label"
            label="Lesson Type"
            value={lessonUnderEdit.lesson?.learningFormat || "default"}
            onChange={handleLessonType}
            renderValue={(value) => {
              return (
                <Box sx={{ display: "flex", gap: 17 }}>
                  {value == "default" ? (
                    <GPSNotFixedIcon />
                  ) : (
                    <ViewModuleIcon />
                  )}
                  {value == "default" ? "Default Format" : "Survey Says Format"}
                </Box>
              );
            }}
          >
            <MenuItem value={"default"}>
              <ListItemIcon>
                <GPSNotFixedIcon />
              </ListItemIcon>
              <ListItemText primary="Default Format" />
            </MenuItem>
            <MenuItem value={"surveySays"}>
              <ListItemIcon>
                <ViewModuleIcon />
              </ListItemIcon>
              <ListItemText primary="Survey Says Format">
                Survey Says Format
              </ListItemText>
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Divider variant="middle" className={classes.divider} />
    </Grid>
  );
}

export default LessonHeader;
