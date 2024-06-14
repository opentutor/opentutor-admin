/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Lesson } from "types";
import {
  COMPOSITE_CLASSIFIER_ARCHITECTURE,
  DEFAULT_CLASSIFIER_ARCHITECTURE,
  OPENAI_CLASSIFIER_ARCHITECTURE,
} from "admin-constants";
import { ArrowRight, ArrowDropDown } from "@mui/icons-material";

interface LessonUnderEdit {
  lesson?: Lesson;
  dirty?: boolean;
}
interface AdvancedFeaturesClasses {
  selectForm: string;
}

const LessonIdInput = (props: {
  lessonUnderEdit: LessonUnderEdit;
  error: string | "";
  setLesson: (lesson?: Lesson, dirty?: boolean) => void;
  newLesson: Lesson;
}) => {
  const { lessonUnderEdit, error, setLesson, newLesson } = props;
  const handleLessonId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        lessonId: e.target.value || "",
      },
      true
    );
  };

  return (
    <TextField
      data-cy="lesson-id"
      label="Lesson ID"
      placeholder="Unique alias to the lesson"
      fullWidth
      multiline
      error={error !== ""}
      helperText={error}
      InputLabelProps={{
        shrink: true,
      }}
      value={lessonUnderEdit.lesson?.lessonId || ""}
      onChange={handleLessonId}
      variant="outlined"
    />
  );
};

const LessonNameInput = (props: { lessonUnderEdit: LessonUnderEdit }) => {
  const { lessonUnderEdit } = props;

  return (
    <TextField
      fullWidth
      multiline
      data-cy="lesson-creator"
      label="Created By"
      placeholder="Guest"
      variant="outlined"
      InputLabelProps={{
        shrink: true,
      }}
      value={lessonUnderEdit.lesson?.createdByName || "Guest"}
      disabled={true}
    />
  );
};
const DialogCategorySelect = (props: {
  lessonUnderEdit: LessonUnderEdit;
  classes: AdvancedFeaturesClasses;
  setLesson: (lesson?: Lesson, dirty?: boolean) => void;
  newLesson: Lesson;
}) => {
  const { lessonUnderEdit, classes, setLesson, newLesson } = props;

  const handleDialogCategory = (e: SelectChangeEvent<string>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        dialogCategory: (e.target.value as string) || "",
      },
      true
    );
  };
  return (
    <FormControl className={classes.selectForm} variant="outlined">
      <InputLabel shrink id="dialog-category-label" key="Confirmation Code">
        Dialog Category
      </InputLabel>
      <Select
        labelId="dialog-category-label"
        value={lessonUnderEdit.lesson?.dialogCategory || "NOT SET"}
        label="Dialog Category"
        onChange={handleDialogCategory}
      >
        <MenuItem value={"default"}>Default</MenuItem>
        <MenuItem value={"sensitive"}>Sensitive</MenuItem>
      </Select>
    </FormControl>
  );
};

const ClassifierArchSelect = (props: {
  lessonUnderEdit: LessonUnderEdit;
  classes: AdvancedFeaturesClasses;
  setLesson: (lesson?: Lesson, dirty?: boolean) => void;
  newLesson: Lesson;
}) => {
  const { lessonUnderEdit, classes, setLesson, newLesson } = props;

  const handleClassifierArch = (e: SelectChangeEvent<string>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        arch: (e.target.value as string) || DEFAULT_CLASSIFIER_ARCHITECTURE,
      },
      true
    );
  };

  return (
    <FormControl className={classes.selectForm} variant="outlined">
      <InputLabel shrink id="classifier-arch-label">
        Classifier Architecture
      </InputLabel>
      <Select
        data-cy="classifier-arch"
        labelId="classifier-arch-label"
        label="Classifier Architecture"
        value={lessonUnderEdit.lesson?.arch || DEFAULT_CLASSIFIER_ARCHITECTURE}
        onChange={handleClassifierArch}
      >
        <MenuItem value={DEFAULT_CLASSIFIER_ARCHITECTURE}>LR2</MenuItem>
        <MenuItem value={OPENAI_CLASSIFIER_ARCHITECTURE}>OpenAI</MenuItem>
        <MenuItem value={COMPOSITE_CLASSIFIER_ARCHITECTURE}>COMPOSITE</MenuItem>
      </Select>
    </FormControl>
  );
};

export function AdvancedFeatures(props: {
  lessonUnderEdit: LessonUnderEdit;
  setLesson: (lesson?: Lesson, dirty?: boolean) => void;
  classes: AdvancedFeaturesClasses;
  newLesson: Lesson;
  error: string | "";
}): JSX.Element {
  const [isShowingAdvancedFeatures, setIsShowingAdvancedFeatures] =
    React.useState(false);
  const { lessonUnderEdit, setLesson, classes, newLesson, error } = props;
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 5,
          cursor: "pointer",
        }}
        onClick={() => setIsShowingAdvancedFeatures(!isShowingAdvancedFeatures)}
      >
        {isShowingAdvancedFeatures ? <ArrowDropDown /> : <ArrowRight />}
        <Typography variant="body2" data-cy="advanced-features">
          {isShowingAdvancedFeatures
            ? "Hide Advanced Features"
            : "Show Advanced Features"}
        </Typography>
      </div>
      <div style={isShowingAdvancedFeatures ? {} : { display: "none" }}>
        <Grid container spacing={2} style={{ marginTop: 3, marginBottom: 20 }}>
          <Grid item xs={8}>
            <LessonIdInput
              lessonUnderEdit={lessonUnderEdit}
              setLesson={setLesson}
              error={error}
              newLesson={newLesson}
            />
          </Grid>
          <Grid item xs={4}>
            <LessonNameInput lessonUnderEdit={lessonUnderEdit} />
          </Grid>
          <Grid item xs={6}>
            <DialogCategorySelect
              lessonUnderEdit={lessonUnderEdit}
              setLesson={setLesson}
              classes={classes}
              newLesson={newLesson}
            />
          </Grid>
          <Grid item xs={6}>
            <ClassifierArchSelect
              lessonUnderEdit={lessonUnderEdit}
              setLesson={setLesson}
              classes={classes}
              newLesson={newLesson}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default AdvancedFeatures;
