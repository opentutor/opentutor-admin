/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { navigate } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { fetchLesson, updateLesson, userCanEdit, fetchLessons } from "api";
import SessionContext from "context/session";
import NavBar from "components/nav-bar";
import ConclusionsList from "components/conclusions-list";
import ExpectationsList from "components/expectations-list";
import { validateExpectationFeatures } from "schemas/validation";
import { Lesson, LessonExpectation, MediaType, TrainState } from "types";
import withLocation from "wrap-with-location";
import { useWithTraining } from "hooks/use-with-training";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";
import "react-toastify/dist/ReactToastify.css";
import { StringParam, useQueryParam } from "use-query-params";
import LoadingIndicator from "components/loading-indicator";
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Launch as LaunchIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Download,
} from "@mui/icons-material";
import { Location } from "@reach/router";
import { useWithDownload } from "hooks/use-with-download";

const useStyles = makeStyles((theme: Theme) => ({
  cardRoot: {
    width: "100%",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  list: {
    background: "#F5F5F5",
    borderRadius: 10,
  },
  listDragging: {
    background: "lightblue",
    borderRadius: 10,
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  container: {
    maxHeight: 440,
  },
  input: {
    "&:invalid": {
      border: "red solid 2px",
    },
  },
  image: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    boxSizing: "border-box",
    height: 56,
    padding: 5,
  },
  video: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputForm: {},
  selectForm: {
    width: "100%",
  },
  divider: {
    marginTop: 25,
    marginBottom: 25,
  },
  actionFooter: {
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
}));

const newLesson: Lesson = {
  lessonId: uuid(),
  arch: "opentutor_classifier.lr2",
  name: "Display name for the lesson",
  intro:
    "Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'",
  dialogCategory: "default",
  question:
    "Question the student needs to answer, e.g. 'What are the colors in RGB?'",
  conclusion: [
    "Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'",
  ],
  expectations: [
    {
      expectation: "Add a short ideal answer for an expectation, e.g. 'Red'",
      expectationId: uuid().toString(),
      hints: [
        {
          text: "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
        },
      ],
      features: {},
    },
  ],
  createdAt: "",
  createdBy: "",
  createdByName: "",
  media: undefined,
  learningFormat: "default",
  features: {},
  lastTrainedAt: "",
  updatedAt: "",
};

interface LessonUnderEdit {
  lesson?: Lesson;
  dirty?: boolean;
}

export interface LessonEditSearch {
  lessonId: string;
  trainStatusPollInterval?: number;
  copyLesson?: string;
}

const LessonEdit = (props: {
  search: LessonEditSearch;
  location: Location;
}) => {
  const [lessonId, setLessonId] = useQueryParam("lessonId", StringParam);
  const [copyLesson] = useQueryParam("copyLesson", StringParam);

  const classes = useStyles();
  const [cookies] = useCookies(["accessToken"]);
  const context = useContext(SessionContext);
  const [lessonUnderEdit, setLessonUnderEdit] = React.useState<LessonUnderEdit>(
    { lesson: undefined, dirty: false }
  );
  const [error, setError] = React.useState("");
  const [savePopUp, setSavePopUp] = React.useState(false);
  const {
    isTraining,
    trainStatus,
    trainingMessage,
    startLessonTraining,
    dismissTrainingMessage,
  } = useWithTraining(props.search.trainStatusPollInterval);
  const {
    isDownloadable,
    isDownloading,
    downloadMessage,
    download,
    dismissDownloadMessage,
  } = useWithDownload(lessonId, context.user, cookies.accessToken);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!lessonUnderEdit.lesson || mounted) {
      return;
    }
    window.scrollTo(0, 0);
    setMounted(true);
  }, [lessonUnderEdit.lesson]);

  React.useEffect(() => {
    if (lessonId) {
      fetchLesson(lessonId, cookies.accessToken)
        .then((lesson: Lesson) => {
          setLesson(lesson);
        })
        .catch((err: string) => console.error(err));
    } else if (copyLesson) {
      fetchLesson(copyLesson, cookies.accessToken)
        .then((lesson: Lesson) => {
          setLessonUnderEdit({
            lesson: {
              ...lesson,
              lessonId: uuid(),
              name: `Copy of ${lesson.name}`,
              createdByName: context.user?.name || "",
            },
            dirty: true,
          });
        })
        .catch((err: string) => console.error(err));
    } else {
      setLesson({
        ...newLesson,
        createdByName: context.user?.name || "",
      });
    }
  }, [context.user]);

  React.useEffect(() => {
    if (!lessonUnderEdit.lesson) {
      return;
    }
    const id = lessonUnderEdit.lesson.lessonId;
    if (!/^[a-z0-9-]+$/g.test(id)) {
      setError("id must be lower-case and alpha-numeric.");
    } else if (lessonId !== id) {
      fetchLessons({ lessonId: id }, 1, "", "", true, cookies.accessToken)
        .then((lessons) => {
          if (lessons && lessons.edges.length > 0) {
            setError("id is already being used for another lesson.");
          } else {
            setError("");
          }
        })
        .catch((err) => console.error(err));
    } else {
      setError("");
    }
  }, [lessonUnderEdit.lesson]);

  React.useEffect(() => {
    if (trainStatus.state === TrainState.SUCCESS) {
      fetchLesson(lessonId ?? "", cookies.accessToken)
        .then((lesson) => {
          setLesson(lesson);
        })
        .catch((err) => console.error(err));
    }
  }, [trainStatus]);

  function setLesson(lesson?: Lesson, dirty?: boolean) {
    if (lessonUnderEdit.lesson?.lessonId !== lesson?.lessonId) {
      setError("verifying lesson id...");
    }
    setLessonUnderEdit({ lesson, dirty });
  }

  function isExpValid(exp: LessonExpectation): boolean {
    if (!exp.features) {
      return true;
    }
    return validateExpectationFeatures(exp.features);
  }

  function isLessonValid(): boolean {
    if (!lessonUnderEdit.lesson) {
      return false;
    }
    return (
      !error &&
      lessonUnderEdit.lesson?.expectations.every((exp: LessonExpectation) =>
        isExpValid(exp)
      )
    );
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

        if (lessonId !== lesson.lessonId) {
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

  function handleLaunch() {
    saveChanges();
    const host = process.env.TUTOR_ENDPOINT || location.origin;
    const guest = `&guest=${context.user?.name}`;
    const path = `${host}/tutor?lesson=${lessonId}&admin=true${guest}`;
    window.location.href = path;
  }

  function handleDiscard() {
    navigate(`/lessons`);
  }

  interface Prop {
    name: string;
    value: string;
  }

  function getProp(props: Array<Prop>, key: string): string {
    return props.find((p) => p.name === key)?.value || "";
  }

  function copyAndSetProp(props: Array<Prop>, prop: Prop): Array<Prop> {
    const pix = props.findIndex((p) => p.name === prop.name);
    if (pix >= 0) {
      return props.map((existing, i) => {
        if (i === pix) {
          return prop;
        } else {
          return existing;
        }
      });
    } else {
      return [...props, prop];
    }
  }

  if (!lessonUnderEdit.lesson) {
    return <LoadingIndicator />;
  }

  if (lessonId && !userCanEdit(lessonUnderEdit.lesson, context.user)) {
    return <div>You do not have permission to view this lesson.</div>;
  }

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
    <div
      style={{
        padding: 10,
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 1000,
        margin: "auto",
      }}
    >
      <form noValidate autoComplete="off">
        <Grid
          container
          data-cy="lesson-edit-grid"
          spacing={2}
          style={{ marginTop: 10 }}
        >
          <Grid item xs={12} md={6}>
            <TextField
              data-cy="lesson-name"
              label="Lesson Name"
              placeholder="Display name for the lesson"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              value={lessonUnderEdit.lesson?.name || ""}
              onChange={(e) => {
                setLesson(
                  {
                    ...(lessonUnderEdit.lesson || newLesson),
                    name: e.target.value || "",
                  },
                  true
                );
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              data-cy="lesson-id"
              label="Lesson ID"
              placeholder="Unique alias to the lesson"
              fullWidth
              multiline
              error={error !== ""}
              helperText={error}
              InputLabelProps={{
                shrink: true,
              }}
              value={lessonUnderEdit.lesson?.lessonId || ""}
              onChange={(e) => {
                setLesson(
                  {
                    ...(lessonUnderEdit.lesson || newLesson),
                    lessonId: e.target.value || "",
                  },
                  true
                );
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              data-cy="lesson-creator"
              label="Created By"
              placeholder="Guest"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={lessonUnderEdit.lesson?.createdByName || "Guest"}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl className={classes.selectForm} variant="outlined">
              <InputLabel
                shrink
                id="dialog-category-label"
                key="Confirmation Code"
              >
                Dialog Category
              </InputLabel>
              <Select
                labelId="dialog-category-label"
                value={lessonUnderEdit.lesson?.dialogCategory || "NOT SET"}
                onChange={(e: SelectChangeEvent<string>) => {
                  setLesson(
                    {
                      ...(lessonUnderEdit.lesson || newLesson),
                      dialogCategory: (e.target.value as string) || "",
                    },
                    true
                  );
                }}
              >
                <MenuItem value={"default"}>Default</MenuItem>
                <MenuItem value={"sensitive"}>Sensitive</MenuItem>
              </Select>
              {/*<FormHelperText>Select a Dialog Type</FormHelperText>*/}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl className={classes.selectForm} variant="outlined">
              <InputLabel shrink id="lesson-format-label">
                Lesson Format
              </InputLabel>
              <Select
                data-cy="lesson-format"
                labelId="lesson-format-label"
                value={lessonUnderEdit.lesson?.learningFormat || "default"}
                onChange={(e: SelectChangeEvent<string>) => {
                  setLesson(
                    {
                      ...(lessonUnderEdit.lesson || newLesson),
                      learningFormat: (e.target.value as string) || "default",
                    },
                    true
                  );
                }}
              >
                <MenuItem value={"default"}>Default</MenuItem>
                <MenuItem value={"surveySays"}>Survey Says</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              data-cy="intro"
              label="Introduction"
              placeholder="Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'"
              multiline
              maxRows={4}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={lessonUnderEdit.lesson?.intro || ""}
              onChange={(e) => {
                setLesson(
                  {
                    ...(lessonUnderEdit.lesson || newLesson),
                    intro: e.target.value || "",
                  },
                  true
                );
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              data-cy="question"
              label="Question"
              placeholder="Question the student needs to answer, e.g. 'What are the colors in RGB?'"
              multiline
              maxRows={4}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={lessonUnderEdit.lesson?.question || ""}
              onChange={(e) => {
                setLesson(
                  {
                    ...(lessonUnderEdit.lesson || newLesson),
                    question: e.target.value || "",
                  },
                  true
                );
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.selectForm} variant="outlined">
              <InputLabel shrink id="media-label">
                Media Type
              </InputLabel>
              <Select
                labelId="media-label"
                data-cy="media-type"
                value={
                  lessonUnderEdit.lesson.media
                    ? lessonUnderEdit.lesson.media.type
                    : MediaType.NONE
                }
                onChange={(e: SelectChangeEvent<string>) => {
                  if ((e.target.value as string) === MediaType.VIDEO) {
                    setLesson(
                      {
                        ...(lessonUnderEdit.lesson || newLesson),
                        media: {
                          type: (e.target.value as string) || "",
                          url: "",
                          props: [
                            { name: "start", value: "0" },
                            {
                              name: "end",
                              value: String(Number.MAX_SAFE_INTEGER),
                            },
                          ],
                        },
                      },
                      true
                    );
                  } else if ((e.target.value as string) === MediaType.IMAGE) {
                    setLesson(
                      {
                        ...(lessonUnderEdit.lesson || newLesson),
                        media: {
                          type: (e.target.value as string) || "",
                          url: "",
                          props: undefined,
                        },
                      },
                      true
                    );
                  } else {
                    setLesson(
                      {
                        ...(lessonUnderEdit.lesson || newLesson),
                        media: null,
                      },
                      true
                    );
                  }
                }}
              >
                <MenuItem data-cy="media-none" value={MediaType.NONE}>
                  None
                </MenuItem>
                <MenuItem data-cy="media-image" value={MediaType.IMAGE}>
                  Image
                </MenuItem>
                <MenuItem data-cy="media-video" value={MediaType.VIDEO}>
                  Video
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {lessonUnderEdit.lesson.media &&
          lessonUnderEdit.lesson.media.type === MediaType.IMAGE ? (
            <Grid item xs={12}>
              <div className={classes.image}>
                <TextField
                  data-cy="image"
                  label="Image"
                  placeholder="Image URL"
                  required
                  multiline
                  maxRows={4}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={lessonUnderEdit.lesson.media.url || ""}
                  onChange={(e) => {
                    setLesson(
                      {
                        ...(lessonUnderEdit.lesson || newLesson),
                        media: {
                          ...(lessonUnderEdit.lesson || newLesson).media,
                          type: MediaType.IMAGE,
                          url: (e.target.value as string) || "",
                        },
                      },
                      true
                    );
                  }}
                  variant="outlined"
                />
                <img
                  className={classes.thumbnail}
                  data-cy="image-thumbnail"
                  src={lessonUnderEdit.lesson.media.url}
                  onClick={() => {
                    window.open(
                      lessonUnderEdit.lesson?.media?.url || "",
                      "_blank"
                    );
                  }}
                />
              </div>
            </Grid>
          ) : (
            <></>
          )}
          {lessonUnderEdit.lesson.media &&
          lessonUnderEdit.lesson.media.type === MediaType.VIDEO ? (
            <>
              <Grid item xs={12}>
                <TextField
                  data-cy="video-url"
                  label="Video"
                  placeholder="YouTube Video URL"
                  required
                  multiline
                  maxRows={4}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={lessonUnderEdit.lesson.media.url || ""}
                  onChange={(e) => {
                    setLesson(
                      {
                        ...(lessonUnderEdit.lesson || newLesson),
                        media: {
                          ...(lessonUnderEdit.lesson || newLesson).media,
                          type: MediaType.VIDEO,
                          url: (e.target.value as string) || "",
                        },
                      },
                      true
                    );
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  // TODO: With MUI v5 We can dimply do: rowSpacing={2}
                  direction={"row"}
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <TextField
                      data-cy="video-start"
                      label="Video Start Time"
                      placeholder="0.0"
                      type="number"
                      required
                      multiline
                      maxRows={1}
                      // style={{ width: "50%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      value={
                        lessonUnderEdit.lesson.media &&
                        lessonUnderEdit.lesson.media.props
                          ? parseFloat(
                              getProp(
                                lessonUnderEdit.lesson.media.props,
                                "start"
                              )
                            ) || 0
                          : 0
                      }
                      onChange={(e) => {
                        setLesson(
                          {
                            ...(lessonUnderEdit.lesson || newLesson),
                            media: {
                              url: lessonUnderEdit.lesson?.media?.url || "",
                              type: MediaType.VIDEO,
                              props: copyAndSetProp(
                                (lessonUnderEdit.lesson || newLesson).media
                                  ?.props || [],
                                {
                                  name: "start",
                                  value:
                                    String(parseFloat(e.target.value) || 0) ||
                                    "",
                                }
                              ),
                            },
                          },
                          true
                        );
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      data-cy="video-end"
                      label="Video End Time"
                      placeholder="180.0"
                      type="number"
                      required
                      multiline
                      fullWidth
                      maxRows={1}
                      // style={{ width: "50%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={
                        lessonUnderEdit.lesson.media &&
                        lessonUnderEdit.lesson.media.props
                          ? parseFloat(
                              getProp(lessonUnderEdit.lesson.media.props, "end")
                            ) || Number.MAX_SAFE_INTEGER
                          : Number.MAX_SAFE_INTEGER
                      }
                      onChange={(e) => {
                        setLesson(
                          {
                            ...(lessonUnderEdit.lesson || newLesson),
                            media: {
                              url: lessonUnderEdit.lesson?.media?.url || "",
                              type: MediaType.VIDEO,
                              props: copyAndSetProp(
                                (lessonUnderEdit.lesson || newLesson).media
                                  ?.props || [],
                                {
                                  name: "end",
                                  value:
                                    String(
                                      parseFloat(e.target.value) ||
                                        Number.MAX_SAFE_INTEGER
                                    ) || "",
                                }
                              ),
                            },
                          },
                          true
                        );
                      }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <ExpectationsList
          classes={classes}
          lessonId={lessonId ?? ""}
          expectations={lessonUnderEdit.lesson?.expectations}
          updateExpectations={(exp: LessonExpectation[]) =>
            setLesson(
              {
                ...(lessonUnderEdit.lesson || newLesson),
                expectations: exp,
              },
              true
            )
          }
        />
        <Divider variant="middle" className={classes.divider} />
        <ConclusionsList
          classes={classes}
          conclusions={lessonUnderEdit.lesson?.conclusion}
          updateConclusions={(conclusions: string[]) =>
            setLesson(
              {
                ...(lessonUnderEdit.lesson || newLesson),
                conclusion: conclusions,
              },
              true
            )
          }
        />
      </form>
      <Box
        data-cy="train-data"
        border={5}
        borderRadius={16}
        borderColor={
          trainStatus.state !== TrainState.SUCCESS &&
          trainStatus.state !== TrainState.FAILURE
            ? "#000000"
            : trainStatus.state === TrainState.FAILURE
            ? "#FF0000"
            : !(
                trainStatus.info &&
                trainStatus.info?.expectations &&
                Array.isArray(trainStatus.info?.expectations) &&
                trainStatus.info.expectations.length > 0
              )
            ? "#FF0000"
            : Math.min(
                ...trainStatus.info?.expectations.map((x) => x.accuracy)
              ) >= 0.6
            ? "#008000"
            : Math.min(
                ...trainStatus.info?.expectations.map((x) => x.accuracy)
              ) >= 0.4
            ? "#FFFF00"
            : "#FF0000"
        }
      >
        <Typography variant="h5">Training Data</Typography>
        <Typography variant="caption">
          {`Last Trained: ${lastTrainedString}`}
        </Typography>
        <Divider />
        {isTraining ? (
          <LoadingIndicator />
        ) : trainStatus.state === TrainState.SUCCESS ? (
          <List>
            {trainStatus.info?.expectations?.map((x, i) => (
              <ListItem key={`train-success-accuracy-${i}`}>
                <ListItemText
                  style={{ textAlign: "center" }}
                  data-cy={`train-success-accuracy-${i}`}
                >{`Expectation ${i + 1} Accuracy: ${x.accuracy.toFixed(
                  2
                )}`}</ListItemText>
              </ListItem>
            ))}
          </List>
        ) : trainStatus.state === TrainState.FAILURE ? (
          <Typography data-cy="train-failure">{`Training Failed`}</Typography>
        ) : null}
      </Box>
      <Divider variant="middle" className={classes.divider} />
      <div className={classes.actionFooter}>
        <Button
          data-cy="discard-button"
          variant="contained"
          startIcon={lessonUnderEdit.dirty ? <DeleteIcon /> : <ArrowBackIcon />}
          size="large"
          color="primary"
          style={
            lessonUnderEdit.dirty
              ? { backgroundColor: "red" }
              : { backgroundColor: "#1B6A9C" }
          }
          onClick={handleDiscard}
        >
          {lessonUnderEdit.dirty ? "Discard" : "Back"}
        </Button>
        <Button
          data-cy="train-button"
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          size="large"
          style={{
            background: lessonUnderEdit.lesson?.isTrainable
              ? "#1B6A9C"
              : "#808080",
          }}
          disabled={isTraining || !lessonUnderEdit.lesson}
          onClick={() => {
            if (lessonUnderEdit.lesson) {
              startLessonTraining(lessonUnderEdit.lesson);
            }
          }}
        >
          Train
        </Button>
        <Button
          data-cy="launch-button"
          variant="contained"
          endIcon={<LaunchIcon />}
          color="primary"
          size="large"
          disabled={!lessonId || !isLessonValid()}
          onClick={handleLaunch}
        >
          Launch
        </Button>
        {lessonUnderEdit.dirty ? (
          <Button
            data-cy="save-button"
            variant="contained"
            startIcon={<SaveIcon />}
            color="primary"
            size="large"
            onClick={() => handleSavePopUp(true)}
            disabled={!isLessonValid()}
          >
            Save
          </Button>
        ) : null}
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
    </div>
  );
};

function EditPage(props: {
  search: LessonEditSearch;
  location: Location;
}): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view lesson.</div>;
  }
  if (!context.user) {
    return <LoadingIndicator />;
  }
  return (
    <div>
      <NavBar title="Edit Lesson" />
      <LessonEdit search={props.search} location={props.location} />
    </div>
  );
}

export default withLocation(EditPage);
