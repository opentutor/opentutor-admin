/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
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
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}
interface LogPair {
  title: string;
  type: string;
  call: string;
  response: string;
}
function CallResponseLog(props: SimpleDialogProps): JSX.Element {
  const [logPairs, setLogPairs] = React.useState<LogPair[]>([]);

  const { onClose, selectedValue, open, setSelectedValue } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const selectedPair = logPairs.find(
    (pair) => pair.title === selectedValue
  ) || { title: "error", type: "error404", call: "", response: "" };
  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>
        {selectedValue === ""
          ? "Select call & response pair"
          : selectedPair.title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      {selectedValue == "" ? (
        <>
          <List sx={{ pt: 0 }}>
            {logPairs.map((pair, index) => (
              <ListItem disableGutters key={index}>
                <ListItemButton onClick={() => setSelectedValue(pair.title)}>
                  <ListItemText primary={pair.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <>
          <TextField
            data-cy="call-output"
            label="Call"
            value={selectedPair.call}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            rows={1}
            sx={{ margin: 2 }}
          />
          <TextField
            data-cy="response-output"
            label="Response"
            value={selectedPair.response}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            rows={1}
            sx={{ margin: 2 }}
          />
          <DialogActions>
            <Button onClick={() => setSelectedValue("")}>Back</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default CallResponseLog;
