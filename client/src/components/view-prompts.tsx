/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useContext } from "react";

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
import CogenerationContext from "context/cogeneration";
export interface SimpleDialogProps {
  open: boolean;
  selectedPrompt: string;
  onClose: (value: string) => void;
  setSelectedPrompt: React.Dispatch<React.SetStateAction<string>>;
}

function ViewPrompts(props: SimpleDialogProps): JSX.Element {
  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }
  const { onClose, selectedPrompt, open, setSelectedPrompt } = props;

  const handleClose = () => {
    onClose(selectedPrompt);
  };

  const getDefaultValues = (type: string) => {
    if (type === "multipleChoice") {
      return { prompt: "", systemPrompt: "" };
    } else if (type === "lesson") {
      return {
        systemPrompt: "",
        humanPrompt: "",
        parseSystemPrompt: "",
        parseHumanPrompt: "",
        parseSystem2: "",
        parseHuman2: "",
        tabooSystemPrompt: "",
        tabooHumanPrompt: "",
        simulationSystemPrompt: "",
        simulationHumanPrompt: "",
        slotsSystemPrompt: "",
        slotsHumanPrompt: "",
        genericSystemPrompt: "",
        genericHumanPrompt: "",
        hintFilterSystemPrompt: "",
        hintFilterHumanPrompt: "",
        hintMockPrompt: "",
        patchSystemPrompt: "",
        patchHumanPrompt: "",
      };
    }
    return {};
  };

  let selectedSet = { title: "error", type: "error404" };

  if (context.generationData.genRecipe === "multipleChoice") {
    selectedSet = context.generationData.MCQPrompts.find(
      (pair) => pair.title === selectedPrompt
    ) || {
      title: "error",
      type: "error404",
      ...getDefaultValues("multipleChoice"),
    };
  } else {
    selectedSet = context.generationData.lessonPrompts.find(
      (pair) => pair.title === selectedPrompt
    ) || { title: "error", type: "error404", ...getDefaultValues("lesson") };
  }

  const renderTextFieldsFromObject = (fieldsObject: Record<string, string>) => {
    return Object.keys(fieldsObject).map((fieldKey) => (
      <TextField
        key={fieldKey}
        data-cy={`${fieldKey}-output`}
        label={fieldKey
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())}
        value={fieldsObject[fieldKey]}
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
    ));
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>
        {selectedPrompt === ""
          ? "Select set of prompts to view"
          : selectedSet.title}
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
            {context.generationData.lessonPrompts.map((pair, index) => (
              <ListItem disableGutters key={index}>
                <ListItemButton onClick={() => setSelectedPrompt(pair.title)}>
                  <ListItemText primary={pair.title} />
                </ListItemButton>
              </ListItem>
            ))}
            {context.generationData.MCQPrompts.map((pair, index) => (
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
          {renderTextFieldsFromObject(selectedSet)}

          <DialogActions>
            <Button onClick={() => setSelectedPrompt("")}>Back</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default ViewPrompts;
