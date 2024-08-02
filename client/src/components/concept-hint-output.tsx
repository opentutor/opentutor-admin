/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import clsx from "clsx";
import React, { useContext } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";
import { Add, ClearOutlined, ExpandMore } from "@mui/icons-material";
import CogenerationContext from "context/cogeneration";

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

export function ConceptHints(props: { conceptIndex: number }): JSX.Element {
  const { conceptIndex } = props;
  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }
  return (
    <>
      <Paper elevation={0} style={{ textAlign: "left", width: "100%" }}>
        <Grid
          container
          spacing={0}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            width: "100%",
          }}
        >
          <Grid item>
            <Typography variant="h6" style={{ padding: 5 }}>
              Hints
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List
              data-cy="hints"
              dense
              disablePadding
              style={{ paddingTop: 10, paddingBottom: 10 }}
            >
              {context.generationData.concepts[conceptIndex].hints.map(
                (hint, i) => (
                  <ListItem key={i}>
                    <Card
                      data-cy={`hint-${i}`}
                      variant="outlined"
                      style={{ width: "100%" }}
                    >
                      <CardContent
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <TextField
                          data-cy="edit-hint"
                          margin="normal"
                          label={`Hint ${i + 1}`}
                          placeholder="Add a leading question or other hint for the concept's correct answer."
                          multiline
                          maxRows={4}
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={hint || ""}
                          onChange={(e) => {
                            context.handleHintChange(
                              e.target.value,
                              conceptIndex,
                              i
                            );
                          }}
                          variant="outlined"
                        />
                      </CardContent>
                    </Card>
                  </ListItem>
                )
              )}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
const ExpectationCard = (props: {
  classes: LessonInputClasses;
  concept: string;
  conceptIndex: number;
}) => {
  const { classes, concept, conceptIndex } = props;
  const [expanded, setExpanded] = React.useState(true);
  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }
  return (
    <Card data-cy={`concept-${conceptIndex}`} className={classes.cardRoot}>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            data-cy="edit-concept"
            margin="normal"
            name="Concepts"
            label={`Concept ${conceptIndex + 1}`}
            placeholder="Add/edit the desired key concept"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={concept || ""}
            onChange={(e) => {
              context.handleConceptChange(e.target.value, conceptIndex);
            }}
          />
          <CardActions>
            {context.generationData.concepts.length > 1 ? (
              <IconButton
                data-cy="delete"
                aria-label="remove concept"
                size="small"
                onClick={() => context.handleRemoveConcept(conceptIndex)}
              >
                <ClearOutlined />
              </IconButton>
            ) : null}
            <IconButton
              data-cy="expand"
              aria-label="expand expectation"
              size="small"
              aria-expanded={expanded}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={() => setExpanded(!expanded)}
            >
              <ExpandMore />
            </IconButton>
          </CardActions>
        </div>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          style={{ paddingLeft: 15, paddingTop: 10 }}
        >
          <ConceptHints conceptIndex={conceptIndex} />
        </Collapse>
      </CardContent>
    </Card>
  );
};

function ConceptHintOutput(props: {
  classes: LessonInputClasses;
}): JSX.Element {
  const { classes } = props;
  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }
  return (
    <Paper
      elevation={0}
      style={{ textAlign: "left", marginBottom: 20, width: "100%" }}
    >
      <Typography variant="h6" style={{ paddingTop: 5 }}>
        Key Concepts
      </Typography>
      <List data-cy="expectations">
        {context.generationData.concepts.map((concept, i) => (
          <ListItem key={i} style={{ width: "100%" }}>
            <ExpectationCard
              classes={classes}
              concept={concept.concept}
              conceptIndex={i}
            />
          </ListItem>
        ))}
      </List>
      <Button
        data-cy="add-concept"
        startIcon={<Add />}
        className={classes.button}
        onClick={context.handleAddConcept}
        variant="outlined"
        color="primary"
        style={{ marginTop: 15 }}
      >
        Add Concept
      </Button>
    </Paper>
  );
}

export default ConceptHintOutput;
