import { withPrefix } from "gatsby";
import React from "react";
import { navigate } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
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
import EditIcon from "@material-ui/icons/Edit";
import withLocation from "wrap-with-location";
import { Session } from "types";
import { fetchSession, setGrade } from "api";
import NavBar from "components/nav-bar";
import "styles/layout.css";

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
  const [session, setSession] = React.useState<Session>();
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
      .then((session: Session) => {
        if (session) {
          setSession(session);
        }
      })
      .catch((err: string) => console.error(err));
  };

  function handleDone(): void {
    navigate(withPrefix(`/sessions`));
  }

  function handleEdit(lessonId: string): void {
    navigate(withPrefix("/lessons/edit?lessonId=" + lessonId));
  }

  React.useEffect(() => {
    let mounted = true;
    fetchSession(sessionId)
      .then((session: Session) => {
        if (mounted && session) {
          setSession(session);
        }
        setDate(session.createdAt);
      })
      .catch((err: string) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Paper className={classes.root}>
      <div id="lesson">
        {session && session.lesson && session.lesson.name
          ? session.lesson.name
          : "No Lesson Name"}
      </div>
      <div id="username">
        {session && session.username ? session.username : "Guest"}
      </div>
      <div id="date">{date ? date : ""}</div>
      <div id="question"> {session ? session.question.text : ""} </div>
      <div id="score">
        Score:{" "}
        {session
          ? session.graderGrade || session.graderGrade !== null
            ? Math.trunc(session.graderGrade * 100)
            : "?"
          : "?"}
      </div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ width: 100 }}>
                User Answer
              </TableCell>
              {session?.question?.expectations.map((column, i) => (
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
            {session?.userResponses.map((row, i) => {
              return (
                <TableRow
                  id={`response-${i}`}
                  key={`response-${i}`}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                >
                  <TableCell id="answer">{row.text}</TableCell>
                  {session?.question?.expectations.map((column, j) => (
                    <TableCell
                      style={{
                        backgroundColor:
                          row.expectationScores[j].graderGrade === "Good"
                            ? "#90EE90"
                            : row.expectationScores[j].graderGrade === "Bad"
                            ? "#F08080"
                            : row.expectationScores[j].graderGrade === "Neutral"
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
                      key={`grade-${j}`}
                      id={`grade-${j}`}
                      align="left"
                    >
                      <Typography
                        id="classifier-grade"
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
                        id="instructor-grade"
                        align="right"
                        component={"span"}
                      >
                        Grade:
                        <Select
                          id="select-grade"
                          labelId={`set-grade-${i}-${j}`}
                          value={
                            row.expectationScores[j]
                              ? row.expectationScores[j].graderGrade
                              : ""
                          }
                          name={`${i} ${j}`}
                          onChange={handleGradeExpectationChange}
                        >
                          <MenuItem id="none" value="">
                            <em>Empty</em>
                          </MenuItem>
                          <MenuItem id="good" value={"Good"}>
                            Good
                          </MenuItem>
                          <MenuItem id="bad" value={"Bad"}>
                            Bad
                          </MenuItem>
                          <MenuItem id="neutral" value={"Neutral"}>
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
      <div>
        <Button variant="contained" onClick={handleDone}>
          Done
        </Button>
        <IconButton
          onClick={() => {
            if (session) {
              handleEdit(session.lesson.lessonId);
            }
          }}
        >
          <EditIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

const SessionPage = ({ path, search }: { path: string; search: any }) => {
  return (
    <div>
      <NavBar title="Grade Session" />
      <SessionTable search={search} />
    </div>
  );
};

export default withLocation(SessionPage);
