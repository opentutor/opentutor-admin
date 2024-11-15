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
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import LoadingIndicator from "components/loading-indicator";
import { useWithDownload } from "hooks/use-with-download";
import { ThemeProvider } from "@mui/material/styles";
import {
  Save as SaveIcon,
  Launch as LaunchIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Download,
  ArrowBackIosNew as BackIcon,
  ArrowForwardIos as ForwardIcon,
  IosShare as IosShareIcon,
  Assessment as AssessmentIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { buttonTheme } from "styles/sidebarTheme";
import {
  getTrainButtonColor,
  getLastTrainedAtString,
  DrawerHeader,
  Drawer,
} from "helpers/lessonsHelpers";
import { Lesson, LessonExpectation, TrainState } from "types";
import { validateExpectationFeatures } from "schemas/validation";
import SessionContext from "context/session";
import { ToastContainer, toast } from "react-toastify";
import { navigate } from "gatsby";
import { OPENAI_CLASSIFIER_ARCHITECTURE } from "admin-constants";
import { fetchLesson, updateLesson } from "api";
import { useWithTraining } from "hooks/use-with-training";

interface LessonUnderEdit {
  lesson?: Lesson;
  dirty?: boolean;
}

interface SideBarClasses {
  drawer: string;
  actionFooter: string;
}
export interface LessonEditSearch {
  lessonId: string;
  trainStatusPollInterval?: number;
  copyLesson?: string;
}

export function SideBar(props: {
  lessonId: string | "";
  lessonUnderEdit: LessonUnderEdit;
  error: string | "";
  cookies: { [key: string]: string };
  setLesson: (lesson?: Lesson, dirty?: boolean) => void;
  setLessonId: (value: string) => void;
  search: LessonEditSearch;
  classes: SideBarClasses;
}): JSX.Element {
  const {
    lessonId,
    lessonUnderEdit,
    error,
    cookies,
    setLesson,
    setLessonId,
    classes,
  } = props;
  const [savePopUp, setSavePopUp] = React.useState(false);

  const context = useContext(SessionContext);
  const {
    isDownloadable,
    isDownloading,
    downloadMessage,
    download,
    dismissDownloadMessage,
  } = useWithDownload(lessonId, context.user, cookies.accessToken);

  const {
    isTraining,
    trainStatus,
    trainingMessage,
    startLessonTraining,
    dismissTrainingMessage,
  } = useWithTraining(props.search.trainStatusPollInterval);

  React.useEffect(() => {
    if (trainStatus.state === TrainState.SUCCESS) {
      fetchLesson(lessonId ?? "", cookies.accessToken)
        .then((lesson) => {
          setLesson(lesson);
        })
        .catch((err) => console.error(err));
    }
  }, [trainStatus]);

  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerChange = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [shareOpen, setShareOpen] = React.useState(false);
  const handleClickOpenShare = () => {
    setShareOpen(true);
  };

  const handleCloseShare = () => {
    setShareOpen(false);
  };

  function isExpValid(exp: LessonExpectation): boolean {
    if (!exp.features) {
      return true;
    }
    return validateExpectationFeatures(exp.features);
  }

  function handleLaunch() {
    saveChanges();
    const host = process.env.TUTOR_ENDPOINT || location.origin;
    const guest = `&guest=${context.user?.name}`;
    const path = `${host}/tutor?lesson=${lessonId}&admin=true${guest}`;
    window.location.href = path;
  }
  function isLessonValid(): boolean {
    if (!lessonUnderEdit.lesson) {
      return false;
    }
    return (
      !error &&
      lessonUnderEdit.lesson.arch != OPENAI_CLASSIFIER_ARCHITECTURE &&
      lessonUnderEdit.lesson?.expectations.every((exp: LessonExpectation) =>
        isExpValid(exp)
      )
    );
  }

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

  function handleGrade(): void {
    navigate(`/sessions?lessonId=${lessonId}`);
  }

  function saveChanges(): void {
    if (!lessonUnderEdit.lesson) {
      return;
    }
    toast("Saving...");
    const convertedLesson: Lesson = { ...lessonUnderEdit.lesson };
    if (!lessonId) {
      convertedLesson.createdBy = context.user?.id || "";
    }
    const origId = lessonId || lessonUnderEdit.lesson?.lessonId;
    updateLesson(origId, convertedLesson, cookies.accessToken)
      .then((lesson) => {
        if (lesson) {
          setLesson(lesson);
        }

        if (lessonId !== lesson?.lessonId) {
          setLessonId(lesson.lessonId);
          navigate("/lessons");
        }
        toast("Success!");
      })
      .catch((err) => {
        toast("Failed to save lesson.");
        console.error(err);
      });
  }

  const host = process.env.TUTOR_ENDPOINT || location.origin;
  const lessonLink = `${host}/tutor?lesson=${lessonId}`;

  const lastTrainedString = getLastTrainedAtString(lessonUnderEdit);
  const trainAIButtonColor = getTrainButtonColor(trainStatus);

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
            <ThemeProvider theme={buttonTheme}>
              <ListItem>
                <Button
                  data-cy="launch-button"
                  variant="contained"
                  startIcon={<LaunchIcon />}
                  color="primary"
                  size="medium"
                  sx={{
                    minWidth: 0,
                    minHeight: 40,
                    ...(drawerOpen
                      ? { width: 200 }
                      : {
                          "& .MuiButton-endIcon": { margin: "0px" },
                        }),
                  }}
                  disabled={!lessonId || !isLessonValid()}
                  onClick={handleLaunch}
                >
                  {drawerOpen ? "Launch" : ""}
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  data-cy="grade-button"
                  variant="contained"
                  startIcon={<AssessmentIcon />}
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
                  onClick={handleGrade}
                  disabled={!lessonId}
                >
                  Grade
                </Button>
              </ListItem>
              <ListItem data-cy="train-data">
                <Button
                  data-cy="train-button"
                  variant={
                    trainAIButtonColor == "warning" ? "contained" : "outlined"
                  }
                  startIcon={<RefreshIcon />}
                  color={trainAIButtonColor}
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
                  disabled={isTraining || !lessonUnderEdit.lesson}
                  onClick={() => {
                    if (lessonUnderEdit.lesson) {
                      startLessonTraining(lessonUnderEdit.lesson);
                    }
                  }}
                >
                  {drawerOpen ? "TRAIN AI" : ""}
                </Button>
              </ListItem>
              <ListItem
                sx={{
                  marginTop: 0,
                  paddingTop: 0,
                  display: drawerOpen ? "flex" : "none",
                }}
              >
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>
                    <Typography variant="caption">
                      {`Last Trained: ${lastTrainedString}`}
                    </Typography>
                  </Grid>
                  <Divider />
                  <Grid item style={{ whiteSpace: "normal" }}>
                    {isTraining ? (
                      <LoadingIndicator />
                    ) : trainStatus.state === TrainState.SUCCESS ? (
                      <Grid container>
                        {trainStatus.info?.expectations?.map((x, i) => (
                          <Grid item key={`train-success-accuracy-${i}`}>
                            <Typography
                              style={{ textAlign: "center" }}
                              data-cy={`train-success-accuracy-${i}`}
                            >{`Expectation ${
                              i + 1
                            } Accuracy: ${x.accuracy.toFixed(2)}`}</Typography>
                          </Grid>
                        ))}
                      </Grid>
                    ) : trainStatus.state === TrainState.FAILURE ? (
                      <Typography data-cy="train-failure">{`Training Failed`}</Typography>
                    ) : null}
                  </Grid>
                </Grid>
              </ListItem>
            </ThemeProvider>
            <ListItem>
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
                disabled={!isLessonValid() || !lessonUnderEdit.dirty}
              >
                {drawerOpen ? "Save" : "Hello"}
              </Button>
            </ListItem>
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
            <ListItem>
              <Button
                data-cy="share-button"
                variant="contained"
                startIcon={<IosShareIcon />}
                color="info"
                disabled={!lessonId || !isLessonValid()}
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
                onClick={handleClickOpenShare}
              >
                {drawerOpen ? "Share" : ""}
              </Button>
              <Dialog
                onClose={handleCloseShare}
                open={shareOpen}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>Share Lesson</DialogTitle>
                <DialogContent
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <TextField
                    label="Lesson URL"
                    variant="filled"
                    value={lessonLink}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <IconButton
                          edge="end"
                          onClick={() => {
                            navigator.clipboard.writeText(lessonLink);
                            handleCloseShare();
                            toast("Link Copied!");
                          }}
                        >
                          {" "}
                          <ContentCopyIcon />{" "}
                        </IconButton>
                      ),
                    }}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseShare}>Close</Button>
                </DialogActions>
              </Dialog>
            </ListItem>
            <ListItem>
              {isDownloadable ? (
                <Button
                  data-cy="download-button"
                  variant="contained"
                  startIcon={<Download />}
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
                  onClick={download}
                  disabled={isDownloading}
                >
                  {drawerOpen ? "Download" : ""}
                </Button>
              ) : null}
            </ListItem>
          </List>
        </div>
      </Drawer>
      <Dialog open={Boolean(trainingMessage)} onClose={dismissTrainingMessage}>
        <DialogTitle>{trainingMessage}</DialogTitle>
      </Dialog>
      <Dialog open={Boolean(downloadMessage)} onClose={dismissDownloadMessage}>
        <DialogTitle>{downloadMessage}</DialogTitle>
      </Dialog>
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
      <ToastContainer />
    </Grid>
  );
}

export default SideBar;
