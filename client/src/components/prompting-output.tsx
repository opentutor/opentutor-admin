/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import { Grid, TextField, Typography, Paper, Button } from "@mui/material";
import {ReceiptLong as ReceiptLongIcon} from '@mui/icons-material'
import CallResponseLog from "./call-response-log";

interface OutputClasses {
  button: string;
}

const emails = ['username@gmail.com', 'user02@gmail.com'];

export function PromptingOutput(props: {
  classes: OutputClasses;

  questions: string[][];
}): JSX.Element {
  const { classes, questions} = props;
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

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = (value: string) => {
    setOpen(false);
    setTimeout(() => {
      setSelectedValue("");
    }, 1000);
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper elevation={0} style={{ textAlign: "left" }}>
          <Typography variant="h6" style={{ marginTop:10, marginBottom: 10 }}>
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
            style={{ marginTop: 10 }}
            onClick={handleClickOpen}
            /*disabled={arraysEqual(questions, initialQuestions)}*/
          >
            Call & Response Log
          </Button>
        </Paper>
      </Grid>
      <CallResponseLog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        setSelectedValue={setSelectedValue}
      />
    </>
  );
}

export default PromptingOutput;
