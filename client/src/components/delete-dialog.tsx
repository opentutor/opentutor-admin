

import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";


export function DeleteDialog(props:{
  open: boolean;
  handleClose:  () => void;
  handleConfirm: (index: number) => void;
  index: number | null;
}): JSX.Element {
  const {open, handleClose, handleConfirm, index} = props;

  return (
    <React.Fragment >
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        sx={{textAlign:"left"}}
      >
        <DialogTitle id="delete-dialog-title">
          {"Delete Selected Question?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the selected question? The generated distractors will remain.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={() => {
              if (index !== null) {
                handleConfirm(index);
              }
              handleClose();}} 
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
