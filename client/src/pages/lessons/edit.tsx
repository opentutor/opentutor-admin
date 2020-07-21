import { navigate } from "gatsby";
import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import {
  Typography,
  Button,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
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
    margin: theme.spacing(1),
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
  const { lessonId } = search;
  const classes = useStyles();
  const inititialLesson = {
    id: "",
    lessonId: "",
    name: "",
    intro: "",
    question: "",
    conclusion: "",
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
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    fetchLesson(lessonId)
      .then((lesson: Lesson) => {
        console.log("fetchLesson got", lesson);
        if (mounted) {
          if (lesson !== undefined) {
            setCopyLesson(lesson);
            setLesson(lesson);
          }
        }
      })
      .catch((err: any) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  function handleLessonNameChange(name: string): void {
    setChange(true);
    setLesson({ ...lesson, name: name });
  }

  function handleIntroChange(intro: string): void {
    setChange(true);
    setLesson({ ...lesson, intro: intro });
  }

  function handleQuestionChange(question: string): void {
    setChange(true);
    setLesson({ ...lesson, question: question });
  }

  function handleConclusionChange(conclusion: string): void {
    setChange(true);
    setLesson({ ...lesson, conclusion: conclusion });
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
    let mounted = false;
    updateLesson(lesson.lessonId, converted)
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
    navigate(withPrefix(`/lessons`));
    return () => {
      mounted = false;
    };
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

  function handleRemoveExpectation(exp: string): void {
    setChange(true);
    const copyLesson = { ...lesson };
    let copyExpectations = [...copyLesson.expectations] as Array<any>;
    copyExpectations = copyExpectations.filter(
      (expectations) => expectations.expectation !== exp
    );
    setLesson({ ...lesson, expectations: copyExpectations });
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
    <div>
      <div id="header">Edit</div>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
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
        </div>
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
                <TableCell />
                <TableCell>Expectation</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <IconButton
                aria-label="add hint"
                size="small"
                onClick={handleAddExpectation}
              >
                <AddIcon />
              </IconButton>
              {lesson?.expectations.map((row, i) => {
                return (
                  <React.Fragment key={`expectation-${i}`}>
                    <TableRow className={classes.root}>
                      <TableCell>
                        <IconButton
                          aria-label="remove expectaion"
                          size="small"
                          onClick={() => {
                            handleRemoveExpectation(row.expectation);
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
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
                        <IconButton
                          aria-label="expand expectation"
                          size="small"
                          onClick={() => setOpen(!open)}
                        >
                          {open ? (
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
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <IconButton
                              aria-label="add hint"
                              size="small"
                              onClick={() => {
                                handleAddHint(i);
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell />
                                  <TableCell>Hint</TableCell>
                                  <TableCell />
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.hints.map((hint, j) => (
                                  <TableRow key={`hint-${i}-${j}`}>
                                    <TableCell>
                                      <IconButton
                                        aria-label="remove expectaion"
                                        size="small"
                                        onClick={() => {
                                          handleRemoveHint(i, hint.text);
                                        }}
                                      >
                                        <RemoveIcon />
                                      </IconButton>
                                    </TableCell>
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
        <div>
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
        </div>
      </form>

      <div>
        {change ? (
          <Button id="save-button" onClick={handleSave}>
            Save
          </Button>
        ) : null}
      </div>
      {/* <div>
        {change ? <Button onClick={handleRevert}>Revert</Button> : null}
      </div> */}
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
