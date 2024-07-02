/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import {
  Grid,
  FormControl,
  Typography,
  InputLabel,
  MenuItem,
  ListItemText,
  Paper,
  TextField,
  Divider,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MultipleChoiceBaseline } from "./recipe-fields";
import { RecipeType } from "types";
import PromptingOutput from "./prompting-output";
import CogenerationContext from "context/cogeneration";

interface FieldClasses {
  selectForm: string;
  divider: string;
  button: string;
  expand: string;
  expandOpen: string;
}

export function CogenerationFields(props: {
  classes: FieldClasses;
  genRecipe: string;
  setGenRecipe: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  const { classes, genRecipe, setGenRecipe } = props;
  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }
  const handleRecipeChange = (event: SelectChangeEvent) => {
    setGenRecipe(event.target.value as string);
  };

  console.log(
    "Current universalContext:",
    context.generationData.universalContext
  );
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
                onChange={handleRecipeChange}
              >
                <MenuItem value={"multipleChoice"}>
                  <ListItemText primary="MCQ Baseline" />
                </MenuItem>
                <MenuItem value={"testRecipe"}>
                  <ListItemText primary="Test Recipe" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              data-cy="universal-context"
              label="Universal Context"
              placeholder="Context to start generating MCQ"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={(e) => {
                context.handleContextChange(e.target.value);
              }}
            />
          </Grid>
          <Divider variant="middle" className={classes.divider} />
          {genRecipe === RecipeType.MCQ ? (
            <>
              <MultipleChoiceBaseline classes={classes} />
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Paper>
      <PromptingOutput classes={classes} />
    </>
  );
}

export default CogenerationFields;
