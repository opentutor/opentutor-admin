import React from "react";
import {
  Grid,
  Divider,
  TextField,
} from "@mui/material";

interface RecipeClasses{
  selectForm: string;
  divider: string;
  button: string;
}

import QuestionAnswerGen from "./question-answer-gen";
import DistractionGen from "./distraction-gen";

export function MultipleChoiceBaseline(props: {
  classes: RecipeClasses
}): JSX.Element {
  const {classes} = props;
  return (
    <>
    <Grid item xs={12}>
      <QuestionAnswerGen classes={classes} />
    </Grid>

    <Grid item xs={12}>
      <DistractionGen classes={classes} />
    </Grid>
    </>
  )
}

