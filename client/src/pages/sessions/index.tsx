/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { navigate, Link } from "gatsby";
import React, { useContext, useMemo } from "react";
import { useCookies } from "react-cookie";
import {
  AppBar,
  FormGroup,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  Switch,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Tooltip,
  Box,
  Theme,
  Autocomplete,
  TextField,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { userCanEdit } from "api";
import { Edge, Session } from "types";
import NavBar from "components/nav-bar";
import { ColumnDef, ColumnHeader } from "components/column-header";
import SessionContext from "context/session";
import withLocation from "wrap-with-location";
import "styles/layout.css";
import { useWithSessions } from "hooks/use-with-sessions";
import LoadingIndicator from "components/loading-indicator";
import { useWithLessons } from "hooks/use-with-lessons";
import { useWithUsers } from "hooks/use-with-users";

const useStyles = makeStyles({ name: "SessionsPage" })((theme: Theme) => ({
  root: {
    display: "flex",
    flexFlow: "column",
  },
  container: {
    flexGrow: 1,
  },
  appBar: {
    height: "10%",
    top: "auto",
    bottom: 0,
  },
  paging: {
    position: "absolute",
    right: theme.spacing(1),
  },
  normalButton: {
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

const columns: ColumnDef[] = [
  {
    id: "lessonName",
    label: "Lesson",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "lessonCreatedBy",
    label: "Created By",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "createdAt",
    label: "Date",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "username",
    label: "Username",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "classifierGrade",
    label: "Classifier Grade",
    minWidth: 100,
    align: "right",
    format: (value: number): string => value.toLocaleString("en-US"),
    sortable: true,
  },
  {
    id: "graderGrade",
    label: "Instructor Grade",
    minWidth: 100,
    align: "right",
    format: (value: number): string => value.toLocaleString("en-US"),
    sortable: true,
  },
  {
    id: "lastGradedAt",
    label: "Last Graded At",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "actions",
    label: "",
    minWidth: 0,
    align: "center",
    sortable: false,
  },
];

function TableFooter(props: {
  lessonDict: Record<string, string>;
  usernameList: string[];
  searchLessonId: string;
  classes: { appBar: string; paging: string };
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}): JSX.Element {
  const {
    usernameList,
    lessonDict,
    classes,
    hasNext,
    hasPrev,
    onNext,
    onPrev,
    searchLessonId,
  } = props;
  const context = useContext(SessionContext);
  const {
    onlyCreator,
    showGraded,
    showAbandoned,
    filterByLesson,
    filterByUsername,
    setFilterByUsername,
    toggleCreator,
    toggleGraded,
    toggleAbandoned,
    setFilterByLesson,
  } = context;

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%">
          <div
            style={{ display: "flex", flexDirection: "row", width: "33.33%" }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    data-cy="toggle-creator"
                    checked={onlyCreator}
                    onChange={toggleCreator}
                    aria-label="switch"
                  />
                }
                label={"Only Mine"}
              />
            </FormGroup>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    data-cy="toggle-graded"
                    checked={showGraded}
                    onChange={toggleGraded}
                    aria-label="switch"
                  />
                }
                label={"Show Graded"}
              />
            </FormGroup>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    data-cy="toggle-abandoned"
                    checked={showAbandoned}
                    onChange={toggleAbandoned}
                    aria-label="switch"
                  />
                }
                label={"Show Abandoned"}
              />
            </FormGroup>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "33.33%",
            }}
          >
            <Autocomplete
              style={{
                width: "40%",
              }}
              data-cy="lesson-filter"
              defaultValue={filterByLesson || searchLessonId}
              options={Object.keys(lessonDict)}
              getOptionLabel={(option) => lessonDict[option]}
              renderInput={(params) => <TextField {...params} label="Lesson" />}
              onChange={(event, value) => {
                const lessonId = value ?? "";
                console.log("lessonId", lessonId);
                setFilterByLesson(lessonId);
              }}
            />
            <Autocomplete
              style={{
                width: "40%",
              }}
              data-cy="username-filter"
              defaultValue={filterByUsername}
              options={usernameList}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} label="User" />}
              onChange={(event, value) => {
                const username = value ?? "";
                console.log("username", username);
                setFilterByUsername(username);
              }}
            />
          </div>

          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-end",
              width: "33.33%",
            }}
          >
            <IconButton
              data-cy="prev-page"
              disabled={!hasPrev}
              onClick={onPrev}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              data-cy="next-page"
              disabled={!hasNext}
              onClick={onNext}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function SessionItem(props: {
  row: Edge<Session>;
  i: number;
  cursor: string;
}): JSX.Element {
  const { row, i, cursor } = props;
  const context = useContext(SessionContext);
  const { classes: styles } = useStyles();

  function handleGrade(): void {
    if (cursor)
      navigate(
        `/sessions/session?sessionId=${row.node.sessionId}&cursor=${cursor}`
      );
    else navigate(`/sessions/session?sessionId=${row.node.sessionId}`);
  }

  return (
    <TableRow
      data-cy={`session-${i}`}
      hover
      role="checkbox"
      tabIndex={-1}
      style={{
        backgroundColor:
          row.node.graderGrade || row.node.graderGrade === 0
            ? "#D3D3D3"
            : "white",
      }}
    >
      <TableCell data-cy="lesson" align="left">
        {userCanEdit(row.node.lesson, context.user) ? (
          <Link
            data-cy="lesson-link"
            to={`/lessons/edit?lessonId=${row.node.lesson.lessonId}`}
          >
            {row.node.lesson?.name || "No Lesson Name"}
          </Link>
        ) : (
          row.node.lesson?.name || "No Lesson Name"
        )}
      </TableCell>
      <TableCell data-cy="creator" align="left">
        {row.node.lessonCreatedBy || "Guest"}
      </TableCell>
      <TableCell data-cy="date" align="left">
        {new Date(row.node.createdAt).toLocaleString() || ""}
      </TableCell>
      <TableCell data-cy="username" align="left">
        {row.node.username || "Guest"}
      </TableCell>
      <TableCell data-cy="classifier-grade" align="right">
        {row.node ? Math.trunc(row.node.classifierGrade * 100) : "?"}
      </TableCell>
      <TableCell data-cy="instructor-grade" align="right">
        {row.node.graderGrade || row.node.graderGrade === 0
          ? Math.trunc(row.node.graderGrade * 100)
          : "N/A"}
      </TableCell>
      <TableCell data-cy="last-graded-at" align="left">
        {row.node.lastGradedAt ? (
          <Tooltip
            title={`Graded By: ${row.node.lastGradedByName || "Unknown"}`}
            arrow
          >
            <Box>{row.node.lastGradedAt}</Box>
          </Tooltip>
        ) : (
          "Never"
        )}
      </TableCell>
      <TableCell data-cy="actions" align="center">
        <Tooltip title="Grade" arrow>
          <IconButton
            data-cy="grade-button"
            onClick={handleGrade}
            disabled={!userCanEdit(row.node.lesson, context.user)}
            className={styles.normalButton}
          >
            <AssessmentIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

function SessionsTable(props: {
  search: { lessonId: string; cursor: string };
  accessToken: string;
}): JSX.Element {
  const { classes } = useStyles();
  const {
    sessions,
    sortBy,
    sortAsc,
    sort,
    cursor,
    nextPage,
    prevPage,
    loading: sessionsLoading,
  } = useWithSessions(props.search.lessonId, props.search.cursor);
  const { data: lessons, isLoading: lessonsLoading } = useWithLessons(
    props.accessToken
  );
  const { data: users, isLoading: usersLoading } = useWithUsers(
    props.accessToken
  );
  const lessonDict = useMemo(() => {
    return lessons?.edges.reduce((acc, lesson) => {
      acc[lesson.node.lessonId] = lesson.node.name;
      return acc;
    }, {} as Record<string, string>);
  }, [lessons?.edges.length]);
  const usernameList = useMemo(() => {
    return users?.edges.map((edge) => edge.node.name);
  }, [users?.edges.length]);
  if (!sessions || lessonsLoading || sessionsLoading || usersLoading) {
    return (
      <div className={classes.root}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <TableContainer style={{ height: "calc(100vh - 128px)" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            data-cy="sessions-table"
          >
            <ColumnHeader
              columns={columns}
              sortBy={sortBy}
              sortAsc={sortAsc}
              onSort={sort}
            />
            <TableBody data-cy="sessions">
              {sessions.edges.map((row, i) => (
                <SessionItem
                  key={row.node.sessionId}
                  row={row}
                  i={i}
                  cursor={cursor}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TableFooter
        usernameList={usernameList || []}
        searchLessonId={props.search.lessonId}
        lessonDict={lessonDict || {}}
        classes={classes}
        hasNext={sessions.pageInfo.hasNextPage}
        hasPrev={sessions.pageInfo.hasPreviousPage}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </div>
  );
}

function SessionsPage(props: {
  search: { lessonId: string; cursor: string };
}): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);

  // Only check cookies after client hydration to avoid SSR mismatch
  if (context.isClient && !cookies.accessToken) {
    return <div>Please login to view sessions.</div>;
  }
  if (!context.user) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <NavBar title="Grading" />
      <SessionsTable search={props.search} accessToken={cookies.accessToken} />
    </div>
  );
}

export default withLocation(SessionsPage);
export { SessionsTable };
