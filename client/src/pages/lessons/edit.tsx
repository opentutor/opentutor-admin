import { navigate } from "gatsby";
import React from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  TextField,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {
  fetchLesson,
  updateLesson,
  fetchTrainingStatus,
  trainLesson,
} from "api";
import NavBar from "components/nav-bar";
import { Lesson, TrainStatus, TrainState } from "types";
import withLocation from "wrap-with-location";
import "styles/layout.css";
import "react-toastify/dist/ReactToastify.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles({
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
});

const TRAIN_STATUS_POLL_INTERVAL_DEFAULT = 1000;

const LessonEdit = (props: {
  search: { lessonId: string; trainStatusPollInterval?: number };
}) => {
  const { lessonId } = props.search;
  const trainStatusPollInterval = !isNaN(
    Number(props.search.trainStatusPollInterval)
  )
    ? Number(props.search.trainStatusPollInterval)
    : TRAIN_STATUS_POLL_INTERVAL_DEFAULT;
  const classes = useStyles();
  const [cookies] = useCookies(["user"]);
  const [change, setChange] = React.useState(false);
  const [expectationOpen, setExpectationOpen] = React.useState(true);

  const newLesson = {
    lessonId: uuid(),
    createdBy: "",
    name: "Display name for the lesson",
    intro:
      "Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'",
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
            text:
              "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
          },
        ],
      },
    ],
    isTrainable: false,
    lastTrainedAt: "",
  };
  const [lesson, setLesson] = React.useState(newLesson);

  React.useEffect(() => {
    let mounted = true;
    if (lessonId !== "new") {
      fetchLesson(lessonId)
        .then((lesson: Lesson) => {
          console.log("fetchLesson got", lesson);
          if (mounted && lesson) {
            setLesson(lesson);
          }
        })
        .catch((err: string) => console.error(err));
      return () => {
        mounted = false;
      };
    } else {
      setLesson({ ...lesson, createdBy: cookies.user });
    }
  }, []);

  function handleLessonNameChange(name: string): void {
    setChange(true);
    setLesson({ ...lesson, name: name });
  }

  const [validId, setValidId] = React.useState(true);
  function handleLessonIdChange(lessonId: string): void {
    setChange(true);
    if (/^[a-z0-9-]+$/g.test(lessonId)) {
      setValidId(true);
    } else {
      setValidId(false);
    }
    setLesson({ ...lesson, lessonId: lessonId });
  }

  function handleIntroChange(intro: string): void {
    setChange(true);
    setLesson({ ...lesson, intro: intro });
  }

  function handleQuestionChange(question: string): void {
    setChange(true);
    setLesson({ ...lesson, question: question });
  }

  function handleConclusionChange(con: string, index: number): void {
    setChange(true);
    setLesson({
      ...lesson,
      conclusion: [
        ...lesson.conclusion.slice(0, index),
        con,
        ...lesson.conclusion.slice(index + 1),
      ],
    });
  }

  function handleExpectationChange(exp: string, index: number): void {
    setChange(true);
    setLesson({
      ...lesson,
      expectations: [
        ...lesson.expectations.slice(0, index),
        {
          hints: lesson.expectations[index].hints,
          expectation: exp,
        },
        ...lesson.expectations.slice(index + 1),
      ],
    });
  }

  function handleHintChange(hnt: string, eIndex: number, hIndex: number): void {
    setChange(true);
    setLesson({
      ...lesson,
      expectations: [
        ...lesson.expectations.slice(0, eIndex),
        {
          hints: [
            ...lesson.expectations[eIndex].hints.slice(0, hIndex),
            { text: hnt },
            ...lesson.expectations[eIndex].hints.slice(hIndex + 1),
          ],
          expectation: lesson.expectations[eIndex].expectation,
        },
        ...lesson.expectations.slice(eIndex + 1),
      ],
    });
  }

  const [savePopUp, setSavePopUp] = React.useState(false);

  function handleSave() {
    setSavePopUp(true);
  }

  function handleDiscard() {
    navigate(`/lessons`);
  }

  function handleAddExpectation(): void {
    setChange(true);
    setLesson({
      ...lesson,
      expectations: [
        ...lesson.expectations,
        {
          expectation:
            "Add a short ideal answer for an expectation, e.g. 'Red'",
          hints: [
            {
              text:
                "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
            },
          ],
        },
      ],
    });
  }

  function handleRemoveExpectation(index: number): void {
    lesson.expectations.splice(index, 1);
    setLesson({ ...lesson, expectations: [...lesson.expectations] });
  }

  function handleAddConclusion(): void {
    setChange(true);
    setLesson({
      ...lesson,
      conclusion: [
        ...lesson.conclusion,
        "Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'",
      ],
    });
  }

  function handleRemoveConclusion(index: number): void {
    lesson.conclusion.splice(index, 1);
    setLesson({ ...lesson, conclusion: [...lesson.conclusion] });
  }

  function handleAddHint(index: number): void {
    setChange(true);
    setLesson({
      ...lesson,
      expectations: [
        ...lesson.expectations.slice(0, index),
        {
          hints: [
            ...lesson.expectations[index].hints,
            {
              text:
                "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
            },
          ],
          expectation: lesson.expectations[index].expectation,
        },
        ...lesson.expectations.slice(index + 1),
      ],
    });
  }

  function handleRemoveHint(expectationIndex: number, hintIndex: number): void {
    setChange(true);
    lesson.expectations[expectationIndex].hints.splice(hintIndex, 1);
    setLesson({ ...lesson, expectations: [...lesson.expectations] });
  }

  const [isTraining, setIsTraining] = React.useState(false);
  const [trainPopUp, setTrainPopUp] = React.useState(false);
  const [statusUrl, setStatusUrl] = React.useState("");
  const [trainData, setTrainData] = React.useState<TrainStatus>({
    state: TrainState.NONE,
  });

  function useInterval(callback: any, delay: number | null) {
    const savedCallback = React.useRef() as any;

    React.useEffect(() => {
      savedCallback.current = callback;
    });

    React.useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      if (delay) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  function handleTrain(): void {
    if (lesson.isTrainable) {
      trainLesson(lesson.lessonId)
        .then((trainJob) => {
          setStatusUrl(trainJob.statusUrl);
          setIsTraining(true);
        })
        .catch((err: any) => {
          console.error(err);
          setTrainData({
            state: TrainState.FAILURE,
            status: err.message || `${err}`,
          });
          setIsTraining(false);
          setTrainPopUp(true);
        });
    } else {
      setTrainPopUp(true);
    }
  }

  useInterval(
    () => {
      fetchTrainingStatus(statusUrl)
        .then((trainStatus) => {
          console.log("train status", trainStatus);
          setTrainData(trainStatus);
          if (
            trainStatus.state === TrainState.SUCCESS ||
            trainStatus.state === TrainState.FAILURE
          ) {
            setTrainPopUp(true);
            setIsTraining(false);
            if (trainStatus.state === TrainState.SUCCESS) {
              const converted = encodeURI(
                JSON.stringify({ ...lesson, lastTrainedAt: new Date() })
              );
              updateLesson(lesson.lessonId, converted)
                .then((lesson) => {
                  console.log(`fetchUpdateLesson got`, lesson);
                  if (lesson !== undefined) {
                    setLesson(lesson);
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            }
          }
        })
        .catch((err: Error) => {
          setTrainData({ state: TrainState.FAILURE, status: err.message });
          setTrainPopUp(true);
          setIsTraining(false);
          console.error(err);
        });
    },
    isTraining ? trainStatusPollInterval : null
  );

  function handleTrainPopUp(): void {
    setTrainPopUp(false);
  }

  function handleSavePopUp(): void {
    setSavePopUp(false);
  }

  function handleSaveExit(): void {
    saveChanges();
    navigate(`/lessons`);
  }

  function handleSaveContinue(): void {
    saveChanges();
    handleSavePopUp();
  }

  function saveChanges(): void {
    toast("Saving...");
    const converted = encodeURI(JSON.stringify(lesson));
    let origId = lessonId;
    if (lessonId === "new") {
      origId = lesson.lessonId;
    }
    updateLesson(origId, converted)
      .then((lesson) => {
        console.log(`fetchUpdateLesson got`, lesson);
        if (lesson !== undefined) {
          setLesson(lesson);
        }
        toast("Success!");
      })
      .catch((err) => {
        toast("Failed to save lesson.");
        console.error(err);
      });
  }

  return (
    <div style={{ paddingTop: "20px" }}>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
        >
          <TextField
            id="lesson-name"
            key="lesson-name"
            label="Lesson Name"
            placeholder="Display name for the lesson"
            inputProps={{ maxLength: 100 }}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.name ? lesson.name : ""}
            onChange={(e) => {
              handleLessonNameChange(e.target.value);
            }}
            variant="outlined"
          />
          <TextField
            id="lesson-id"
            key="lesson-id"
            label="Lesson ID"
            placeholder="Unique alias to the lesson"
            inputProps={{ maxLength: 100 }}
            fullWidth
            error={!validId}
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.lessonId ? lesson.lessonId : ""}
            onChange={(e) => {
              handleLessonIdChange(e.target.value);
            }}
            variant="outlined"
            size="small"
          />
          <TextField
            id="lesson-creator"
            key="lesson-creator"
            label="Created By"
            placeholder="Guest"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.createdBy}
            disabled={true}
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
            id="intro"
            key="intro"
            label="Introduction"
            placeholder="Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'"
            multiline
            rowsMax={4}
            inputProps={{ maxLength: 400 }}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.intro ? lesson.intro : ""}
            onChange={(e) => {
              handleIntroChange(e.target.value);
            }}
            variant="outlined"
          />

          <TextField
            id="question"
            key="question"
            label="Question"
            placeholder="Question the student needs to answer, e.g. 'What are the colors in RGB?'"
            multiline
            rowsMax={4}
            inputProps={{ maxLength: 400 }}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.question ? lesson.question : ""}
            onChange={(e) => {
              handleQuestionChange(e.target.value);
            }}
            variant="outlined"
          />
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Expectation</TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {lesson?.expectations.map((row, i) => {
                return (
                  <React.Fragment key={`expectation-${i}`}>
                    <TableRow className={classes.root}>
                      <TableCell align="left" width="50%">
                        <TextField
                          margin="normal"
                          name="expectations"
                          id={`edit-expectation-${i}`}
                          key={`edit-expectation-${i}`}
                          label={`Expectation ${i + 1}`}
                          placeholder="Add a short ideal answer for an expectation, e.g. 'Red'"
                          inputProps={{ maxLength: 100 }}
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={row.expectation ? row.expectation : ""}
                          onChange={(e) => {
                            handleExpectationChange(e.target.value, i);
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="left" width="40%">
                        {lesson.expectations.length > 1 ? (
                          <IconButton
                            aria-label="remove expectation"
                            size="small"
                            onClick={() => {
                              handleRemoveExpectation(i);
                            }}
                          >
                            <ClearOutlinedIcon />
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell align="center" width="10%">
                        <IconButton
                          aria-label="expand expectation"
                          size="small"
                          onClick={() => setExpectationOpen(!expectationOpen)}
                        >
                          {expectationOpen ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={expectationOpen}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Table size="small" aria-label="hint">
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ minWidth: 170 }}>
                                    Hint
                                  </TableCell>
                                  <TableCell />
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.hints.map((hint, j) => (
                                  <TableRow key={`hint-${i}-${j}`}>
                                    <TableCell align="left" width="60%">
                                      <TextField
                                        margin="normal"
                                        id={`edit-hint-${i}-${j}`}
                                        key={`edit-hint-${i}-${j}`}
                                        label={`Hint ${j + 1}`}
                                        placeholder="Add a hint to help for the expectation, e.g. 'One of them starts with R'"
                                        multiline
                                        rowsMax={4}
                                        inputProps={{ maxLength: 400 }}
                                        fullWidth
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        value={hint.text ? hint.text : ""}
                                        onChange={(e) => {
                                          handleHintChange(
                                            e.target.value,
                                            i,
                                            j
                                          );
                                        }}
                                        variant="outlined"
                                      />
                                    </TableCell>
                                    <TableCell align="left" width="40%">
                                      {row.hints.length > 1 ? (
                                        <IconButton
                                          aria-label="remove hint"
                                          size="small"
                                          onClick={() => {
                                            handleRemoveHint(i, j);
                                          }}
                                        >
                                          <ClearOutlinedIcon />
                                        </IconButton>
                                      ) : null}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              <Button
                                startIcon={<AddIcon />}
                                className={classes.button}
                                style={{ float: "left" }}
                                onClick={() => {
                                  handleAddHint(i);
                                }}
                              >
                                Add Hint
                              </Button>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          <Button
            startIcon={<AddIcon />}
            className={classes.button}
            style={{ float: "left" }}
            onClick={handleAddExpectation}
          >
            Add Expectation
          </Button>
        </TableContainer>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{`Conclusion`}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {lesson.conclusion.map((row, i) => (
                <TableRow key={`conclusion-${i}`}>
                  <TableCell align="left" width="60%">
                    <TextField
                      margin="normal"
                      id={`edit-conslusion-${i}`}
                      key={`edit-conclusion-${i}=`}
                      label={`Conclusion ${i + 1}`}
                      multiline
                      rowsMax={4}
                      inputProps={{ maxLength: 400 }}
                      fullWidth
                      placeholder="Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={row ? row : ""}
                      onChange={(e) => {
                        handleConclusionChange(e.target.value, i);
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="left" width="40%">
                    {lesson.conclusion.length > 1 ? (
                      <IconButton
                        aria-label="remove conclusion"
                        size="small"
                        onClick={() => {
                          handleRemoveConclusion(i);
                        }}
                      >
                        <ClearOutlinedIcon />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            startIcon={<AddIcon />}
            className={classes.button}
            style={{ float: "left" }}
            onClick={handleAddConclusion}
          >
            Add Conclusion
          </Button>
        </TableContainer>
      </form>

      <Box
        border={5}
        borderColor={
          trainData.state !== TrainState.SUCCESS &&
          trainData.state !== TrainState.FAILURE
            ? null
            : trainData.state === TrainState.FAILURE
            ? "#FF0000"
            : !trainData.info &&
              trainData.info!.expectations &&
              Array.isArray(trainData.info!.expectations) &&
              trainData.info!.expectations!.length > 0
            ? "#FFFF00"
            : trainData.info!.expectations![0].accuracy >= 0.6
            ? "#FFFF00"
            : trainData.info!.expectations![0].accuracy >= 0.4
            ? "#008000"
            : trainData.info!.expectations![0].accuracy >= 0.2
            ? "#FF0000"
            : null
        }
      >
        <Typography variant="h5">Training Data</Typography>
        <Typography>
          {lesson.lastTrainedAt
            ? `Last Trained: ${lesson.lastTrainedAt}`
            : `Last Trained: Never Trained`}
        </Typography>
        {isTraining ? (
          <CircularProgress />
        ) : trainData.state === TrainState.SUCCESS ? (
          <Typography id="train-success-accuracy">{`Accurracy: ${
            trainData.info!.expectations![0].accuracy
          }`}</Typography>
        ) : trainData.state === TrainState.FAILURE ? (
          <Typography id="train-failure">{`TRAINING FAILED`}</Typography>
        ) : null}
      </Box>

      <div>
        <Button
          id="train-button"
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          style={{ background: lesson.isTrainable ? "#1B6A9C" : "#808080" }}
          disabled={isTraining}
          onClick={handleTrain}
        >
          Train
        </Button>
        {change ? (
          <Button
            id="save-button"
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            style={{ background: validId ? "#1B6A9C" : "#808080" }}
            onClick={handleSave}
            disabled={!validId}
          >
            Save
          </Button>
        ) : null}
        <Button
          id="discard-button"
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
      <Dialog open={trainPopUp} onClose={handleTrainPopUp}>
        {!lesson.isTrainable ? (
          <DialogTitle> NEEDS MORE GRADED DATA </DialogTitle>
        ) : trainData.state === TrainState.SUCCESS ? (
          <DialogTitle> Training Success </DialogTitle>
        ) : trainData.state === TrainState.FAILURE ? (
          <DialogTitle> Training Failed</DialogTitle>
        ) : null}
      </Dialog>
      <Dialog open={savePopUp} onClose={handleSavePopUp}>
        <DialogTitle> Save </DialogTitle>
        <DialogActions>
          <Button
            id="save-continue"
            onClick={handleSaveContinue}
            color="primary"
          >
            {" "}
            Continue{" "}
          </Button>
          <Button id="save-exit" onClick={handleSaveExit} color="primary">
            {" "}
            Exit{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

const EditPage = (props: { path: string; search: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar title="Edit Lesson" />
      <LessonEdit search={props.search} />
    </MuiThemeProvider>
  );
};

export default withLocation(EditPage);
