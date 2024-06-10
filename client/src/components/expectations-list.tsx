/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import Ajv from "ajv";
import clsx from "clsx";
import React from "react";
import { v4 as uuid } from "uuid";
import { navigate } from "gatsby";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import HintsList from "components/hints-list";
import { expectationFeatureSchema } from "schemas/validation";
import { LessonExpectation, Hint, Features } from "types";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";
import {
  Add,
  DragHandle,
  ClearOutlined,
  ExpandMore,
  Launch,
  ArrowRight,
  ArrowDropDown,
} from "@mui/icons-material";

interface IJSONEditor extends JSX.Element {
  expandAll: () => void;
  focus: () => void;
  set: (f: Features) => void;
}
interface HasJsonEditor {
  jsonEditor?: IJSONEditor;
}

interface ExpectationClasses {
  expand: string;
  expandOpen: string;
  list: string;
  listDragging: string;
  button: string;
  cardRoot: string;
}

const ExpectationCard = (props: {
  classes: ExpectationClasses;
  expectation: LessonExpectation;
  expId: string;
  expIndex: number;
  lessonId: string;
  canDelete: boolean;
  handleExpectationChange: (val: string) => void;
  handleRemoveExpectation: () => void;
  handleHintChange: (val: Hint[]) => void;
  handleFeaturesChange: (val: Features) => void;
}) => {
  const {
    classes,
    expectation,
    expId: expId,
    expIndex: expIndex,
    lessonId,
    canDelete,
    handleExpectationChange,
    handleRemoveExpectation,
    handleHintChange,
    handleFeaturesChange,
  } = props;
  const [expanded, setExpanded] = React.useState(true);
  const [isShowingAdvancedFeatures, setIsShowingAdvancedFeatures] =
    React.useState(false);
  const editorRef = React.useRef<HasJsonEditor>();

  const ajv = new Ajv({ allErrors: true, verbose: true });
  let features: Features = {};
  React.useEffect(() => {
    features = expectation.features || { bad: [], good: [] };
    const jse = editorRef?.current?.jsonEditor as IJSONEditor;
    if (jse) {
      jse.set(features);
      jse.expandAll();
      jse.focus();
    }
  }, [expanded]);

  function JSONEditor(): JSX.Element {
    if (typeof window === "undefined") {
      return <></>;
    }
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const { JsonEditor } = require("jsoneditor-react");
    return (
      <JsonEditor
        ref={editorRef}
        value={features}
        ajv={ajv}
        schema={expectationFeatureSchema}
        onChange={onEditJson}
      />
    );
  }

  function onEditJson(json: Features): void {
    handleFeaturesChange(json);
  }

  return (
    <Card data-cy={`expectation-${expIndex}`} className={classes.cardRoot}>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CardActions>
            <DragHandle />
          </CardActions>
          <TextField
            data-cy="edit-expectation"
            margin="normal"
            name="expectations"
            label={`Concept ${expIndex + 1}`}
            placeholder="Add a short ideal answer for the question. Make sure to list necessary main ideas as separate key concepts."
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={expectation.expectation || ""}
            onChange={(e) => {
              handleExpectationChange(e.target.value);
            }}
          />
          <CardActions>
            {canDelete ? (
              <IconButton
                data-cy="delete"
                aria-label="remove expectation"
                size="small"
                onClick={handleRemoveExpectation}
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
          <HintsList
            classes={classes}
            hints={expectation.hints}
            updateHints={handleHintChange}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: 5,
              cursor: "pointer",
              
            }}
            onClick={() =>
              setIsShowingAdvancedFeatures(!isShowingAdvancedFeatures)
            }
          >
            {isShowingAdvancedFeatures ? <ArrowDropDown /> : <ArrowRight />}
            <Typography variant="body2" data-cy={`advanced-concept-options-${expIndex}`}>
              {isShowingAdvancedFeatures
                ? "Hide Advanced Concept Options"
                : "Show Advanced Concept Options"}
            </Typography>
          </div>
          {/* IMPORTANT: We cannot conditionally render JSONEditor() since it uses a ref to populate data. */}
          <div style={isShowingAdvancedFeatures ? {} : { display: "none" }}>
            {JSONEditor()}
            <Button
              data-cy={`view-expectation-${expIndex}-data-button`}
              style={{ marginLeft: 15, marginTop: 10 }}
              endIcon={<Launch />}
              onClick={() => {
                navigate(
                  `../../sessions/data?lessonId=${lessonId}&expectation=${expId}`
                );
              }}
            >
              View Expectation Data
            </Button>
          </div>
        </Collapse>
      </CardContent>
    </Card>
  );
};

