import { withPrefix } from "gatsby";
import React, { useContext } from "react";
import { navigate } from "@reach/router";
import { useCookies } from "react-cookie";
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
  const [cookies] = useCookies(["user"]);
  const toggle = useContext(ToggleContext);
  const { onlyCreator, showGraded, toggleCreator, toggleGraded } = toggle;

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        {!cookies.user ? undefined : (
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={onlyCreator}
                  onChange={toggleCreator}
                  aria-label="switch"
                />
              }
              label={"Only Mine"}
            />
          </FormGroup>
        )}
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                id="toggle"
                checked={showGraded}
                onChange={toggleGraded}
                aria-label="switch"
              />
            }
            label={"Show Graded"}
          />
        </FormGroup>
        <div className={classes.paging}>
          <IconButton disabled={!hasPrev} onClick={onPrev}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton disabled={!hasNext} onClick={onNext}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const SessionItem = (props: { row: Edge<Session>; i: number }) => {
  const { row, i } = props;

  function handleGrade(): void {
    navigate(withPrefix(`/sessions/session?sessionId=${row.node.sessionId}`));
  }

  return (
    <TableRow
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
      <TableCell key={`lesson-${i}`} id={`lesson-${i}`} align="left">
        <Link
          to={withPrefix(`/lessons/edit?lessonId=${row.node.lesson.lessonId}`)}
        >
          {row.node.lesson && row.node.lesson.name
            ? row.node.lesson.name
            : "No Lesson Name"}
        </Link>
      </TableCell>
      <TableCell>
        <IconButton id={`launch-${i}`} onClick={handleGrade}>
          <AssignmentIcon />
        </IconButton>
      </TableCell>{" "}
      <TableCell key={`instructor-grade-${i}`} align="center">
        {row.node.graderGrade || row.node.graderGrade === 0
          ? Math.trunc(row.node.graderGrade * 100)
          : "?"}
      </TableCell>
      <TableCell key={`classifier-grade-${i}`} align="center">
        {row.node ? Math.trunc(row.node.classifierGrade * 100) : "?"}
      </TableCell>
      <TableCell key={`date-${i}`} align="center">
        {row.node.createdAt ? row.node.createdAt : ""}
      </TableCell>
      <TableCell key={`creator-${i}`} align="center">
        {row.node.lesson.createdBy ? row.node.lesson.createdBy : "Guest"}
      </TableCell>
      <TableCell key={`username-${i}`} align="center">
        {row.node.username ? row.node.username : "Guest"}
      </TableCell>
    </TableRow>
  );
};

const SessionsTable = (props: {
  path: string;
  search: { lessonId: string };
}) => {
  const classes = useStyles();
  const toggle = useContext(ToggleContext);
  const [cookies] = useCookies(["user"]);
  const [sessions, setSessions] = React.useState<Connection<Session>>();
  const [cursor, setCursor] = React.useState("");
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortAsc, setSortAsc] = React.useState(false);
  const { onlyCreator, showGraded } = toggle;
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
    const filter: any = {};
    if (onlyCreator) {
      filter["lessonCreatedBy"] = `${cookies.user}`;
    }
    if (!showGraded) {
      filter["graderGrade"] = null;
    }
    if (lessonId) {
      filter["lessonId"] = lessonId;
    }
    let mounted = true;
    fetchSessions(filter, rowsPerPage, cursor, sortBy, sortAsc)
      .then((sessions) => {
        console.log(`fetchSessions got`, sessions);
        if (mounted && sessions) {
          setSessions(sessions);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [onlyCreator, showGraded, rowsPerPage, cursor, sortBy, sortAsc]);

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
            <TableBody>
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
