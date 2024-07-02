/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
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
  selectedPrompt: string;
  onClose: (value: string) => void;
  setSelectedPrompt: React.Dispatch<React.SetStateAction<string>>;
}

function ViewPrompts(props: SimpleDialogProps): JSX.Element {
  const [promptPairs, setPromptPairs] = React.useState([
    {
      title: "1st Q&A Generation",
      type: "Q&A",
      prompt:
        "You are to look at this data and come up with a question and an answer, and a optional learning objective related to this data.\nHere is the data: {data}",
      systemPrompt:
        'You are a system assisting a human in coming up with {n_questions} questions, and answers pairs (therefore the question list must be equal to the corrects list) with optional learning objectives for given data.\nYour response must be in JSON.\nFormat your response like this:\n{\n\t"question": [\n\t\t"question_1",\n\t\t"question_2",\n\t\t"question_3"\n\t\t...\n\t]\n}\nPlease only response in JSON. Validate that your response is in JSON. Do not include any JSON markdown, only JSON data.',
    },
    {
      title: "1st Distractor Generation",
      type: "Distrator",
      prompt: "Hello",
      systemPrompt: "Hi there!",
    },
    {
      title: "1st Distractor Generation",
      type: "Distractor",
      prompt: "How are you?",
      systemPrompt: "I am fine, thank you!",
    },
  ]);
  const { onClose, selectedPrompt, open, setSelectedPrompt } = props;

  const handleClose = () => {
    onClose(selectedPrompt);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const selectedPair = promptPairs.find(
    (pair) => pair.title === selectedPrompt
  ) || { title: "error", type: "error404", prompt: "", systemPrompt: "" };
  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>
        {selectedPrompt === ""
          ? "Select set of prompts to view"
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
      {selectedPrompt == "" ? (
        <>
          <List sx={{ pt: 0 }}>
            {promptPairs.map((pair, index) => (
              <ListItem disableGutters key={index}>
                <ListItemButton onClick={() => setSelectedPrompt(pair.title)}>
                  <ListItemText primary={pair.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <>
          <TextField
            data-cy="prompt-output"
            label="Prompt"
            value={selectedPair.prompt}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            minRows={1}
            maxRows={10}
            sx={{ margin: 2 }}
          />
          <TextField
            data-cy="system-prompt-output"
            label="System Prompt"
            value={selectedPair.systemPrompt}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            minRows={1}
            maxRows={10}
            sx={{ margin: 2 }}
          />
          <DialogActions>
            <Button onClick={() => setSelectedPrompt("")}>Back</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default ViewPrompts;
