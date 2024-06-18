/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import {
  Grid,
  Divider,
  TextField,
  FormControl,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  ListItemText,
  Paper,
  Button,
} from "@mui/material";

interface QuestionAnswerClasses {
  selectForm: string;
  divider: string;
  button: string;
}
export function QuestionAnswerGen(props: {
  classes: QuestionAnswerClasses;
}): JSX.Element {
  const { classes } = props;
  const [questionStrategy, setQuestionStrategy] =
    React.useState("verification");
  const handleQuestionStrategy = (event: SelectChangeEvent) => {
    setQuestionStrategy(event.target.value as string);
  };
  return (
    <>
      <Paper elevation={0} style={{ textAlign: "left" }}>
        <Grid
          container
          spacing={0}
          style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
        >
          <Grid item>
            <Typography variant="h6" style={{ padding: 5 }}>
              QA Generation
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: 10 }}>
            <FormControl size="small" sx={{ mb: 1, minWidth: 200 }}>
              <InputLabel shrink>QA Strategy</InputLabel>
              <Select
                data-cy="question-strategy"
                labelId="question-strategy-label"
                label="QA Strategy"
                value={questionStrategy}
                onChange={handleQuestionStrategy}
              >
                <MenuItem value={"verification"}>
                  <ListItemText primary="Verification" />
                </MenuItem>
                <MenuItem value={"definition"}>
                  <ListItemText primary="Definition" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item style={{ marginLeft: 20 }}>
            <Button
              data-cy="generate-question-answer"
              className={classes.button}
              onClick={() => null}
              variant="contained"
              color="primary"
              size="small"
            >
              Generate QA Pairs
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              data-cy="question-input"
              label="User Question Input"
              placeholder="Insert stuff here testing"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              data-cy="answer-input"
              label="User Answer Input"
              placeholder="Insert stuff here testing"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              data-cy="question-context"
              label="Question Context"
              placeholder="Insert stuff here testing"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
            />
          </Grid>
          <Divider variant="middle" className={classes.divider} />
        </Grid>
      </Paper>
    </>
  );
}

export default QuestionAnswerGen;
