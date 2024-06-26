/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import {
  Grid,
  Divider,
  TextField,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Card,
  CardActions,
  CardContent,
  IconButton,
} from "@mui/material";
import { ClearOutlined } from "@mui/icons-material";

interface DistractorClasses {
  selectForm: string;
  divider: string;
  button: string;
  expand: string;
  expandOpen: string;
}

const Distractor = (props: {
  distractorIndex: number;
  distractor: string;
  handleDistractorChange: (val: string) => void;
  handleRemoveDistractor: () => void;
  canDelete: boolean;
}) => {
  const {
    distractorIndex,
    distractor,
    handleDistractorChange,
    handleRemoveDistractor,
    canDelete,
  } = props;

  return (
    <Card
      data-cy={`Distractor-${distractorIndex}`}
      style={{ width: "100%", marginTop: 15, marginBottom: 15, marginLeft: 15 }}
    >
      <CardContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            margin="normal"
            data-cy="edit-distractor"
            label={`Distractor ${distractorIndex + 1}`}
            multiline
            maxRows={4}
            fullWidth
            placeholder="Add/edit the desired distractor"
            InputLabelProps={{
              shrink: true,
            }}
            value={distractor || ""}
            onChange={(e) => {
              handleDistractorChange(e.target.value);
            }}
            variant="outlined"
          />
          <CardActions>
            {canDelete ? (
              <IconButton
                data-cy="delete"
                aria-label="remove question"
                size="small"
                onClick={handleRemoveDistractor}
              >
                <ClearOutlined />
              </IconButton>
            ) : null}
          </CardActions>
        </div>
      </CardContent>
    </Card>
  );
};
export function DistractionGen(props: {
  classes: DistractorClasses;
  questionChosen: number | null;
  universalContext: string;
  distractors: string[];
  showDistractors: boolean;
  onDistractorChange: (val: string, idx: number) => void;
  onRemoveDistractor: (index: number) => void;
  onGenerateDistractors: () => void;
}): JSX.Element {
  const {
    classes,
    questionChosen,
    universalContext,
    distractors,
    showDistractors,
    onDistractorChange,
    onRemoveDistractor,
    onGenerateDistractors,
  } = props;
  const [distractorStrategy, setDistractorStrategy] = React.useState("random");
  const handleDistractorStrategy = (event: SelectChangeEvent) => {
    setDistractorStrategy(event.target.value as string);
  };

  return (
    <>
      <Paper elevation={0} style={{ textAlign: "left" }}>
        <Grid
          container
          spacing={0}
          style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
        >
          <Grid item>
            <Typography variant="h6" style={{ padding: 5 }}>
              Distractor Generation
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: 10 }}>
            <FormControl size="small" sx={{ mb: 1, minWidth: 200 }}>
              <InputLabel shrink>Distractor Strategy</InputLabel>
              <Select
                data-cy="distractor-strategy"
                labelId="distractor-strategy-label"
                label="Distractor Strategy"
                value={distractorStrategy}
                onChange={handleDistractorStrategy}
              >
                <MenuItem value={"random"}>
                  <ListItemText primary="Random" />
                </MenuItem>
                <MenuItem value={"opposites"}>
                  <ListItemText primary="Opposites" />
                </MenuItem>
                <MenuItem value={"falseAssumption"}>
                  <ListItemText primary="False Assumption" />
                </MenuItem>
                <MenuItem value={"baselineAssumption"}>
                  <ListItemText primary="Baseline Assumption" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item style={{ marginLeft: 20 }}>
            <Button
              data-cy="generate-distractor"
              className={classes.button}
              onClick={onGenerateDistractors}
              variant="contained"
              color="primary"
              size="small"
              disabled={questionChosen === null || universalContext === ""}
            >
              Generate Distractors
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              data-cy="distractor-input"
              label="User Distractor Input"
              placeholder="Insert additional input to generate distractors"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              data-cy="distractor-context"
              label="Distractor Context"
              placeholder="Insert additional context to generate distractors"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
            />
          </Grid>
          {showDistractors &&
            distractors.map((row, i) => (
              <Distractor
                key={i}
                distractorIndex={i}
                distractor={row}
                handleDistractorChange={(val: string) => {
                  onDistractorChange(val, i);
                }}
                handleRemoveDistractor={() => {
                  onRemoveDistractor(i);
                }}
                canDelete={distractors.length > 1}
              />
            ))}
          <Divider variant="middle" className={classes.divider} />
        </Grid>
      </Paper>
    </>
  );
}

export default DistractionGen;
