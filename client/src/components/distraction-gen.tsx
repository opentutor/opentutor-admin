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
} from "@mui/material";

interface DistractionClasses {
  selectForm: string;
  divider: string;
  button: string;
}
export function DistractionGen(props: {
  classes: DistractionClasses;
}): JSX.Element {
  const { classes } = props;

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
            <Button
              data-cy="view-distractor-prompts"
              className={classes.button}
              onClick={() => null}
              variant="contained"
              color="primary"
              size="small"
            >
              See Distractor Prompts
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              data-cy="distractor-input"
              label="User Distractor Input"
              placeholder="Insert stuff here testing"
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
              placeholder="Insert stuff here testing"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
            />
          </Grid>
          <Divider variant="middle" className={classes.divider} />
        </Grid>
      </Paper>
    </>
  );
}

export default DistractionGen;
