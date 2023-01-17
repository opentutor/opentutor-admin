/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { navigate, Link } from "gatsby";
import React, { useContext } from "react";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { userCanEdit } from "api";
import { Edge, Session } from "types";
import NavBar from "components/nav-bar";
import { ColumnDef, ColumnHeader } from "components/column-header";
import SessionContext from "context/session";
import withLocation from "wrap-with-location";
import "styles/layout.css";
import { useWithSessions } from "hooks/use-with-sessions";
import LoadingIndicator from "components/loading-indicator";

const useStyles = makeStyles((theme) => ({
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
  classes: { appBar: string; paging: string };
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}): JSX.Element {
  const { classes, hasNext, hasPrev, onNext, onPrev } = props;
  const context = useContext(SessionContext);
  const { onlyCreator, showGraded, toggleCreator, toggleGraded } = context;

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
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
        <div className={classes.paging}>
          <IconButton data-cy="prev-page" disabled={!hasPrev} onClick={onPrev}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton data-cy="next-page" disabled={!hasNext} onClick={onNext}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

function SessionItem(props: { row: Edge<Session>; i: number }): JSX.Element {
  const { row, i } = props;
  const context = useContext(SessionContext);
  const styles = useStyles();

  function handleGrade(): void {
    navigate(`/sessions/session?sessionId=${row.node.sessionId}`);
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

function SessionsTable(props: { search: { lessonId: string } }): JSX.Element {
  const classes = useStyles();
  const { sessions, sortBy, sortAsc, sort, nextPage, prevPage } =
    useWithSessions(props.search.lessonId);

  if (!sessions) {
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
                <SessionItem key={row.node.sessionId} row={row} i={i} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TableFooter
        classes={classes}
        hasNext={sessions.pageInfo.hasNextPage}
        hasPrev={sessions.pageInfo.hasPreviousPage}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </div>
  );
}

function SessionsPage(props: { search: { lessonId: string } }): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view sessions.</div>;
  }
  if (!context.user) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <NavBar title="Grading" />
      <SessionsTable search={props.search} />
    </div>
  );
}

export default withLocation(SessionsPage);
export { SessionsTable };
