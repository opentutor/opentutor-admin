import { withPrefix, navigate } from "gatsby";
import React from "react";
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
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import { Link } from "@reach/router";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import EditIcon from "@material-ui/icons/Edit";
import { fetchSessions } from "api";
import { Edge, Session, SessionsData } from "types";
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
  toggle: {
    position: "absolute",
    right: theme.spacing(1),
  },
});

const columns: ColumnDef[] = [
  { id: "lessonName", label: "Lesson", minWidth: 170, align: "left" },
  { id: "lessonCreatedBy", label: "Created By", minWidth: 170, align: "left" },
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
  { id: "", label: "Edit", minWidth: 0, align: "center" },
];

const SessionItem = (props: { row: Edge<Session>; i: number }) => {
  const { row, i } = props;

  function handleEdit(lessonId: string): void {
    navigate(withPrefix("/lessons/edit?lessonId=" + lessonId));
  }

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell key={`session-${i}`} id={`session-${i}`} align="left">
        <Link
          to={withPrefix(`/sessions/session?sessionId=${row.node.sessionId}`)}
        >
          {row.node.lesson && row.node.lesson.name
            ? row.node.lesson.name
            : "No Lesson Name"}
        </Link>
      </TableCell>
      <TableCell key={`creator-${i}`} align="left">
        {row.node.lesson.createdBy ? row.node.lesson.createdBy : "Guest"}
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
      <TableCell>
        <IconButton
          onClick={() => {
            handleEdit(row.node.lesson.lessonId);
          }}
        >
          <EditIcon />
        </IconButton>
      </TableCell>{" "}
    </TableRow>
  );
};

const TableFooter = (props: {
  classes: any;
  hasNext: boolean;
  hasPrev: boolean;
  showGraded: boolean;
  showCreator: boolean;
  onNext: () => void;
  onPrev: () => void;
  onToggleGraded: () => void;
  onToggleCreator: () => void;
}) => {
  const {
    classes,
    hasNext,
    hasPrev,
    showGraded,
    showCreator,
    onNext,
    onPrev,
    onToggleGraded,
    onToggleCreator,
  } = props;
  const [cookies] = useCookies(["user"]);

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        <IconButton disabled={!hasPrev} onClick={onPrev}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton disabled={!hasNext} onClick={onNext}>
          <KeyboardArrowRightIcon />
        </IconButton>
        {!cookies.user ? undefined : (
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showCreator}
                  onChange={onToggleCreator}
                  aria-label="switch"
                />
              }
              label={"Only Mine"}
            />
          </FormGroup>
        )}
        <FormGroup className={classes.toggle}>
          <FormControlLabel
            control={
              <Switch
                id="toggle"
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
  const [cookies] = useCookies(["user"]);
  const [sessions, setSessions] = React.useState<SessionsData>();
  const [showGraded, setShowGraded] = React.useState(false);
  const [showCreator, setShowCreator] = React.useState<boolean>(cookies.user);
  const [cursor, setCursor] = React.useState("");
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortAsc, setSortAsc] = React.useState(false);
  const rowsPerPage = 50;

  function onSort(id: string) {
    if (sortBy === id) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(id);
    }
    setCursor("");
  }

  function nextPage() {
    if (!sessions) {
      return;
    }
    setCursor("next__" + sessions.pageInfo.endCursor);
  }

  function prevPage() {
    if (!sessions) {
      return;
    }
    setCursor("prev__" + sessions.pageInfo.startCursor);
  }

  const handleShowGradedChange = (): void => {
    setShowGraded(!showGraded);
  };

  const handleShowCreatorChange = (): void => {
    setShowCreator(!showCreator);
  };

  React.useEffect(() => {
    let mounted = true;
    fetchSessions(rowsPerPage, cursor, sortBy, sortAsc)
      .then((sessions) => {
        console.log(`fetchSessions got`, sessions);
        if (mounted && sessions) {
          sessions.edges.map((session: any) => {
            session.node.createdAt = new Date(session.node.createdAt);
          });
          setSessions(sessions);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [rowsPerPage, cursor, sortBy, sortAsc]);

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
              {sessions.edges
                .filter(
                  (edge: Edge<Session>) =>
                    (showGraded || edge.node.graderGrade === null) &&
                    (!showCreator ||
                      edge.node.lesson.createdBy === cookies.user)
                )
                .map((row, i) => (
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
        showGraded={showGraded}
        showCreator={showCreator}
        onNext={nextPage}
        onPrev={prevPage}
        onToggleGraded={handleShowGradedChange}
        onToggleCreator={handleShowCreatorChange}
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
