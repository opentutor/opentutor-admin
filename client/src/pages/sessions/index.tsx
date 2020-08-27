import { withPrefix } from "gatsby";
import React from "react";
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
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import { Link } from "@reach/router";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { fetchSessions } from "api";
import { Connection, Edge, Session } from "types";
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
  {
    id: "lessonName",
    label: "Lesson",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "grade",
    label: "Grade",
    minWidth: 0,
    align: "center",
    sortable: false,
  },
  {
    id: "grade",
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
        <IconButton onClick={handleGrade}>
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
  const [sessions, setSessions] = React.useState<Connection<Session>>();
  const [showGraded, setShowGraded] = React.useState(false);
  const [onlyCreator, setOnlyCreator] = React.useState(
    cookies.user ? true : false
  );
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

  const handleShowGradedChange = (): void => {
    setShowGraded(!showGraded);
  };

  const handleShowCreatorChange = (): void => {
    setOnlyCreator(!onlyCreator);
  };

  React.useEffect(() => {
    const filter: any = {};
    if (onlyCreator) {
      filter["lessonCreatedBy"] = `${cookies.user}`;
    }
    if (!showGraded) {
      filter["graderGrade"] = null;
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
              {sessions.edges
                .filter(
                  (edge: Edge<Session>) =>
                    showGraded || edge.node.graderGrade === null
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
        showCreator={onlyCreator}
        onNext={() => {
          setCursor("next__" + sessions.pageInfo.endCursor);
        }}
        onPrev={() => {
          setCursor("prev__" + sessions.pageInfo.startCursor);
        }}
        onToggleGraded={handleShowGradedChange}
        onToggleCreator={handleShowCreatorChange}
      />
    </div>
  );
};

const SessionsPage = (props: { path: string; children: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar title="Grading" />
      <SessionsTable path={props.path} />
      {props.children}
    </MuiThemeProvider>
  );
};

export default SessionsPage;
