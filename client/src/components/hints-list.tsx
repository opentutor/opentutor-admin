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
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  ClearOutlined as ClearOutlinedIcon,
  DragHandle as DragHandleIcon,
} from "@mui/icons-material";
import { Hint } from "types";
import "styles/layout.css";




const HintCard = (props: {
  hint: Hint;
  hintIdx: number;
  canDelete: boolean;
  handleHintChange: (val: string) => void;
  handleRemoveHint: () => void;
}) => {
  const { hint, hintIdx, canDelete, handleHintChange, handleRemoveHint } = props;
  

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
          placeholder="Add a leading question or other hint for the concept's correct answer."
          multiline
          maxRows={4}
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
  classes: { listDragging: string; button: string; list: string };
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
      text: "",
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
      <Grid container spacing={0} style={{display: "flex", alignItems:"center", marginBottom: 5 }}>
        <Grid item>
          <Typography variant="body1" style={{ padding: 5 }}>
            Hints
          </Typography>
        </Grid>
        <Grid item style={{marginLeft:10}}>
          <Button
          data-cy="add-hint"
          startIcon={<AddIcon />}
          className={classes.button}
          onClick={handleAddHint}
          variant="outlined"
          color="primary"
          size="small"
          >
          Add Hint
        </Button>
        </Grid>
      
      </Grid>
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
                snapshot.isDraggingOver ? classes.listDragging : classes.list
              }
              style={{ paddingTop: 10, paddingBottom: 10 }}
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
      
    </Paper>
  );
}
