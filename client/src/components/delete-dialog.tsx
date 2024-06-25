/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export function DeleteDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleConfirm: (index: number) => void;
  index: number | null;
}): JSX.Element {
  const { open, handleClose, handleConfirm, index } = props;

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        sx={{ textAlign: "left" }}
      >
        <DialogTitle id="delete-dialog-title">
          {"Delete Selected Question?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the selected question? The generated
            distractors will remain.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (index !== null) {
                handleConfirm(index);
              }
              handleClose();
            }}
            autoFocus
          >
            Delete Question
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default DeleteDialog;
