/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import clsx from "clsx";
import { generatedLesson, inputFields } from "constants/cogenerationDummyData";
import {
  Grid,
  Divider,
  TextField,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
  Collapse,
} from "@mui/material";
import CogenerationContext from "context/cogeneration";
import ConceptHintOutput from "./concept-hint-output";
import { ExpandMore } from "@mui/icons-material";

interface LessonInputClasses {
  selectForm: string;
  divider: string;
  button: string;
  expand: string;
  expandOpen: string;
  list: string;
  listDragging: string;
  cardRoot: string;
}

export function LessonInput(props: {
  classes: LessonInputClasses;
}): JSX.Element {
  const { classes } = props;

  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }
  const [expanded, setExpanded] = React.useState(true);

  return (
    <>
      <Paper elevation={0} style={{ textAlign: "left" }}>
        <Grid
          container
          spacing={3}
          style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
        >
          <Grid item style={{ marginBottom: 10 }}>
            <Typography variant="h6" style={{ padding: 5 }}>
              Lesson Generation
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: 20, marginBottom: 10 }}>
            <Button
              data-cy="generate-lesson"
              className={classes.button}
              onClick={context.handleGenerateLesson}
              variant="contained"
              color="primary"
              size="small"
              disabled={context.generationData.universalContext === ""}
            >
              Generate Lesson
            </Button>
          </Grid>
          <Grid item style={{ marginLeft: 20, marginBottom: 10 }}>
          <IconButton
              data-cy="expand"
              aria-label="expand expectation"
              size="small"
              aria-expanded={expanded}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={() => setExpanded(!expanded)}
            ><ExpandMore />
          </IconButton>
          </Grid>
        </Grid>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          style={{ paddingLeft: 15, paddingTop: 10 }}
        >
        <Grid container spacing={4}>
          
          {inputFields.map((input, i) => (
            <Grid key={i} item xs={12}>
              <TextField
                data-cy={input.dataCy}
                label={input.label}
                placeholder={input.placeholder}
                fullWidth
                multiline
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
          ))}
          
        <Divider variant="middle" className={classes.divider} />
        </Grid>
        </Collapse>
      </Paper>
    </>
  );
}

export function LessonOutput(props: {
  classes: LessonInputClasses;
}): JSX.Element {
  const { classes } = props;

  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }

  return (
    <>
      <Card
        data-cy={`Generated-Lesson`}
        style={{
          width: "100%",
          marginTop: 15,
          marginBottom: 15,
          marginLeft: 15,
        }}
      >
        <CardContent>
          <Grid container spacing={1}>
            <Typography variant="h6" style={{ padding: 3 }}>
              Generated Lesson
            </Typography>
            {generatedLesson.map((lesson, i) => (
              <Grid item xs={12} key={i}>
                <TextField
                  margin="normal"
                  data-cy={lesson.dataCy}
                  label={lesson.label}
                  multiline
                  maxRows={4}
                  fullWidth
                  placeholder={lesson.placeholder}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={context.generationData[lesson.valueKey] || ""}
                  onChange={(e) => {
                    (context[lesson.onChange] as (value: string) => void)(
                      e.target.value
                    );
                  }}
                />
              </Grid>
            ))}
            <ConceptHintOutput classes={classes} />

            <Grid item xs={12}>
              <TextField
                margin="normal"
                data-cy="edit-conclusion"
                label={`Conclusion`}
                multiline
                maxRows={4}
                fullWidth
                placeholder="Add/edit the desired conclusion"
                InputLabelProps={{
                  shrink: true,
                }}
                value={context.generationData.conclusion || ""}
                onChange={(e) => {
                  context.handleConclusionChange(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
