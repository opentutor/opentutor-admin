/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
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
import {
  createTheme,
  ThemeProvider,
  styled,
  CSSObject,
  Theme,
} from "@mui/material/styles";
import {
  Save as SaveIcon,
  Launch as LaunchIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Download,
  ArrowBackIosNew as BackIcon,
  ArrowForwardIos as ForwardIcon,
  IosShare as IosShareIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import MuiDrawer from "@mui/material/Drawer";

import { Lesson, LessonExpectation, TrainState } from "types";
import { validateExpectationFeatures } from "schemas/validation";
import SessionContext from "context/session";
import { ToastContainer, toast } from "react-toastify";
import { navigate } from "gatsby";
import { OPENAI_CLASSIFIER_ARCHITECTURE } from "admin-constants";
import { fetchLesson, updateLesson } from "api";
import { useWithTraining } from "hooks/use-with-training";
declare module "@mui/material/styles" {
  interface Palette {
    primary: Palette["primary"];
    secondary: Palette["primary"];
    error: Palette["primary"];
    warning: Palette["primary"];
    success: Palette["primary"];
  }

  interface PaletteOptions {
    primary?: PaletteOptions["primary"];
    secondary?: PaletteOptions["primary"];
    error?: PaletteOptions["primary"];
    warning?: PaletteOptions["primary"];
    success?: PaletteOptions["primary"];
  }
}

const buttonTheme = createTheme({
  palette: {
    primary: {
      main: "#0C60AD",
    },
    secondary: {
      main: "#000000",
    },
    warning: {
      main: "#FFFF00",
      contrastText: "#000000",
    },
    success: {
      main: "#008000",
    },
    error: {
      main: "#FF0000",
    },
  },
});

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

  const drawerWidth = 240;
  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerChange = () => {
    setDrawerOpen(!drawerOpen);
    console.log("button clicked");
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

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
          // window.location.href = `/lessons/edit?lessonId=${lesson.lessonId}`;
          setLessonId(lesson.lessonId);
          // window.location.reload();
          navigate("/lessons");
        }
        toast("Success!");
      })
      .catch((err) => {
        toast("Failed to save lesson.");
        console.error(err);
      });
  }

  const trainAIButtonColor =
    trainStatus.state !== TrainState.SUCCESS &&
    trainStatus.state !== TrainState.FAILURE
      ? "secondary"
      : trainStatus.state === TrainState.FAILURE
      ? "error"
      : !(
          trainStatus.info &&
          trainStatus.info?.expectations &&
          Array.isArray(trainStatus.info?.expectations) &&
          trainStatus.info.expectations.length > 0
        )
      ? "error"
      : Math.min(...trainStatus.info?.expectations.map((x) => x.accuracy)) >=
        0.6
      ? "success"
      : Math.min(...trainStatus.info?.expectations.map((x) => x.accuracy)) >=
        0.4
      ? "warning"
      : "error";

  const host = process.env.TUTOR_ENDPOINT || location.origin;
  const lessonLink = `${host}/tutor?lesson=${lessonId}`;

  let lastTrainedString = "Never";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (lessonUnderEdit.lesson?.lastTrainedAt) {
    const lastTrained = new Date(lessonUnderEdit.lesson?.lastTrainedAt);
    const isAM = lastTrained.getHours() < 12;
    let hours = lastTrained.getHours() % 12;
    if (hours == 0) {
      hours = 12;
    }
    lastTrainedString = `${
      months[lastTrained.getMonth()]
    } ${lastTrained.getDate()}, ${lastTrained.getUTCFullYear()}, at ${hours}:${lastTrained.getMinutes()} ${
      isAM ? "am" : "pm"
    }`; //January 12, 2022, at 3:45 pm
  }

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
            <ListItem sx={{ display: lessonUnderEdit.dirty ? "flex" : "none" }}>
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
                disabled={!isLessonValid()}
              >
                {drawerOpen ? "Save" : ""}
              </Button>
            </ListItem>
            <ThemeProvider theme={buttonTheme}>
              <ListItem>
                <Button
                  data-cy="launch-button"
                  variant="contained"
                  endIcon={<LaunchIcon />}
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
                  data-cy="share-button"
                  variant="contained"
                  startIcon={<IosShareIcon />}
                  color="info"
                  size="medium"
                  disabled={!lessonId || !isLessonValid()}
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
              {isDownloadable ? (
                <Button
                  data-cy="download-button"
                  variant="contained"
                  startIcon={<Download />}
                  color="primary"
                  size="large"
                  onClick={download}
                  disabled={isDownloading}
                >
                  Download
                </Button>
              ) : null}
            </ListItem>
          </List>
        </div>
      </Drawer>
      <div className={classes.actionFooter}>
        {isDownloadable ? (
          <Button
            data-cy="download-button"
            variant="contained"
            startIcon={<Download />}
            color="primary"
            size="large"
            onClick={download}
            disabled={isDownloading}
          >
            Download
          </Button>
        ) : null}
      </div>
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
