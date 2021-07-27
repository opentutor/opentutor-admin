/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { navigate } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
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
  CircularProgress,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import withLocation from "wrap-with-location";
import { Session } from "types";
import { fetchSession, setGrade, userCanEdit } from "api";
import SessionContext from "context/session";
import NavBar from "components/nav-bar";
import "styles/layout.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  progress: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const SessionTable = (props: { search: { sessionId: string } }) => {
  const { sessionId } = props.search;
  const classes = useStyles();
  const [cookies] = useCookies(["accessToken"]);
  const context = useContext(SessionContext);
  const [session, setSession] = React.useState<Session>();
  const [date, setDate] = React.useState<string>("");

  const handleGradeExpectationChange = (
    event: React.ChangeEvent<{ value: unknown; name?: unknown }>
  ): void => {
    const indexes = event.target.name as string;
    const indexSplit = indexes.split(" ");

    setGrade(
      sessionId,
      Number(indexSplit[0]),
      Number(indexSplit[1]),
      event.target.value as string,
      cookies.accessToken
    )
      .then((session: Session) => {
        if (session) {
          setSession(session);
        }
      })
      .catch((err: string) => console.error(err));
  };

  function handleDone(): void {
    navigate(`/sessions`);
  }

  function handleEdit(lessonId: string): void {
    navigate(`/lessons/edit?lessonId=${lessonId}`);
  }

  React.useEffect(() => {
    let mounted = true;
    fetchSession(sessionId, cookies.accessToken)
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

  if (!session) {
    return <CircularProgress className={classes.progress} />;
  }

  if (
    !session ||
    !session.lesson ||
    !userCanEdit(session.lesson, context.user)
  ) {
    return <div>You do not have permission to grade this session.</div>;
  }

  const expectationIdToColumnMap: Map<string, number> = new Map<
    string,
    number
  >();

  return (
    <Paper className={classes.root}>
      <div data-cy="lesson">{session.lesson?.name || "No Lesson Name"}</div>
      <div data-cy="username">{session.username || "Guest"}</div>
      <div data-cy="date">{date ? date : ""}</div>
      <div data-cy="question"> {session.question?.text || ""} </div>
      <div data-cy="score">
        Score:{" "}
        {session.graderGrade || session.graderGrade !== null
          ? Math.trunc(session.graderGrade * 100)
          : "?"}
      </div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" data-cy="session-table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ width: 100 }}>
                User Answer
              </TableCell>
              {session.question?.expectations.map((column, i: number) => {
                expectationIdToColumnMap.set(column.expectationId, i);
                return (
                  <TableCell
                    key={`expectation-${i}`}
                    data-cy={`expectation-${i}`}
                    align="center"
                    style={{ width: 170 }}
                  >
                    {column.text}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {session?.userResponses.map((row, i) => {
              return (
                <TableRow
                  data-cy={`response-${i}`}
                  key={`response-${i}`}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                >
                  <TableCell data-cy="answer">{row.text}</TableCell>
                  {session?.question?.expectations.map((column) => {
                    const j = expectationIdToColumnMap.get(
                      column.expectationId
                    );
                    if (isNaN(Number(j))) {
                      return;
                    }

                    return (
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
                        key={`grade-${j}`}
                        data-cy={`grade-${j}`}
                        align="left"
                      >
                        <Typography
                          data-cy="classifier-grade"
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
                          data-cy="instructor-grade"
                          align="right"
                          component={"span"}
                        >
                          Grade:
                          <Select
                            data-cy="select-grade"
                            labelId={`set-grade-${i}-${j}`}
                            value={
                              row.expectationScores[j]
                                ? row.expectationScores[j].graderGrade
                                : ""
                            }
                            name={`${i} ${j}`}
                            onChange={handleGradeExpectationChange}
                          >
                            <MenuItem data-cy="none" value="">
                              <em>Empty</em>
                            </MenuItem>
                            <MenuItem data-cy="good" value={"Good"}>
                              Good
                            </MenuItem>
                            <MenuItem data-cy="bad" value={"Bad"}>
                              Bad
                            </MenuItem>
                            <MenuItem data-cy="neutral" value={"Neutral"}>
                              Neutral
                            </MenuItem>
                          </Select>
                        </Typography>
                      </TableCell>
                    );
                  })}
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

const SessionPage = (props: { search: { sessionId: string } }) => {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const styles = useStyles();
  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view session.</div>;
  }
  if (!context.user) {
    return <CircularProgress className={styles.progress} />;
  }

  return (
    <div>
      <NavBar title="Grade Session" disableMenu={true} />
      <SessionTable search={props.search} />
    </div>
  );
};

export default withLocation(SessionPage);
