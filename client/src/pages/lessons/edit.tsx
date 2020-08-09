import { navigate } from "gatsby";
import React from "react";
import { useCookies } from "react-cookie";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  TextField,
  Collapse,
  Container,
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
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { fetchLesson, updateLesson } from "api";
import NavBar from "components/nav-bar";
import { Lesson } from "types";
import withLocation from "wrap-with-location";
import "styles/layout.css";

import { fetchStatusUrl, fetchTraining } from "mock-api";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles({
  root: {
    width: "100%",
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
});

<<<<<<< HEAD
type ExpectationProp = {
  row: LessonExpectation;
  index: number;
};

const LessonEdit = ({ search }: { search: any }) => {
  let { lessonId } = search;
  const originalId = lessonId;
=======
const LessonEdit = (props: { search: any }) => {
  const { lessonId } = props.search;
>>>>>>> b82b2ba... Show lesson creator username on lessons and sessions
  const classes = useStyles();
  const [cookies] = useCookies(["user"]);
  const [change, setChange] = React.useState(false);
  const [expectationOpen, setExpectationOpen] = React.useState(true);

  const newLesson = {
    lessonId: uuid(),
    createdBy: "",
    name: "Lesson Name",
    intro: "Introduction",
    question: "Question",
    conclusion: ["Add a clossing to the lesson"],
    expectations: [
      {
        expectation: "Add ideal answer for an expectation",
        hints: [{ text: "Add a hint to help for the expectaion" }],
      },
    ],
  };
  const [lesson, setLesson] = React.useState(newLesson);

  React.useEffect(() => {
    if (lessonId !== "new") {
      fetchLesson(lessonId)
        .then((l: Lesson) => {
          console.log("fetchLesson got", l);
          if (l !== undefined) {
            setLesson(l);
          }
        })
        .catch((err: any) => console.error(err));
    } else {
      setLesson({ ...lesson, createdBy: cookies.user });
    }
  }, []);

  function handleLessonNameChange(name: string): void {
    setChange(true);
    setLesson({ ...lesson, name: name });
  }

  function handleLessonIdChange(lessonId: string): void {
    setChange(true);
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

  function handleSave() {
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
      })
      .catch((err) => console.error(err));
    navigate(`/lessons`);
  }

  function handleCancel() {
    navigate(`/lessons`);
  }

  function handleAddExpectation(): void {
    setChange(true);
    setLesson({
      ...lesson,
      expectations: [
        ...lesson.expectations,
        {
          expectation: "Add ideal answer for an expectation",
          hints: [{ text: "Add a hint to help answer the expectation" }],
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
      conclusion: [...lesson.conclusion, "Add a closing to the lesson"],
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
              text: "Add a hint to help answer the expectation",
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
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    const copyHints = [
      ...copyLesson.expectations[expectationIndex].hints,
    ] as Array<any>;
    copyHints.splice(hintIndex, 1);
    copyExpectations[expectationIndex].hints = copyHints;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  const [delay, setDelay] = React.useState(1000);
  const [isTraining, setIsTraining] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [trainPopUp, setTrainPopUp] = React.useState(false);
  const [statusUrl, setStatusUrl] = React.useState({
    statusUrl: "",
  });
  const [trainData, setTrainData] = React.useState({
    status: "",
    success: false,
    info: {
      accuracy: 0,
    },
  });

  function useInterval(callback: any, delay: any) {
    const savedCallback = React.useRef() as any;

    React.useEffect(() => {
      savedCallback.current = callback;
    });

    React.useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  function handleTrain(): void {
    fetchStatusUrl(lesson.lessonId)
      .then((statusUrl) => {
        setStatusUrl(statusUrl);
        setIsTraining(true);
      })
      .catch((err: any) => console.error(err));
  }

  useInterval(
    () => {
      fetchTraining(statusUrl.statusUrl, count)
        .then((trainData) => {
          setTrainData(trainData);
          if (trainData.status === "COMPLETE") {
            setTrainPopUp(true);
            setCount(0);
            setIsTraining(false);
          }
        })
        .catch((err: any) => console.error(err));
      setCount(count + 1);
    },
    count < 4 && isTraining ? delay : null
  );

  function handleTrainPopUp(): void {
    setTrainPopUp(false);
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
            placeholder="Lesson Name"
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
        <Grid container justify="flex-start" style={{ paddingTop: "40px" }}>
          <div>
            <TextField
              id="intro"
              key="intro"
              label="Introduction"
              placeholder="Introduction"
              InputLabelProps={{
                shrink: true,
              }}
              value={lesson.intro ? lesson.intro : ""}
              onChange={(e) => {
                handleIntroChange(e.target.value);
              }}
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              id="question"
              key="question"
              label="Question"
              placeholder="Question"
              InputLabelProps={{
                shrink: true,
              }}
              value={lesson.question ? lesson.question : ""}
              onChange={(e) => {
                handleQuestionChange(e.target.value);
              }}
              variant="outlined"
            />
          </div>
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
                      <TableCell>
                        <TextField
                          margin="normal"
                          name="expectations"
                          id={`edit-expectation-${i}`}
                          key={`edit-expectation-${i}`}
                          label={`Expectation ${i + 1}`}
                          placeholder="Add ideal answer for an expectation"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={row.expectation ? row.expectation : ""}
                          onChange={(e) => {
                            handleExpectationChange(e.target.value, i);
                          }}
                          variant="outlined"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        {lesson.expectations.length > 1 ? (
                          <IconButton
                            aria-label="remove expectaion"
                            size="small"
                            onClick={() => {
                              handleRemoveExpectation(i);
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell>
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
                                  <TableCell>Hint</TableCell>
                                  <TableCell />
                                  <TableCell>
                                    {" "}
                                    <IconButton
                                      aria-label="add hint"
                                      size="small"
                                      onClick={() => {
                                        handleAddHint(i);
                                      }}
                                    >
                                      <AddIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.hints.map((hint, j) => (
                                  <TableRow key={`hint-${i}-${j}`}>
                                    <TableCell>
                                      <TextField
                                        margin="normal"
                                        id={`edit-hint-${i}-${j}`}
                                        key={`edit-hint-${i}-${j}`}
                                        label={`Hint ${j + 1}`}
                                        placeholder="Add a hint to help answer the expectation"
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
                                    <TableCell>
                                      {row.hints.length > 1 ? (
                                        <IconButton
                                          aria-label="remove hint"
                                          size="small"
                                          onClick={() => {
                                            handleRemoveHint(i, j);
                                          }}
                                        >
                                          <RemoveIcon />
                                        </IconButton>
                                      ) : null}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
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
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className={classes.button}
            style={{ background: "#1B6A9C" }}
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
                <TableCell>
                  {" "}
                  <IconButton
                    aria-label="add conclusion"
                    size="small"
                    onClick={handleAddConclusion}
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lesson.conclusion.map((row, i) => (
                <TableRow key={`conclusion-${i}`}>
                  <TableCell>
                    <TextField
                      margin="normal"
                      id={`edit-conslusion-${i}`}
                      key={`edit-conclusion-${i}=`}
                      label={`Conclusion ${i + 1}`}
                      placeholder="Add a closing to the lesson"
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
                  <TableCell>
                    {lesson.conclusion.length > 1 ? (
                      <IconButton
                        aria-label="remove conclusion"
                        size="small"
                        onClick={() => {
                          handleRemoveConclusion(i);
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </form>

      <Box
        border={5}
        borderColor={
          trainData.status === "COMPLETE"
            ? trainData.info.accuracy < 0.2 || !trainData.success
              ? "#FF0000"
              : trainData.info.accuracy >= 0.2 && trainData.info.accuracy < 0.4
              ? "#FFA500"
              : trainData.info.accuracy >= 0.4 && trainData.info.accuracy < 0.6
              ? "#FFFF00"
              : "#008000"
            : null
        }
      >
        <Typography variant="h5">Training Data</Typography>
        <Typography>{`Last Trained:`}</Typography>
        {isTraining ? (
          <CircularProgress />
        ) : trainData.status === "COMPLETE" ? (
          trainData.success ? (
            <Typography>{`Accurracy: ${trainData.info.accuracy}`}</Typography>
          ) : (
            <Typography>{`TRAINING FAILED`}</Typography>
          )
        ) : null}
      </Box>

      <div>
        <Button
          id="train-button"
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          style={{ background: "#1B6A9C" }}
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
            style={{ background: "#1B6A9C" }}
            onClick={handleSave}
          >
            Save
          </Button>
        ) : null}
        <Button
          id="cancel-button"
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          style={{ background: "#1B6A9C" }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
      <Dialog open={trainPopUp} onClose={handleTrainPopUp}>
        {trainData.status === "COMPLETE" ? (
          trainData.success ? (
            <DialogTitle> Training Success </DialogTitle>
          ) : (
            <DialogTitle> Training Failed</DialogTitle>
          )
        ) : null}
      </Dialog>
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
