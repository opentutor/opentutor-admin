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
import { UserSession } from "types";
import { fetchUserSession, setGrade } from "api";

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

const SessionTable = () => {
  const queryString = require("query-string");
  const parsed = queryString.parse(location.search);
  const classes = useStyles();

  const [userSession, setUserSession] = React.useState<UserSession>();
  const [sessionId, setSessionId] = React.useState(parsed.sessionId);
  const [userIndex, setUserIndex] = React.useState(0);
  const [expectationIndex, setExpectationIndex] = React.useState(0);
  const [gradedAll, setGradedAll] = React.useState(false);
  const [sessionScore, setSessionScore] = React.useState("");

  const handleGradeExpectationChange = (
    event: React.ChangeEvent<{ value: unknown; name?: unknown }>
  ): void => {
    const indeces = event.target.name as string;
    const indexSplit = indeces.split(" ");
    setSessionId(sessionId);
    setUserIndex(Number(indexSplit[0]));
    setExpectationIndex(Number(indexSplit[1]));

    const inputGrade = event.target.value as string;
    setGrade(sessionId, userIndex, expectationIndex, inputGrade)
      .then((userSession) => {
        console.log("updated grade", userSession);
        if (userSession !== undefined) {
          setUserSession(userSession);
        }
      })
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    fetchUserSession(sessionId)
      .then((userSession) => {
        console.log("fetchUserSession got", userSession);
        if (userSession !== undefined) {
          setUserSession(userSession);
        }
      })
      .catch((err) => console.error(err));
    return;
  }, []);

  React.useEffect(() => {
    let sum = 0;
    let total = 0;
    const responseSize = userSession ? userSession.userResponses.length : 0;

    if (gradedAll) {
      for (let i = 0; i < responseSize; i++) {
        const expectationSize = userSession
          ? userSession.userResponses[i].expectationScores.length
          : 0;
        total += expectationSize;
        for (let j = 0; j < expectationSize; j++) {
          if (
            userSession?.userResponses[i].expectationScores[j].graderGrade ===
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

  React.useEffect(() => {
    if (userSession === undefined) {
      return;
    }

    const responseSize = userSession.userResponses.length;
    for (let i = 0; i < responseSize; i++) {
      const expectationSize =
        userSession.userResponses[i].expectationScores.length;
      for (let j = 0; j < expectationSize; j++) {
        if (
          userSession.userResponses[i].expectationScores[j].graderGrade === ""
        ) {
          setGradedAll(false);
          return;
        }
      }
    }
    setGradedAll(true);
  }, [userSession]);

  return (
    <Paper className={classes.root}>
      <div id="session-display-name">{sessionId ? sessionId : ""}</div>
      <div id="username"> {userSession ? userSession.username : ""}</div>
      <div id="question"> {userSession ? userSession.question.text : ""} </div>
      {/* <div id="score"> Score: {gradedAll ? sessionScore : "?"} </div> */}
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell id="userAnswer">User Answer</TableCell>
              {userSession?.question?.expectations.map((column, i) => (
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
            {userSession?.userResponses
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

                    {userSession?.question?.expectations.map((column, j) => (
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
                          {row.expectationScores[j]
                            ? row.expectationScores[j].classifierGrade
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
                              row.expectationScores[j]
                                ? row.expectationScores[j].graderGrade
                                : ""
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
    </Paper>
  );
};

const SessionPage = ({ path }: { path: string }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <SessionTable />
    </MuiThemeProvider>
  );
};

export default SessionPage;
