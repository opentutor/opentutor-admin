/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
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
  const { hint, hintIdx, canDelete, handleHintChange, handleRemoveHint } =
    props;

  return (
    <Card
      data-cy={`hint-${hintIdx}`}
      variant="outlined"
      style={{ width: "100%" }}
    >
      <CardContent style={{ display: "flex", flexDirection: "row" }}>
        <CardActions>
          <DragHandleIcon />
        </CardActions>
        <TextField
          data-cy="edit-hint"
          margin="normal"
          label={`Hint ${hintIdx + 1}`}
          placeholder="Add a hint to help for the expectation, e.g. 'One of them starts with R'"
          multiline
          rowsMax={4}
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
              data-cy="delete"
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

export default function HintsList(props: {
  classes: { listDragging: string; button: string };
  hints: Hint[];
  updateHints: (val: Hint[]) => void;
}): JSX.Element {
  const { classes, hints, updateHints } = props;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const startIdx = result.source.index;
    const endIdx = result.destination.index;
    const [removed] = hints.splice(startIdx, 1);
    hints.splice(endIdx, 0, removed);
    updateHints([...hints]);
  };

  const handleHintChange = (val: string, idx: number) => {
    hints[idx].text = val;
    updateHints([...hints]);
  };

  const handleAddHint = () => {
    const newItem = {
      text: "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
    };
    hints.push(newItem);
    updateHints([...hints]);
  };

  const handleRemoveHint = (idx: number) => {
    hints.splice(idx, 1);
    updateHints([...hints]);
  };

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
              data-cy="hints"
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
                  {(provided) => (
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
        data-cy="add-hint"
        startIcon={<AddIcon />}
        className={classes.button}
        onClick={handleAddHint}
      >
        Add Hint
      </Button>
    </Paper>
  );
}
