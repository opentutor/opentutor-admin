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
import { Hint } from "types";
import "styles/layout.css";

const HintCard = (props: {
  hint: Hint;
  hintIdx: number;
  canDelete: boolean;
  handleHintChange: (val: string) => void;
  handleRemoveHint: () => void;
}) => {
  const {
    hint,
    hintIdx,
    canDelete,
    handleHintChange,
    handleRemoveHint,
  } = props;

  return (
    <Card id={`hint-${hintIdx}`} variant="outlined">
      <CardContent style={{ display: "flex", flexDirection: "row" }}>
        <CardActions>
          <DragHandleIcon />
        </CardActions>
        <TextField
          margin="normal"
          id="edit-hint"
          key="edit-hint"
          label={`Hint ${hintIdx + 1}`}
          placeholder="Add a hint to help for the expectation, e.g. 'One of them starts with R'"
          multiline
          rowsMax={4}
          inputProps={{ maxLength: 400 }}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={hint.text || ""}
          onChange={(e) => {
            handleHintChange(e.target.value);
          }}
          variant="outlined"
        />
        <CardActions>
          {canDelete ? (
            <IconButton
              id="delete-hint"
              aria-label="remove hint"
              size="small"
              onClick={handleRemoveHint}
            >
              <ClearOutlinedIcon />
            </IconButton>
          ) : null}
        </CardActions>
      </CardContent>
    </Card>
  );
};

const HintsList = (props: {
  classes: any;
  hints: Hint[];
  updateHints: (val: Hint[]) => void;
}) => {
  const { classes, hints, updateHints } = props;

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const startIdx = result.source.index;
    const endIdx = result.destination.index;
    const [removed] = hints.splice(startIdx, 1);
    hints.splice(endIdx, 0, removed);
    updateHints([...hints]);
  }

  function handleHintChange(val: string, idx: number): void {
    hints[idx].text = val;
    updateHints([...hints]);
  }

  function handleAddHint(): void {
    const newItem = {
      text:
        "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
    };
    hints.push(newItem);
    updateHints([...hints]);
  }

  function handleRemoveHint(idx: number): void {
    hints.splice(idx, 1);
    updateHints([...hints]);
  }

  return (
    <Paper elevation={0} style={{ textAlign: "left" }}>
      <Typography variant="body2" style={{ padding: 5 }}>
        Hints
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              dense
              disablePadding
              className={
                snapshot.isDraggingOver ? classes.listDragging : undefined
              }
            >
              {hints.map((hint, i) => (
                <Draggable
                  key={`hint-${i}`}
                  draggableId={`hint-${i}`}
                  index={i}
                >
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <HintCard
                        hint={hint}
                        hintIdx={i}
                        canDelete={hints.length > 1}
                        handleHintChange={(val: string) => {
                          handleHintChange(val, i);
                        }}
                        handleRemoveHint={() => {
                          handleRemoveHint(i);
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
        startIcon={<AddIcon />}
        className={classes.button}
        onClick={handleAddHint}
      >
        Add Hint
      </Button>
    </Paper>
  );
};

export default HintsList;
