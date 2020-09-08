import React, { useCallback } from "react";
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
    <Card id={`conclusion-${idx}`}>
      <CardContent style={{ display: "flex", flexDirection: "row" }}>
        <CardActions>
          <DragHandleIcon />
        </CardActions>
        <TextField
          margin="normal"
          id="edit"
          label={`Conclusion ${idx + 1}`}
          multiline
          rowsMax={4}
          inputProps={{ maxLength: 400 }}
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
              id="delete"
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

const ConclusionsList = (props: {
  classes: any;
  conclusions: string[];
  updateConclusions: (val: string[]) => void;
}) => {
  const { classes, conclusions, updateConclusions } = props;

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      const startIdx = result.source.index;
      const endIdx = result.destination.index;
      const [removed] = conclusions.splice(startIdx, 1);
      conclusions.splice(endIdx, 0, removed);
      updateConclusions([...conclusions]);
    },
    [conclusions]
  );

  const handleConclusionChange = useCallback(
    (val: string, idx: number) => {
      conclusions[idx] = val;
      updateConclusions([...conclusions]);
    },
    [conclusions]
  );

  const handleAddConclusion = useCallback(() => {
    conclusions.push(
      "Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'"
    );
    updateConclusions([...conclusions]);
  }, [conclusions]);

  const handleRemoveConclusion = useCallback(
    (index: number) => {
      conclusions.splice(index, 1);
      updateConclusions([...conclusions]);
    },
    [conclusions]
  );

  return (
    <Paper id="conclusions" elevation={0} style={{ textAlign: "left" }}>
      <Typography variant="body2" style={{ padding: 15 }}>
        Conclusions
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
              {conclusions.map((row, i) => (
                <Draggable
                  key={`conclusion-${i}`}
                  draggableId={`conclusion-${i}`}
                  index={i}
                >
                  {(provided, snapshot) => (
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
        startIcon={<AddIcon />}
        className={classes.button}
        onClick={handleAddConclusion}
      >
        Add Conclusion
      </Button>
    </Paper>
  );
};

export default ConclusionsList;
