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
  ListItemText,
  Paper,
} from "@mui/material";

interface FieldClasses {
  selectForm: string;
  divider: string;
  button: string;
}
import QuestionAnswerGen from "./question-answer-gen";
import DistractionGen from "./distraction-gen";
export function CogenerationFields(props: {
  classes: FieldClasses;
}): JSX.Element {
  const { classes } = props;
  const [genRecipe, setGenRecipe] = React.useState("multipleChoice");
  return (
    <>
      <Paper elevation={0} style={{ textAlign: "left" }}>
        <Typography variant="h5" style={{ paddingTop: 5, paddingBottom: 15 }}>
          Generator Content
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl className={classes.selectForm} variant="outlined">
              <InputLabel shrink id="lesson-format-label">
                Generator Recipe
              </InputLabel>
              <Select
                data-cy="generator-recipe"
                labelId="generator-recipe-label"
                label="Generator Recipe"
                value={genRecipe}
              >
                <MenuItem value={"multipleChoice"}>
                  <ListItemText primary="MCQ Baseline" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              data-cy="universal-context"
              label="Universal Context"
              placeholder="Insert stuff here testing"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>

          <Divider variant="middle" className={classes.divider} />

          <Grid item xs={12}>
            <QuestionAnswerGen classes={classes} />
          </Grid>

          <Grid item xs={12}>
            <DistractionGen classes={classes} />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default CogenerationFields;
