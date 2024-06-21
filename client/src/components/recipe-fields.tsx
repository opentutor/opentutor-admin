/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import { Grid } from "@mui/material";

interface RecipeClasses {
  selectForm: string;
  divider: string;
  button: string;
  expand: string;
  expandOpen: string;
}

import QuestionAnswerGen from "./question-answer-gen";
import DistractionGen from "./distraction-gen";

export function MultipleChoiceBaseline(props: {
  classes: RecipeClasses;
  universalContext: string;
  questionChosen: string;
  setQuestionChosen: React.Dispatch<React.SetStateAction<string>>;
  setQuestions: React.Dispatch<React.SetStateAction<string[][]>>;
  questions: string[][];
}): JSX.Element {
  const { classes, universalContext, questionChosen, setQuestionChosen, questions, setQuestions } = props;

  return (
    <>
      <Grid item xs={12}>
        <QuestionAnswerGen
          classes={classes}
          questionChosen={questionChosen}
          setQuestionChosen={setQuestionChosen}
          universalContext={universalContext}
          questions={questions}
          setQuestions={setQuestions}
        />
      </Grid>

      <Grid item xs={12}>
        <DistractionGen
          classes={classes}
          questionChosen={questionChosen}
          universalContext={universalContext}
        />
      </Grid>
    </>
  );
}
