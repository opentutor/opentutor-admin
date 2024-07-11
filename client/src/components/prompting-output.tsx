/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import { Grid, TextField, Typography, Paper } from "@mui/material";

import CogenerationContext from "context/cogeneration";

export function PromptingOutput(): JSX.Element {
  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }

  return (
    <>
      <Grid item xs={12}>
        <Paper elevation={0} style={{ textAlign: "left" }}>
          <Typography variant="h6" style={{ marginTop: 10, marginBottom: 10 }}>
            Output
          </Typography>
          <TextField
            data-cy="prompting-output"
            label="JSON Output"
            value={context.generationData.jsonOutput}
            fullWidth
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            rows={5}
          />
        </Paper>
      </Grid>
    </>
  );
}

export default PromptingOutput;
