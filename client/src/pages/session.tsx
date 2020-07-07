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
import withLocation from "wrap-with-location";
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

const SessionTable = ({ search }: { search: any }) => {
  const { sessionId } = search;
  const classes = useStyles();
  const [userSession, setUserSession] = React.useState<UserSession>();

  const handleGradeExpectationChange = (
    event: React.ChangeEvent<{ value: unknown; name?: unknown }>
  ):void => {
    const indeces = event.target.name as string;
    const indexSplit = indeces.split(" ");

    setGrade(
      sessionId,
      Number(indexSplit[0]),
      Number(indexSplit[1]),
      event.target.value as string
    )
      .then((userSession: UserSession) => {
        console.log("updated grade", userSession);
        if (userSession !== undefined) {
          setUserSession(userSession);
        }
      })
      .catch((err: any) => console.error(err));
  };

  React.useEffect(() => {
    fetchUserSession(sessionId)
      .then((userSession: UserSession) => {
        console.log("fetchUserSession got", userSession);
        if (userSession !== undefined) {
          setUserSession(userSession);
        }
      })
      .catch((err: any) => console.error(err));
    return;
  }, []);

  return (
    <Paper className={classes.root}>
      <div id="session-display-name">session 1</div>
      <div id="session-display-name">{sessionId ? sessionId : ""}</div>
      <div id="username"> {userSession ? userSession.username : ""}</div>
      <div id="question"> {userSession ? userSession.question.text : ""} </div>
      <div id="score"> Score: {userSession ? userSession.score : "?"} </div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell id="userAnswer" align="center" style={{ width: 100 }}>
                User Answer
              </TableCell>
              {userSession?.question?.expectations.map((column, i) => (
                <TableCell
                  key={`expectation-${i}`}
                  id={`expectation-${i}`}
                  align="center"
                  style={{ width: 170 }}
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
                      //align="left"
                    >
                      {row.text}
                    </TableCell>

                    {userSession?.question?.expectations.map((column, j) => (
                      <TableCell
                        style={{
                          backgroundColor:
                            row.expectationScores[j].graderGrade === "Good"
                              ? "#90EE90"
                              : row.expectationScores[j].graderGrade === "Bad"
                              ? "#F08080"
                              : row.expectationScores[j].graderGrade ===
                                "Neutral"
                              ? "#D3D3D3"
                              : "white",
                        }}
                        key={`grade-${i}-${j}`}
                        id={`grade-${i}-${j}`}
                        align="right"
                      >
                        <Typography
                          component={'span'}
                          key={`classifier-grade-${i}-${j}`}
                          id={`classifier-grade-${i}-${j}`}
                          align="right"
                        >
                          Classifier Grade:{" "}
                          {row.expectationScores[j]
                            ? row.expectationScores[j]
                                .classifierGrade
                            : ""}
                        </Typography>

                        <Typography
                          component={'span'}
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
                            <MenuItem
                              id={`neutral-grade-${i}-${j}`}
                              value={"Neutral"}
                            >
                              Neutral
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

const SessionPage = ({ path, search }: { path: string; search: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <SessionTable search={search} />
    </MuiThemeProvider>
  );
};

export default withLocation(SessionPage);
