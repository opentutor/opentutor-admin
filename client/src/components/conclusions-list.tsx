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
import "styles/layout.css";

interface ConclusionClasses {
  button: string;
  list: string;
  listDragging: string;
}

const ConclusionCard = (props: {
  conclusion: string;
  idx: number;
  canDelete: boolean;
  handleConclusionChange: (val: string) => void;
  handleRemoveConclusion: () => void;
}) => {
  const {
    conclusion,
    idx,
    canDelete,
    handleConclusionChange,
    handleRemoveConclusion,
  } = props;

  return (
    <Card id={`conclusion-${idx}`} data-cy={`conclusion-${idx}`}>
      <CardContent style={{ display: "flex", flexDirection: "row" }}>
        <CardActions>
          <DragHandleIcon />
        </CardActions>
        <TextField
          margin="normal"
          id="edit-conclusion"
          data-cy="edit-conclusion"
          label={`Conclusion ${idx + 1}`}
          multiline
          rowsMax={4}
          fullWidth
          placeholder="Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'"
          InputLabelProps={{
            shrink: true,
          }}
          value={conclusion || ""}
          onChange={(e) => {
            handleConclusionChange(e.target.value);
          }}
          variant="outlined"
        />
        <CardActions>
          {canDelete ? (
            <IconButton
              id="delete" data-cy="delete"
              aria-label="remove conclusion"
              size="small"
              onClick={handleRemoveConclusion}
            >
              <ClearOutlinedIcon />
            </IconButton>
          ) : null}
        </CardActions>
      </CardContent>
    </Card>
  );
};

function ConclusionsList(props: {
  classes: ConclusionClasses;
  conclusions: string[];
  updateConclusions: (val: string[]) => void;
}): JSX.Element {
  const { classes, conclusions, updateConclusions } = props;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const startIdx = result.source.index;
    const endIdx = result.destination.index;
    const [removed] = conclusions.splice(startIdx, 1);
    conclusions.splice(endIdx, 0, removed);
    updateConclusions([...conclusions]);
  };

  const handleConclusionChange = (val: string, idx: number) => {
    conclusions[idx] = val;
    updateConclusions([...conclusions]);
  };

  const handleAddConclusion = () => {
    conclusions.push(
      "Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'"
    );
    updateConclusions([...conclusions]);
  };

  const handleRemoveConclusion = (index: number) => {
    conclusions.splice(index, 1);
    updateConclusions([...conclusions]);
  };

  return (
    <Paper elevation={0} style={{ textAlign: "left" }}>
      <Typography variant="body2" style={{ padding: 15 }}>
        Conclusions
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              id="conclusions"
              data-cy="conclusions"
              ref={provided.innerRef}
              className={
                snapshot.isDraggingOver ? classes.listDragging : classes.list
              }
            >
              {conclusions.map((row, i) => (
                <Draggable
                  key={`conclusion-${i}`}
                  draggableId={`conclusion-${i}`}
                  index={i}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ConclusionCard
                        idx={i}
                        conclusion={row}
                        canDelete={conclusions.length > 1}
                        handleConclusionChange={(val: string) => {
                          handleConclusionChange(val, i);
                        }}
                        handleRemoveConclusion={() => {
                          handleRemoveConclusion(i);
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
        id="add-conclusion"
        data-cy="add-conclusion"
        startIcon={<AddIcon />}
        className={classes.button}
        onClick={handleAddConclusion}
      >
        Add Conclusion
      </Button>
    </Paper>
  );
}

export default ConclusionsList;
