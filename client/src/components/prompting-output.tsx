/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import { Grid, TextField, Typography, Paper, Button } from "@mui/material";
import {
  ReceiptLong as ReceiptLongIcon,
  RateReview as RateReviewIcon,
} from "@mui/icons-material";
import CallResponseLog from "./call-response-log";
import ViewPrompts from "./view-prompts";
import CogenerationContext from "context/cogeneration";
interface OutputClasses {
  button: string;
}

export function PromptingOutput(props: {
  classes: OutputClasses;
}): JSX.Element {
  const { classes } = props;
  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }
  const initialQuestions = [
    ["", ""],
    ["", ""],
    ["", ""],
  ];
  const arraysEqual = (a: string[][], b: string[][]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].length !== b[i].length) return false;
      for (let j = 0; j < a[i].length; j++) {
        if (a[i][j] !== b[i][j]) return false;
      }
    }
    return true;
  };

  const [openLog, setOpenLog] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const [openPrompts, setOpenPrompts] = React.useState(false);
  const [selectedPrompt, setSelectedPrompt] = React.useState("");
  const handleClickOpenLog = () => {
    setOpenLog(true);
  };
  const handleClickOpenPrompts = () => {
    setOpenPrompts(true);
  };

  const handleClosePrompts = (value: string) => {
    setOpenPrompts(false);
    setTimeout(() => {
      setSelectedPrompt("");
    }, 1000);
  };

  const handleCloseLog = (value: string) => {
    setOpenLog(false);
    setTimeout(() => {
      setSelectedValue("");
    }, 1000);
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper elevation={0} style={{ textAlign: "left" }}>
          <Typography variant="h6" style={{ marginTop: 10, marginBottom: 10 }}>
            Output
          </Typography>
          <TextField
            data-cy="prompting-output"
            label="JSON Output"
            value={
              '{\n\t"lesson_name": "Pioneering the Future",\n\t"learning_objective": "Learning something new.",\n\t...\n}'
            }
            fullWidth
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            rows={5}
          />
          <Button
            data-cy="generate-question-answer"
            className={classes.button}
            startIcon={<ReceiptLongIcon />}
            variant="contained"
            color="info"
            size="small"
            style={{ marginTop: 10, marginRight: 10 }}
            onClick={handleClickOpenLog}
            disabled={arraysEqual(
              context.generationData.questionAnswerPairs,
              initialQuestions
            )}
          >
            Call & Response Log
          </Button>
          <Button
            data-cy="view-prompts"
            className={classes.button}
            startIcon={<RateReviewIcon />}
            variant="outlined"
            color="info"
            size="small"
            style={{ marginTop: 10 }}
            onClick={handleClickOpenPrompts}
            disabled={arraysEqual(
              context.generationData.questionAnswerPairs,
              initialQuestions
            )}
          >
            View Prompts
          </Button>
        </Paper>
      </Grid>
      <CallResponseLog
        selectedValue={selectedValue}
        open={openLog}
        onClose={handleCloseLog}
        setSelectedValue={setSelectedValue}
      />
      <ViewPrompts
        selectedPrompt={selectedPrompt}
        open={openPrompts}
        onClose={handleClosePrompts}
        setSelectedPrompt={setSelectedPrompt}
      />
    </>
  );
}

export default PromptingOutput;
