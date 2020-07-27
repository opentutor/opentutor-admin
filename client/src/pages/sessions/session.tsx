import { withPrefix } from "gatsby";
import React from "react";
import { Link, navigate } from "@reach/router";
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
  Button,
  IconButton,
} from "@material-ui/core";
import withLocation from "wrap-with-location";
import { UserSession } from "types";
import { fetchUserSession, setGrade } from "api";
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
  },
  container: {
    maxHeight: 440,
  },
});

const SessionTable = ({ search }: { search: any }) => {
  const { sessionId } = search;
  const classes = useStyles();
  const [userSession, setUserSession] = React.useState<UserSession>();
  const [date, setDate] = React.useState<string>("");

  const handleGradeExpectationChange = (
    event: React.ChangeEvent<{ value: unknown; name?: unknown }>
  ): void => {
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

  function handleDone(): void {
    navigate(withPrefix(`/sessions`));
  }

  React.useEffect(() => {
    let mounted = true;
    fetchUserSession(sessionId)
      .then((userSession: UserSession) => {
        console.log("fetchUserSession got", userSession);
        if (mounted) {
          if (userSession !== undefined) {
            setUserSession(userSession);
          }
        }
        const d = new Date(userSession.createdAt);
        setDate(d.toLocaleString());
      })
      .catch((err: any) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Paper className={classes.root}>
      <div id="session-display-name" key="session-display-name">
        {userSession && userSession.lesson && userSession.lesson.name
          ? userSession.lesson.name
          : "No Lesson Name"}
      </div>
      <div id="username" key="username">
        {" "}
        {userSession && userSession.username ? userSession.username : "Guest"}
      </div>
      <div id="Date" key="Date">
        {" "}
        {date ? date : ""}
      </div>
      <div id="question"> {userSession ? userSession.question.text : ""} </div>
      <div id="score">
        {" "}
        Score:{" "}
        {userSession
          ? userSession.score || userSession.score !== null
            ? Math.trunc(userSession.score * 100)
            : "?"
          : "?"}{" "}
      </div>
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
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`text-${i}`}
                  >
                    {/* <TableCell
                      key={`launch-${i}`}
                      id={`launch-${i}`}
                    >
                      <IconButton>
                        <LaunchIcon />
                      </IconButton>
                    </TableCell> */}
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
                              : row.expectationScores[j].graderGrade === "" &&
                                row.expectationScores.some(
                                  (score) =>
                                    score.graderGrade === "Good" ||
                                    score.graderGrade === "Bad" ||
                                    score.graderGrade === "Neutral"
                                )
                              ? "#D3D3D3"
                              : "white",
                        }}
                        key={`grade-${i}-${j}`}
                        id={`grade-${i}-${j}`}
                        align="left"
                      >
                        <Typography
                          key={`classifier-grade-${i}-${j}`}
                          id={`classifier-grade-${i}-${j}`}
                          align="right"
                          component={"span"}
                        >
                          Classifier Grade:{" "}
                          {row.expectationScores[j]
                            ? row.expectationScores[j].classifierGrade
                            : ""}
                        </Typography>
                        <br />
                        <Typography
                          key={`expectation-grade-${i}-${j}`}
                          id={`expectation-grade-${i}-${j}`}
                          align="right"
                          component={"span"}
                        >
                          Grade:
                          <Select
                            labelId={`set-grade-${i}-${j}`}
                            id={`select-grade-${i}-${j}`}
                            key={`select-grade-${i}-${j}`}
                            value={
                              row.expectationScores[j]
                                ? row.expectationScores[j].graderGrade
                                : ""
                            }
                            name={`${i} ${j}`}
                            onChange={handleGradeExpectationChange}
                          >
                            <MenuItem
                              id={`empty-grade-${i}-${j}`}
                              key={`empty-grade-${i}-${j}`}
                              value=""
                            >
                              <em>Empty</em>
                            </MenuItem>
                            <MenuItem
                              id={`good-grade-${i}-${j}`}
                              key={`good-grade-${i}-${j}`}
                              value={"Good"}
                            >
                              Good
                            </MenuItem>
                            <MenuItem
                              id={`bad-grade-${i}-${j}`}
                              key={`bad-grade-${i}-${j}`}
                              value={"Bad"}
                            >
                              Bad
                            </MenuItem>
                            <MenuItem
                              id={`neutral-grade-${i}-${j}`}
                              key={`neutral-grade-${i}-${j}`}
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
      <Button variant="contained" onClick={handleDone}>
        Done
      </Button>
    </Paper>
  );
};

const SessionPage = ({ path, search }: { path: string; search: any }) => {
  console.log(path);
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar title="Grade Session" />
      <SessionTable search={search} />
    </MuiThemeProvider>
  );
};

export default withLocation(SessionPage);
