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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { fetchLesson, updateLesson, userCanEdit, fetchLessons } from "api";
import SessionContext from "context/session";
import NavBar from "components/nav-bar";
import ConclusionsList from "components/conclusions-list";
import ExpectationsList from "components/expectations-list";
import { validateExpectationFeatures } from "schemas/validation";
import { Lesson, LessonExpectation, TrainState } from "types";
import withLocation from "wrap-with-location";
import { useWithTraining } from "hooks/use-with-training";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";
import "react-toastify/dist/ReactToastify.css";
import { WindowLocation } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "100ch",
    },
    "& > *": {
      borderBottom: "unset",
    },
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
  },
  listDragging: {
    background: "lightgreen",
  },
  button: {
    margin: theme.spacing(2),
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
    padding: 10,
  },
  progress: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const newLesson: Lesson = {
  lessonId: uuid(),
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
  image: "",
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
  location: WindowLocation<unknown>;
}) => {
  const { lessonId, copyLesson } = props.search;

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
      fetchLesson(lessonId, cookies.accessToken)
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
          window.location.href = `/lessons/edit?lessonId=${lesson.lessonId}`;
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

  if (!lessonUnderEdit.lesson) {
    return <CircularProgress className={classes.progress} />;
  }

  if (lessonId && !userCanEdit(lessonUnderEdit.lesson, context.user)) {
    return <div>You do not have permission to view this lesson.</div>;
  }

  return (
    <div style={{ paddingTop: "20px" }}>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          data-cy="lesson-edit-grid"
        >
          <TextField
            data-cy="lesson-name"
            label="Lesson Name"
            placeholder="Display name for the lesson"
            fullWidth
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
          <TextField
            data-cy="lesson-id"
            label="Lesson ID"
            placeholder="Unique alias to the lesson"
            fullWidth
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
            size="small"
          />
          {/* Dropdown */}

          <FormControl style={{ width: 800, marginLeft: 8 }}>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              Dialog Category
            </InputLabel>
            <Select
              labelId="dialog-category-label"
              value={lessonUnderEdit.lesson?.dialogCategory || "NOT SET"}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
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
            <FormHelperText>Select a Dialog Type</FormHelperText>
          </FormControl>

          <TextField
            data-cy="lesson-creator"
            label="Created By"
            placeholder="Guest"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={lessonUnderEdit.lesson?.createdByName || "Guest"}
            disabled={true}
            size="small"
          />
        </Grid>
        <Grid
          container
          justify="flex-start"
          direction="column"
          alignItems="flex-start"
          style={{ paddingTop: "40px" }}
        >
          <TextField
            data-cy="intro"
            label="Introduction"
            placeholder="Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'"
            multiline
            rowsMax={4}
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
          <TextField
            data-cy="question"
            label="Question"
            placeholder="Question the student needs to answer, e.g. 'What are the colors in RGB?'"
            multiline
            rowsMax={4}
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
          <div className={classes.image}>
            <TextField
              data-cy="image"
              label="Image"
              placeholder="Link to image url"
              multiline
              rowsMax={4}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={lessonUnderEdit.lesson?.image || ""}
              onChange={(e) => {
                setLesson(
                  {
                    ...(lessonUnderEdit.lesson || newLesson),
                    image: e.target.value || "",
                  },
                  true
                );
              }}
              variant="outlined"
            />
            <img
              className={classes.thumbnail}
              data-cy="image-thumbnail"
              src={lessonUnderEdit.lesson?.image}
              style={{ height: 50 }}
              onClick={() => {
                window.open(lessonUnderEdit.lesson?.image, "_blank");
              }}
            />
          </div>
        </Grid>
        <Divider style={{ marginTop: 20 }} />
        <ExpectationsList
          classes={classes}
          lessonId={lessonId}
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
        <Divider />
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
        borderColor={
          trainStatus.state !== TrainState.SUCCESS &&
          trainStatus.state !== TrainState.FAILURE
            ? null
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
        <Typography>
          {lessonUnderEdit.lesson?.lastTrainedAt
            ? `Last Trained: ${lessonUnderEdit.lesson?.lastTrainedAt}`
            : `Last Trained: Never Trained`}
        </Typography>
        {isTraining ? (
          <CircularProgress className={classes.progress} />
        ) : trainStatus.state === TrainState.SUCCESS ? (
          <List>
            {trainStatus.info?.expectations?.map((x, i) => (
              <ListItem key={`train-success-accuracy-${i}`}>
                <ListItemText
                  style={{ textAlign: "center" }}
                  data-cy={`train-success-accuracy-${i}`}
                >{`Accuracy: ${x.accuracy.toFixed(2)}`}</ListItemText>
              </ListItem>
            ))}
          </List>
        ) : trainStatus.state === TrainState.FAILURE ? (
          <Typography data-cy="train-failure">{`TRAINING FAILED`}</Typography>
        ) : null}
      </Box>
      <div>
        <Button
          data-cy="train-button"
          className={classes.button}
          variant="contained"
          color="primary"
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
          className={classes.button}
          variant="contained"
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
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleSavePopUp(true)}
            disabled={!isLessonValid()}
          >
            Save
          </Button>
        ) : null}
        <Button
          data-cy="discard-button"
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          style={{ background: "#1B6A9C" }}
          onClick={handleDiscard}
        >
          Discard
        </Button>
      </div>
      <Dialog open={Boolean(trainingMessage)} onClose={dismissTrainingMessage}>
        <DialogTitle>{trainingMessage}</DialogTitle>
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
  location: WindowLocation<unknown>;
}): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const styles = useStyles();

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view lesson.</div>;
  }
  if (!context.user) {
    return <CircularProgress className={styles.progress} />;
  }
  return (
    <div>
      <NavBar title="Edit Lesson" />
      <LessonEdit search={props.search} location={props.location} />
    </div>
  );
}

export default withLocation(EditPage);
