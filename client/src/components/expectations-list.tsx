/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import Ajv from "ajv";
import clsx from "clsx";
import React from "react";
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
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HintsList from "components/hints-list";
import { expectationFeatureSchema } from "schemas/validation";
import { LessonExpectation, Hint, Features } from "types";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";

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
}

const ExpectationCard = (props: {
  classes: ExpectationClasses;
  expectation: LessonExpectation;
  expIdx: number;
  canDelete: boolean;
  handleExpectationChange: (val: string) => void;
  handleRemoveExpectation: () => void;
  handleHintChange: (val: Hint[]) => void;
  handleFeaturesChange: (val: Features) => void;
}) => {
  const {
    classes,
    expectation,
    expIdx,
    canDelete,
    handleExpectationChange,
    handleRemoveExpectation,
    handleHintChange,
    handleFeaturesChange,
  } = props;
  const [expanded, setExpanded] = React.useState(true);
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
    <Card id={`expectation-${expIdx}`} data-cy={`expectation-${expIdx}`}>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CardActions>
            <DragHandleIcon />
          </CardActions>
          <TextField
            id="edit-expectation"
            data-cy="edit-expectation"
            margin="normal"
            name="expectations"
            label={`Expectation ${expIdx + 1}`}
            placeholder="Add a short ideal answer for an expectation, e.g. 'Red'"
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
                id="delete" data-cy="delete"
                aria-label="remove expectation"
                size="small"
                onClick={handleRemoveExpectation}
              >
                <ClearOutlinedIcon />
              </IconButton>
            ) : null}
            <IconButton
              id="expand"
              data-cy="expand"
              aria-label="expand expectation"
              size="small"
              aria-expanded={expanded}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={() => setExpanded(!expanded)}
            >
              <ExpandMoreIcon />
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
          <Typography variant="body2" style={{ padding: 5 }}>
            Additional Features
          </Typography>
          {JSONEditor()}
        </Collapse>
      </CardContent>
    </Card>
  );
};

function ExpectationsList(props: {
  classes: ExpectationClasses;
  expectations: LessonExpectation[];
  updateExpectations: (val: LessonExpectation[]) => void;
}): JSX.Element {
  const { classes, expectations, updateExpectations } = props;

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
        expectation: "Add a short ideal answer for an expectation, e.g. 'Red'",
        hints: [
          {
            text: "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
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
    <Paper elevation={0} style={{ textAlign: "left" }}>
      <Typography variant="body2" style={{ padding: 15 }}>
        Expectations
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              id="expectations"
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
                        expIdx={i}
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
        id="add-expectation"
        data-cy="add-expectation"
        startIcon={<AddIcon />}
        className={classes.button}
        onClick={handleAddExpectation}
      >
        Add Expectation
      </Button>
    </Paper>
  );
}

export default ExpectationsList;
