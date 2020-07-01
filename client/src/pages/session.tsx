import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import "styles/layout.css";

import { Expectation, UserResponse, UserSession } from "types";

import { fetchUserSession, setUserSessionGrade } from "api";

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
  },
  container: {
    maxHeight: 440,
  },
});

export interface GradeInput {
  sessionId: string;
  index: number;
  graderGrade: number;
}

const SessionTable = () => {
  const classes = useStyles();

  const [userSession, setUserSession] = React.useState<UserSession>();
  const [sessionId, setSessionId] = React.useState("session1");
  const [question, setQuestion] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [expectations, setExpectations] = React.useState<Expectation[]>([]);
  const [userResponses, setUserResponses] = React.useState<UserResponse[]>([]);

  const [inputGrade, setInputGrade] = React.useState("");
  const [userIndex, setUserIndex] = React.useState(0);
  const [expectationIndex, setExpectationIndex] = React.useState(0);

  const [gradedAll, setGradedAll] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [sessionScore, setSessionScore] = React.useState("");

  const handleGradeExpectationChange = (
    event: React.ChangeEvent<{ value: unknown; name?: unknown }>
  ) => {
    const indeces = event.target.name as string;
    const indexSplit = indeces.split(" ");
    setUserIndex(Number(indexSplit[0]));
    setExpectationIndex(Number(indexSplit[1]));
    setInputGrade(event.target.value as string);
  };

  React.useEffect(() => {
    fetchUserSession(sessionId)
      .then((userSession) => {
        console.log(`fetchUserSession got`, userSession);
        if (userSession !== undefined) {
          setUserSession(userSession);
        }
        if (userSession.question.text !== undefined) {
          setQuestion(userSession.question.text);
        }
        if (userSession.username !== undefined) {
          setUsername(userSession.username);
        }
        if (userSession.question.expectations !== undefined) {
          setExpectations(userSession.question.expectations);
        }
        if (userSession.userResponses !== undefined) {
          setUserResponses(userSession.userResponses);
        }
        if (userSession.score !== undefined) {
          setScore(userSession.score);
        }

        let tmp = false;
        for (let i = 0; i < userResponses.length; i++) {
          for (let j = 0; j < expectations.length; j++) {
            if (
              userResponses[i].userResponseExpectationScores[j].graderGrade !==
              ""
            ) {
              tmp = true;
            } else {
              tmp = false;
              break;
            }
          }
          if (tmp) {
            break;
          }
        }
        setGradedAll(tmp);
      })
      .catch((err) => console.error(err));
  }, [sessionId]);

  React.useEffect(() => {
    setUserSessionGrade(sessionId, userIndex, expectationIndex, inputGrade)
      .then(() => {
        fetchUserSession(sessionId)
          .then((userSession) => {
            console.log(`updated expectation grade got`, userSession);
            if (userSession !== undefined) {
              setUserSession(userSession);
            }
            if (userSession.question.text !== undefined) {
              setQuestion(userSession.question.text);
            }
            if (userSession.username !== undefined) {
              setUsername(userSession.username);
            }
            if (userSession.question.expectations !== undefined) {
              setExpectations(userSession.question.expectations);
            }
            if (userSession.userResponses !== undefined) {
              setUserResponses(userSession.userResponses);
            }
            if (userSession.score !== undefined) {
              setScore(userSession.score);
            }
            let tmp = false;
            for (let i = 0; i < userResponses.length; i++) {
              for (let j = 0; j < expectations.length; j++) {
                if (
                  userResponses[i].userResponseExpectationScores[j]
                    .graderGrade !== ""
                ) {
                  tmp = true;
                } else {
                  tmp = false;
                  break;
                }
              }
              if (tmp) {
                break;
              }
            }
            setGradedAll(tmp);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }, [inputGrade]);

  React.useEffect(() => {
    console.log("First Render");
    let sum = 0;
    const total = userResponses.length * expectations.length;
    if (gradedAll) {
      for (let i = 0; i < userResponses.length; i++) {
        for (let j = 0; j < expectations.length; j++) {
          if (
            userResponses[i].userResponseExpectationScores[j].graderGrade ===
            "Good"
          ) {
            sum = sum + 1;
          }
        }
      }
      sum = sum / total;
      setSessionScore(sum.toString());
    }
  }, [gradedAll]);

  return (
    <Paper className={classes.root}>
      <div id="session-display-name">session 1</div>
      <div id="username"> {username}</div>
      <div id="question"> {question} </div>
      <div id="score"> Score: {gradedAll ? sessionScore : "?"} </div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell id="userAnswer">User Answer</TableCell>
              {expectations.map((column, i) => (
                <TableCell
                  key={`expectation-${i}`}
                  id={`expectation-${i}`}
                  align="right"
                  style={{ minWidth: 170 }}
                >
                  {column.text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {userResponses
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.text}>
                    <TableCell
                      key={`answer-${i}`}
                      id={`answer-${i}`}
                      align="left"
                    >
                      {row.text}
                    </TableCell>

                    {expectations.map((column, j) => (
                      <TableCell
                        key={`grade-${i}-${j}`}
                        id={`grade-${i}-${j}`}
                        align="right"
                      >
                        <Typography
                          key={`classifier-grade-${i}-${j}`}
                          id={`classifier-grade-${i}-${j}`}
                          align="right"
                        >
                          Classifier Grade:{" "}
                          {row.userResponseExpectationScores[j]
                            ? row.userResponseExpectationScores[j]
                                .classifierGrade
                            : ""}
                        </Typography>
                        <Typography
                          key={`expectation-grade-${i}-${j}`}
                          id={`expectation-grade-${i}-${j}`}
                          align="right"
                        >
                          Grade:
                          <Select
                            labelId={`set-grade-${i}-${j}`}
                            id={`select-grade-${i}-${j}`}
                            value={
                              row.userResponseExpectationScores[j].graderGrade
                            }
                            name={`${i} ${j}`}
                            onChange={handleGradeExpectationChange}
                          >
                            <MenuItem id={`empty-grade-${i}-${j}`} value="">
                              <em>Empty</em>
                            </MenuItem>
                            <MenuItem
                              id={`good-grade-${i}-${j}`}
                              value={"Good"}
                            >
                              Good
                            </MenuItem>
                            <MenuItem id={`bad-grade-${i}-${j}`} value={"Bad"}>
                              Bad
                            </MenuItem>
                          </Select>
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={sessions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      {/* <Link to="/">Done</Link> */}
    </Paper>
  );
};

const SessionPage = ({ path }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <SessionTable />
    </MuiThemeProvider>
  );
};

export default SessionPage;
