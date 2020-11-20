/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { withPrefix } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { navigate } from "@reach/router";
import {
  AppBar,
  CircularProgress,
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@reach/router";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { fetchSessions } from "api";
import { Connection, Edge, Session } from "types";
import NavBar from "components/nav-bar";
import { ColumnDef, ColumnHeader } from "components/column-header";
import ToggleContext from "context/toggle";
import withLocation from "wrap-with-location";
import "styles/layout.css";

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
  progress: {
    marginLeft: "50%",
  },
  paging: {
    position: "absolute",
    right: theme.spacing(1),
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
    id: "grade-link",
    label: "Grade",
    minWidth: 0,
    align: "center",
    sortable: false,
  },
  {
    id: "graderGrade",
    label: "Instructor Grade",
    minWidth: 170,
    align: "center",
    format: (value: number): string => value.toLocaleString("en-US"),
    sortable: true,
  },
  {
    id: "classifierGrade",
    label: "Classifier Grade",
    minWidth: 170,
    align: "center",
    format: (value: number): string => value.toLocaleString("en-US"),
    sortable: true,
  },
  {
    id: "createdAt",
    label: "Date",
    minWidth: 170,
    align: "center",
    sortable: true,
  },
  {
    id: "lessonCreatedBy",
    label: "Created By",
    minWidth: 170,
    align: "center",
    sortable: true,
  },
  {
    id: "username",
    label: "Username",
    minWidth: 170,
    align: "center",
    sortable: true,
  },
];

const TableFooter = (props: {
  classes: any;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const { classes, hasNext, hasPrev, onNext, onPrev } = props;
  const context = useContext(ToggleContext);
  const { onlyCreator, showGraded, toggleCreator, toggleGraded } = context;

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                id="toggle-creator"
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
                id="toggle-graded"
                checked={showGraded}
                onChange={toggleGraded}
                aria-label="switch"
              />
            }
            label={"Show Graded"}
          />
        </FormGroup>
        <div className={classes.paging}>
          <IconButton id="prev-page" disabled={!hasPrev} onClick={onPrev}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton id="next-page" disabled={!hasNext} onClick={onNext}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const SessionItem = (props: { row: Edge<Session>; i: number }) => {
  const { row, i } = props;
  const context = useContext(ToggleContext);

  function handleGrade(): void {
    navigate(withPrefix(`/sessions/session?sessionId=${row.node.sessionId}`));
  }

  function canEdit() {
    const lesson = row.node.lesson;
    return (
      lesson &&
      (lesson.createdBy === `${context.user?.id}` ||
        lesson.userPermissions?.edit)
    );
  }

  return (
    <TableRow
      id={`session-${i}`}
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
      <TableCell id="lesson" align="left">
        {canEdit() ? (
          <Link
            to={withPrefix(
              `/lessons/edit?lessonId=${row.node.lesson.lessonId}`
            )}
          >
            {row.node.lesson?.name || "No Lesson Name"}
          </Link>
        ) : (
          row.node.lesson?.name || "No Lesson Name"
        )}
      </TableCell>
      <TableCell id="grade">
        <IconButton onClick={handleGrade} disabled={!canEdit()}>
          <AssignmentIcon />
        </IconButton>
      </TableCell>
      <TableCell id="instructor-grade" align="center">
        {row.node.graderGrade || row.node.graderGrade === 0
          ? Math.trunc(row.node.graderGrade * 100)
          : "?"}
      </TableCell>
      <TableCell id="classifier-grade" align="center">
        {row.node ? Math.trunc(row.node.classifierGrade * 100) : "?"}
      </TableCell>
      <TableCell id="date" align="center">
        {row.node.createdAt || ""}
      </TableCell>
      <TableCell id="creator" align="center">
        {row.node.lessonCreatedBy || "Guest"}
      </TableCell>
      <TableCell id="username" align="center">
        {row.node.username || "Guest"}
      </TableCell>
    </TableRow>
  );
};

const SessionsTable = (props: {
  path: string;
  search: { lessonId: string };
}) => {
  const classes = useStyles();
  const context = useContext(ToggleContext);
  const [sessions, setSessions] = React.useState<Connection<Session>>();
  const [cursor, setCursor] = React.useState("");
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortAsc, setSortAsc] = React.useState(false);
  const { lessonId } = props.search;
  const rowsPerPage = 50;

  function onSort(id: string) {
    if (sortBy === id) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(id);
    }
    setCursor("");
  }

  React.useEffect(() => {
    setCursor("");
  }, [context.onlyCreator, context.showGraded]);

  React.useEffect(() => {
    const filter: any = {};
    if (context.onlyCreator) {
      filter["lessonCreatedBy"] = context.user?.name;
    }
    if (!context.showGraded) {
      filter["graderGrade"] = null;
    }
    if (lessonId) {
      filter["lessonId"] = lessonId;
    }
    let mounted = true;
    fetchSessions(filter, rowsPerPage, cursor, sortBy, sortAsc)
      .then((sessions) => {
        if (mounted && sessions) {
          setSessions(sessions);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [
    context.onlyCreator,
    context.showGraded,
    rowsPerPage,
    cursor,
    sortBy,
    sortAsc,
  ]);

  if (!sessions) {
    return (
      <div className={classes.root}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <ColumnHeader
              columns={columns}
              sortBy={sortBy}
              sortAsc={sortAsc}
              onSort={onSort}
            />
            <TableBody id="sessions">
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
        onNext={() => {
          setCursor("next__" + sessions.pageInfo.endCursor);
        }}
        onPrev={() => {
          setCursor("prev__" + sessions.pageInfo.startCursor);
        }}
      />
    </div>
  );
};

const SessionsPage = (props: {
  path: string;
  search: { lessonId: string };
  children: any;
}) => {
  const context = useContext(ToggleContext);
  const [cookies] = useCookies(["accessToken"]);
  if (typeof window !== "undefined" && !cookies.accessToken) {
    navigate(withPrefix(`/`));
    return <div></div>;
  }
  if (!context.user) {
    return <CircularProgress />;
  }

  return (
    <div>
      <NavBar title="Grading" />
      <SessionsTable path={props.path} search={props.search} />
      {props.children}
    </div>
  );
};

export default withLocation(SessionsPage);
export { SessionsTable };
