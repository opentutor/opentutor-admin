/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
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
  Menu,
  Button,
  IconButton,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { MultipleChoiceBaseline } from "./recipe-fields";
import { RecipeType } from "types";
import PromptingOutput from "./prompting-output";
import CogenerationContext from "context/cogeneration";
import { ClearOutlined } from "@mui/icons-material";

interface FieldClasses {
  selectForm: string;
  divider: string;
  button: string;
  expand: string;
  expandOpen: string;
}
interface ContextField {
  context: string;
  type: string;
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [additionalContext, setAdditionalContext] = React.useState<
    ContextField[]
  >([]);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const options = ["Add Text", "Add URL"];
  console.log(
    "Current universalContext:",
    context.generationData.universalContext
  );
  const handleClose = () => {
    2;
    setAnchorEl(null);
  };
  const handleAdditionalContextChange = (val: string, index: number) => {
    setAdditionalContext((prev) => {
      const newContext = [...prev];
      newContext[index].context = val;
      return newContext;
    });
  };

  const handleRemoveContext = (index: number) => {
    setAdditionalContext((prev) => {
      const newContext = [...prev];
      newContext.splice(index, 1);
      return newContext;
    });
  };
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setAdditionalContext((prev) => {
      const newContext = [
        ...prev,
        {
          context: "",
          type: options[index] == "Add Text" ? "Text" : "URL",
        },
      ];
      return newContext;
    });
    setAnchorEl(null);
  };

  return (
    <>
      <Paper elevation={0} style={{ textAlign: "left" }}>
        <Typography variant="h5" style={{ paddingTop: 5, paddingBottom: 15 }}>
          Generator Content
        </Typography>
        <Grid container spacing={2} style={{ marginBottom: 20 }}>
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
          <Grid item xs={10}>
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
          <Grid item xs={2} style={{ display: "flex" }}>
            <Button
              variant="text"
              data-cy="add-context"
              startIcon={<TextFieldsIcon />}
              size="medium"
              color="primary"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClickListItem}
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                marginLeft: 20,
              }}
            >
              ADD CONTEXT
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "add-context-button",
                role: "listbox",
                sx: { width: anchorEl && anchorEl.offsetWidth },
              }}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={option}
                  data-cy={option === "Add Text" ? "add-text" : "add-url"}
                  onClick={(event) => handleMenuItemClick(event, index)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
          {additionalContext.map((field, index) => (
            <>
              <Grid xs={11} key={index} item>
                <TextField
                  data-cy={`additional-context-${index}`}
                  label={`Context ${field.type}`}
                  placeholder="Context to start generating MCQ"
                  fullWidth
                  multiline
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  onChange={(e) => {
                    handleAdditionalContextChange(e.target.value, index);
                  }}
                />
              </Grid>
              <Grid item xs={1} container alignItems="center">
                <IconButton
                  data-cy="delete"
                  aria-label="remove question"
                  size="small"
                  onClick={() => handleRemoveContext(index)}
                >
                  <ClearOutlined />
                </IconButton>
              </Grid>
            </>
          ))}
          <Divider variant="middle" className={classes.divider} />
          {genRecipe === RecipeType.MCQ ? (
            <>
              <MultipleChoiceBaseline classes={classes} />
            </>
          ) : (
            <></>
          )}
        </Grid>
        <PromptingOutput />
      </Paper>
    </>
  );
}

export default CogenerationFields;
