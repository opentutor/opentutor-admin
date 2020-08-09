import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
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
import { withPrefix, navigate } from "gatsby";
import { Link } from "@reach/router";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import EditIcon from "@material-ui/icons/Edit";
import { fetchSessions } from "api";
import { Edge, SessionsData } from "types";
import NavBar from "components/nav-bar";
import { ColumnDef, ColumnHeader } from "components/column-header";
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
    display: "flex",
    flexFlow: "column",
  },
  container: {},
  appBar: {
    height: "10%",
    top: "auto",
    bottom: 0,
  },
  progress: {
    marginLeft: "50%",
  },
  toggle: {
    position: "absolute",
    right: theme.spacing(1),
  },
});

const columns: ColumnDef[] = [
  { id: "sessionId", label: "Lesson", minWidth: 170, align: "center" },
  { id: "username", label: "Username", minWidth: 170, align: "center" },
  { id: "createdAt", label: "Date", minWidth: 170, align: "center" },
  {
    id: "classifierGrade",
    label: "Classifier Grade",
    minWidth: 170,
    align: "center",
    format: (value: number): string => value.toLocaleString("en-US"),
  },
  {
    id: "grade",
    label: "Grade",
    minWidth: 170,
    align: "center",
    format: (value: number): string => value.toLocaleString("en-US"),
  },
];

const SessionItem = (props: { row: Edge; i: number }) => {
  const { row, i } = props;

  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.node.sessionId}>
      <TableCell key={`session-${i}`} id={`session-${i}`} align="left">
        <Link
          to={withPrefix(`/sessions/session?sessionId=${row.node.sessionId}`)}
        >
          {row.node.lesson && row.node.lesson.name
            ? row.node.lesson.name
            : "No Lesson Name"}
        </Link>
      </TableCell>
      <TableCell key={`username-${i}`} align="center">
        {row.node.username ? row.node.username : "Guest"}
      </TableCell>
      <TableCell key={`date-${i}`} align="center">
        {row.node.createdAt ? row.node.createdAt.toLocaleString() : ""}
      </TableCell>
      <TableCell key={`classifier-grade-${i}`} align="center">
        {row.node ? Math.trunc(row.node.classifierGrade * 100) : "?"}
      </TableCell>
      <TableCell key={`grade-${i}`} align="center">
        {row.node.graderGrade || row.node.graderGrade === 0
          ? Math.trunc(row.node.graderGrade * 100)
          : "?"}
      </TableCell>
    </TableRow>
  );
};

const TableFooter = (props: {
  classes: any;
  hasNext: boolean;
  hasPrev: boolean;
  showGraded: boolean;
  onNext: () => void;
  onPrev: () => void;
  onToggleGraded: () => void;
}) => {
  const {
    classes,
    hasNext,
    hasPrev,
    showGraded,
    onNext,
    onPrev,
    onToggleGraded,
  } = props;

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        <IconButton disabled={!hasPrev} onClick={onPrev}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton disabled={!hasNext} onClick={onNext}>
          <KeyboardArrowRightIcon />
        </IconButton>
        <FormGroup className={classes.toggle}>
          <FormControlLabel
            id="toggle"
            control={
              <Switch
                checked={showGraded}
                onChange={onToggleGraded}
                aria-label="switch"
              />
            }
            label={"Show Graded"}
          />
        </FormGroup>
      </Toolbar>
    </AppBar>
  );
};

export const SessionsTable = (props: { path: string }) => {
  const classes = useStyles();
  const [sessions, setSessions] = React.useState<SessionsData>();
  const [showGraded, setShowGraded] = React.useState(false);
  const [prevPages, setPrevPages] = React.useState<string[]>([""]);
  const [page, setPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortDesc, setSortDesc] = React.useState(true);
  const rowsPerPage = 50;

  function onSort(id: string) {
    setSortBy(id);
    setSortDesc(!sortDesc);
  }

  function nextPage() {}

  function prevPage() {}

  const handleShowGradedChange = (): void => {
    setShowGraded(!showGraded);
  };

  React.useEffect(() => {
    fetchSessions(rowsPerPage, prevPages[page], sortBy, sortDesc)
      .then((sessions) => {
        console.log(`fetchSessions got`, sessions);
        if (sessions !== undefined) {
          const tmp: any = sessions.edges;
          tmp.map((session: any) => {
            session.node.createdAt = new Date(session.node.createdAt);
          });
          setSessions(sessions);
        }
      })
      .catch((err) => console.error(err));
  }, [page, prevPages, sortBy, sortDesc]);

  if (!sessions) {
    return (
      <div className={classes.root}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  }

  function handleEdit(lessonId: string): void {
    navigate(withPrefix("/lessons/edit?lessonId=" + lessonId));
  }

  return (
    <div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <ColumnHeader
              columns={columns}
              sortBy={sortBy}
              sortDesc={sortDesc}
              onSort={onSort}
            />
            <TableBody>
              {sessions.edges
                .filter(
                  (edge: Edge) => showGraded || edge.node.graderGrade === null
                )
                .map((row, i) => (
                  <SessionItem row={row} i={i} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TableFooter
        classes={classes}
        hasNext={sessions.pageInfo.hasNextPage}
        hasPrev={prevPages.length > 1}
        showGraded={showGraded}
        onNext={nextPage}
        onPrev={prevPage}
        onToggleGraded={handleShowGradedChange}
      />
    </div>
  );
};

const SessionsPage = (props: { path: string; children: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar title="Sessions" />
      <SessionsTable path={props.path} />
      {props.children}
    </MuiThemeProvider>
  );
};

export default SessionsPage;