function ExpectationsList(props: {
  classes: ExpectationClasses;
  expectations: LessonExpectation[];
  lessonId: string;
  updateExpectations: (val: LessonExpectation[]) => void;
}): JSX.Element {
  const { classes, expectations, lessonId, updateExpectations } = props;

  function replaceItem<T>(a: Array<T>, index: number, item: T): Array<T> {
    const newArr = [...a];
    newArr[index] = item;
    return newArr;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const startIdx = result.source.index;
    const endIdx = result.destination.index;
    const [removed] = expectations.splice(startIdx, 1);
    expectations.splice(endIdx, 0, removed);
    updateExpectations([...expectations]);
  };

  const handleExpectationChange = (val: string, idx: number) => {
    updateExpectations(
      replaceItem(expectations, idx, {
        ...expectations[idx],
        expectation: val,
      })
    );
  };

  const handleFeaturesChange = (val: Features, idx: number) => {
    updateExpectations(
      replaceItem(expectations, idx, {
        ...expectations[idx],
        features: val,
      })
    );
  };

  const handleHintChange = (val: Hint[], idx: number) => {
    updateExpectations(
      replaceItem(expectations, idx, {
        ...expectations[idx],
        hints: val,
      })
    );
  };

  const handleAddExpectation = () => {
    updateExpectations([
      ...expectations,
      {
        expectation: "",
        expectationId: uuid().toString(),
        hints: [
          {
            text: "",
          },
        ],
        features: {},
      },
    ]);
  };

  const handleRemoveExpectation = (idx: number) => {
    expectations.splice(idx, 1);
    updateExpectations([...expectations]);
  };

  return (
    <Paper elevation={0} style={{ textAlign: "left", marginBottom: 20 }}>
      {/*rewording "Expectations" as Key Concepts for the User */}
      <Typography variant="h6" style={{ paddingTop: 5, paddingBottom: 15 }}>
        Key Concepts
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              data-cy="expectations"
              ref={provided.innerRef}
              className={
                snapshot.isDraggingOver ? classes.listDragging : classes.list
              }
            >
              {expectations.map((exp, i) => (
                <Draggable
                  key={`expectation-${i}`}
                  draggableId={`expectation-${i}`}
                  index={i}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ExpectationCard
                        classes={classes}
                        expectation={exp}
                        expId={exp.expectationId}
                        expIndex={i}
                        lessonId={lessonId}
                        canDelete={expectations.length > 1}
                        handleExpectationChange={(val: string) => {
                          handleExpectationChange(val, i);
                        }}
                        handleRemoveExpectation={() => {
                          handleRemoveExpectation(i);
                        }}
                        handleHintChange={(val: Hint[]) => {
                          handleHintChange(val, i);
                        }}
                        handleFeaturesChange={(val: Features) => {
                          handleFeaturesChange(val, i);
                        }}
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        data-cy="add-expectation"
        startIcon={<Add />}
        className={classes.button}
        onClick={handleAddExpectation}
        variant="outlined"
        color="primary"
        style={{ marginTop: 15 }}
      >
        Add Concept
      </Button>
    </Paper>
  );
}

export default ExpectationsList;
