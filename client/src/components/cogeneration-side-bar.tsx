/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import CallResponseLog from "./call-response-log";
import ViewPrompts from "./view-prompts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ArrowBackIosNew as BackIcon,
  ArrowForwardIos as ForwardIcon,
  ReceiptLong as ReceiptLongIcon,
  RateReview as RateReviewIcon,
} from "@mui/icons-material";
import { DrawerHeader, Drawer } from "helpers/lessonsHelpers";

import { ToastContainer, toast } from "react-toastify";
import { navigate } from "gatsby";

interface SideBarClasses {
  drawer: string;
  actionFooter: string;
  button: string;
}
import CogenerationContext from "context/cogeneration";

export function CogenerationSideBar(props: {
  classes: SideBarClasses;
}): JSX.Element {
  const { classes } = props;
  const [savePopUp, setSavePopUp] = React.useState(false);
  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }

  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerChange = () => {
    setDrawerOpen(!drawerOpen);
  };

  function handleDiscard() {
    navigate(`/lessons`);
  }

  function handleSavePopUp(open: boolean): void {
    setSavePopUp(open);
  }

  function handleSaveExit(): void {
    saveChanges();
    navigate(`/lessons`);
  }

  function handleSaveContinue(): void {
    saveChanges();
    handleSavePopUp(false);
  }

  function saveChanges(): void {
    toast("Saving...");
    toast("Success!");
  }

  const [logProperties, setLogProperties] = React.useState({
    openLog: false,
    selectedLog: "",
  });
  const [promptProperties, setPromptProperties] = React.useState({
    openPrompt: false,
    selectedPrompt: "",
  });

  const handleClickOpenLog = () => {
    setLogProperties((prev) => {
      return {
        ...prev,
        openLog: true,
      };
    });
  };
  const handleClickOpenPrompts = () => {
    setPromptProperties((prev) => {
      return {
        ...prev,
        openPrompt: true,
      };
    });
  };

  const handleSelectedPrompt = (prompt: string) => {
    setPromptProperties((prev) => {
      return {
        ...prev,
        selectedPrompt: prompt,
      };
    });
  };
  const handleSelectedLog = (log: string) => {
    setLogProperties((prev) => {
      return {
        ...prev,
        selectedLog: log,
      };
    });
  };
  const handleClosePrompts = () => {
    setPromptProperties({
      openPrompt: false,
      selectedPrompt: "",
    });
  };

  const handleCloseLog = () => {
    setLogProperties({
      openLog: false,
      selectedLog: "",
    });
  };

  return (
    <Grid item>
      <Drawer className={classes.drawer} variant="permanent" open={drawerOpen}>
        <div style={{ marginTop: 70 }}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerChange}>
              {drawerOpen ? <BackIcon /> : <ForwardIcon />}
            </IconButton>
          </DrawerHeader>
          <List>
            <ListItem>
              <Button
                data-cy="discard-button"
                variant="contained"
                startIcon={<ArrowBackIcon />}
                size="medium"
                color="primary"
                sx={{
                  minWidth: 0,
                  minHeight: 40,
                  ...(drawerOpen
                    ? { width: 200 }
                    : {
                        "& .MuiButton-startIcon": { margin: "0px" },
                      }),
                }}
                onClick={handleDiscard}
              >
                {drawerOpen ? "Back" : ""}
              </Button>
            </ListItem>
            <ListItem sx={{ display: "flex" }}>
              <Button
                data-cy="save-button"
                variant="contained"
                startIcon={<SaveIcon />}
                color="primary"
                size="medium"
                sx={{
                  minWidth: 0,
                  minHeight: 40,
                  ...(drawerOpen
                    ? { width: 200 }
                    : {
                        "& .MuiButton-startIcon": { margin: "0px" },
                      }),
                }}
                onClick={() => handleSavePopUp(true)}
              >
                {drawerOpen ? "Save" : ""}
              </Button>
            </ListItem>
            <ListItem>
              <Button
                data-cy="response-log-button"
                className={classes.button}
                variant="contained"
                startIcon={<ReceiptLongIcon />}
                color="info"
                size="medium"
                sx={{
                  minWidth: 0,
                  minHeight: 40,
                  ...(drawerOpen
                    ? { width: 200 }
                    : {
                        "& .MuiButton-startIcon": { margin: "0px" },
                      }),
                }}
                onClick={handleClickOpenLog}
                disabled={!context.generationData.enablePromptsLog}
              >
                {drawerOpen ? "API Log" : ""}
              </Button>
            </ListItem>
            <ListItem>
              <Button
                data-cy="view-prompts"
                className={classes.button}
                startIcon={<RateReviewIcon />}
                color="info"
                variant="outlined"
                sx={{
                  minWidth: 0,
                  minHeight: 40,
                  ...(drawerOpen
                    ? { width: 200 }
                    : {
                        "& .MuiButton-startIcon": { margin: "0px" },
                      }),
                }}
                onClick={handleClickOpenPrompts}
                disabled={!context.generationData.enablePromptsLog}
              >
                {drawerOpen ? " View Prompts" : ""}
              </Button>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <Dialog open={savePopUp} onClose={() => handleSavePopUp(false)}>
        <DialogTitle>Save</DialogTitle>
        <DialogActions>
          <Button data-cy="save-exit" onClick={handleSaveExit} color="primary">
            Exit
          </Button>
          <Button
            data-cy="save-continue"
            onClick={handleSaveContinue}
            color="primary"
            variant="contained"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <CallResponseLog
        selectedValue={logProperties.selectedLog}
        open={logProperties.openLog}
        onClose={handleCloseLog}
        setSelectedValue={handleSelectedLog}
      />
      <ViewPrompts
        selectedPrompt={promptProperties.selectedPrompt}
        open={promptProperties.openPrompt}
        onClose={handleClosePrompts}
        setSelectedPrompt={handleSelectedPrompt}
      />
      <ToastContainer />
    </Grid>
  );
}

export default CogenerationSideBar;
