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
import { LessonExpectation, Hint } from "types";
import "styles/layout.css";

const ExpectationCard = (props: {
  classes: any;
  expectation: LessonExpectation;
  expIdx: number;
  canDelete: boolean;
  handleExpectationChange: (val: string) => void;
  handleRemoveExpectation: () => void;
  handleHintChange: (val: Hint[]) => void;
}) => {
  const {
    classes,
    expectation,
    expIdx,
    canDelete,
    handleExpectationChange,
    handleRemoveExpectation,
    handleHintChange,
  } = props;
  const [expanded, setExpanded] = React.useState(true);

  return (
    <Card>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CardActions>
            <DragHandleIcon />
          </CardActions>
          <TextField
            margin="normal"
            name="expectations"
            id={`edit-expectation-${expIdx}`}
            key={`edit-expectation-${expIdx}`}
            label={`Expectation ${expIdx + 1}`}
            placeholder="Add a short ideal answer for an expectation, e.g. 'Red'"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 100 }}
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
                aria-label="remove expectation"
                size="small"
                onClick={handleRemoveExpectation}
              >
                <ClearOutlinedIcon />
              </IconButton>
            ) : null}
            <IconButton
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
            expIdx={expIdx}
            updateHints={handleHintChange}
          />
        </Collapse>
      </CardContent>
    </Card>
  );
};

const ExpectationsList = (props: {
  classes: any;
  expectations: LessonExpectation[];
  updateExpectations: (val: LessonExpectation[]) => void;
}) => {
  const { classes, expectations, updateExpectations } = props;

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const startIdx = result.source.index;
    const endIdx = result.destination.index;
    const [removed] = expectations.splice(startIdx, 1);
    expectations.splice(endIdx, 0, removed);
    updateExpectations([...expectations]);
  }

  function handleExpectationChange(val: string, idx: number): void {
    expectations[idx].expectation = val;
    updateExpectations([...expectations]);
  }

  function handleAddExpectation(): void {
    const newItem = {
      expectation: "Add a short ideal answer for an expectation, e.g. 'Red'",
      hints: [
        {
          text:
            "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
        },
      ],
    };
    expectations.push(newItem);
    updateExpectations([...expectations]);
  }

  function handleRemoveExpectation(idx: number): void {
    expectations.splice(idx, 1);
    updateExpectations([...expectations]);
  }

  function handleHintChange(val: Hint[], eIdx: number): void {
    expectations[eIdx].hints = val;
    updateExpectations([...expectations]);
  }

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
              ref={provided.innerRef}
              className={
                snapshot.isDraggingOver ? classes.listDragging : classes.list
              }
            >
              {expectations.map((exp, i) => (
                <ListItem>
                  <Draggable
                    key={`expectation-${i}`}
                    draggableId={`expectation-${i}`}
                    index={i}
                  >
                    {(provided, snapshot) => (
                      <div
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
                        />
                      </div>
                    )}
                  </Draggable>
                </ListItem>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        startIcon={<AddIcon />}
        className={classes.button}
        onClick={handleAddExpectation}
      >
        Add Expectation
      </Button>
    </Paper>
  );
};

export default ExpectationsList;
