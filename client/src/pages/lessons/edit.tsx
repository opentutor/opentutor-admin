import { navigate } from "gatsby";
import { v4 as uuid } from "uuid";
import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import withLocation from "wrap-with-location";
import { Lesson, LessonExpectation } from "types";
import { fetchLesson, updateLesson } from "api";
import { withPrefix } from "gatsby";
import NavBar from "components/nav-bar";
import "styles/layout.css";

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

type ExpectationProp = {
  row: LessonExpectation;
  index: number;
};

const LessonEdit = ({ search }: { search: any }) => {
  let { lessonId } = search;
  const originalId = lessonId;
  //console.log(lessonId);
  const classes = useStyles();
  const inititialLesson = {
    id: "",
    lessonId: "",
    name: "",
    intro: "",
    question: "",
    conclusion: [""],
    expectations: [
      {
        expectation: "",
        hints: [{ text: "" }],
      },
    ],
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };

  const [lesson, setLesson] = React.useState<Lesson>(inititialLesson);
  const [updated, setUpdated] = React.useState<Lesson>(inititialLesson);
  const [copyLesson, setCopyLesson] = React.useState<Lesson>(inititialLesson);
  const [change, setChange] = React.useState(false);
  const [create, setCreate] = React.useState(false);
  const [expectationOpen, setExpectationOpen] = React.useState(true);

  React.useEffect(() => {
    if (lessonId !== "new") {
      let mounted = true;
      fetchLesson(lessonId)
        .then((lesson: Lesson) => {
          console.log("fetchLesson got", lesson);
          if (mounted) {
            if (lesson !== undefined) {
              setLesson(lesson);
            }
          }
        })
        .catch((err: any) => console.error(err));
      return () => {
        mounted = false;
      };
    } else {
      lessonId = uuid();
      console.log(lessonId);
      setLesson({ ...lesson, lessonId: lessonId });
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
    const copyLesson = { ...lesson };
    const copyConclusion = [...copyLesson.conclusion] as Array<any>;
    copyConclusion[index] = con;
    setLesson({ ...lesson, conclusion: copyConclusion });
  }

  function handleExpectationChange(exp: string, index: number): void {
    setChange(true);
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    const newExpectation = { ...copyExpectations[index] };
    newExpectation.expectation = exp;
    copyExpectations[index] = newExpectation;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleHintChange(hnt: string, eIndex: number, hIndex: number): void {
    setChange(true);
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    const copyHints = [...copyExpectations[eIndex].hints] as Array<any>;
    const newHint = { ...copyHints[hIndex] };
    newHint.text = hnt;
    copyHints[hIndex] = newHint;
    copyExpectations[eIndex].hints[hIndex] = newHint;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleRevert() {
    setChange(false);
    setLesson(copyLesson);
  }

  function handleSave() {
    const converted = encodeURI(JSON.stringify(lesson));
    let id = "";
    let mounted = false;
    if (originalId !== "new") {
      id = lesson.lessonId;
    } else {
      id = originalId;
    }
    updateLesson(id, converted)
      .then((lesson) => {
        console.log(`fetchUpdateLesson got`, lesson);
        if (mounted) {
          if (lesson !== undefined) {
            setCopyLesson(lesson);
            setLesson(lesson);
          }
        }
      })
      .catch((err) => console.error(err));
    navigate(`/lessons`);
    return () => {
      mounted = false;
    };
  }

  function handleCancel() {
    navigate(`/lessons`);
  }

  function handleAddExpectation(): void {
    setChange(true);
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    copyExpectations.push({
      expectation: "",
      hints: [{ text: "" }],
    });
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleRemoveExpectation(index: number): void {
    lesson.expectations.splice(index, 1);
    setLesson({ ...lesson, expectations: [...lesson.expectations] });
  }

  function handleAddConclusion(): void {
    setChange(true);
    const copyLesson = { ...lesson };
    const copyConclusion = [...copyLesson.conclusion] as Array<any>;
    copyConclusion.push("");
    setLesson({ ...lesson, conclusion: copyConclusion });
  }

  // function handleRemoveConclusion(exp: string): void {
  //   setChange(true);
  //   const copyLesson = { ...lesson };
  //   let copyConclusion = [...copyLesson.conclusion] as Array<any>;
  //   copyConclusion = copyConclusion.filter((conclusion) => conclusion !== exp);
  //   setLesson({ ...lesson, conclusion: copyConclusion });
  // }

  function handleRemoveConclusion(index: number): void {
    lesson.conclusion.splice(index, 1);
    setLesson({ ...lesson, conclusion: [...lesson.conclusion] });
  }

  function handleAddHint(index: number): void {
    setChange(true);
    console.log("Add Hint");
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    const copyHints = [...copyLesson.expectations[index].hints] as Array<any>;
    copyHints.push({ text: "" });
    copyExpectations[index].hints = copyHints;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleRemoveHint(eIdx: number, hint: string): void {
    setChange(true);
    console.log("Remove Hint");
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    let copyHints = [...copyLesson.expectations[eIdx].hints] as Array<any>;
    copyHints = copyHints.filter((hints) => hints.text !== hint);
    copyExpectations[eIdx].hints = copyHints;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  return (
    <div style={{ paddingTop: "20px" }}>
      <form className={classes.root} noValidate autoComplete="off">
        <Container>
          <TextField
            id="lesson-name"
            key="lesson-name"
            label="Lesson Name"
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
            value={lesson.lessonId ? lesson.lessonId : ""}
            onChange={(e) => {
              handleLessonIdChange(e.target.value);
            }}
            variant="outlined"
          />
        </Container>
        <div>
          <TextField
            id="intro"
            key="intro"
            label="Introduction"
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
            value={lesson.question ? lesson.question : ""}
            onChange={(e) => {
              handleQuestionChange(e.target.value);
            }}
            variant="outlined"
          />
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Expectation</TableCell>
                <TableCell />
                <TableCell>
                  {" "}
                  <IconButton
                    aria-label="add hint"
                    size="small"
                    onClick={handleAddExpectation}
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>
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
                          value={row.expectation ? row.expectation : ""}
                          onChange={(e) => {
                            handleExpectationChange(e.target.value, i);
                          }}
                          variant="outlined"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        {i > 0 ? (
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
                                      {j > 0 ? (
                                        <IconButton
                                          aria-label="remove hint"
                                          size="small"
                                          onClick={() => {
                                            handleRemoveHint(i, hint.text);
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
        </TableContainer>
        {/* <div>
          <TextField
            id="conclusion"
            key="conclusion"
            label="Conclusion"
            value={lesson.conclusion ? lesson.conclusion : ""}
            onChange={(e) => {
              handleConclusionChange(e.target.value);
            }}
            variant="outlined"
          />
        </div> */}
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
                      value={row ? row : ""}
                      onChange={(e) => {
                        handleConclusionChange(e.target.value, i);
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {i > 0 ? (
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

      <div>
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
    </div>
  );
};

const EditPage = ({ path, search }: { path: string; search: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar title="Edit Lesson" />
      <LessonEdit search={search} />
    </MuiThemeProvider>
  );
};

export default withLocation(EditPage);
