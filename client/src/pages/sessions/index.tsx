import React from "react";
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
  TablePagination,
  TableRow,
  FormControlLabel,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  TableSortLabel,
} from "@material-ui/core";
import { withPrefix } from "gatsby";
import { Link } from "@reach/router";
import { FetchSessions, Edge, SessionsData } from "types";
import { Checkbox } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

import { fetchSessions } from "api";
import NavBar from "components/nav-bar";
import "styles/layout.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const columns: ColumnDef[] = [
  { id: "sessionId", label: "Session", minWidth: 170, align: "center" },
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

interface ColumnDef {
  id: string;
  name?: string;
  label: string;
  minWidth: number;
  align?: "right" | "left" | "center";
  format?: (v: number) => string;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 550,
  },
  appBar: {
    height: "10%",
    top: "auto",
    bottom: 0,
  },
});

export const SessionsTable = ({ path }: { path: string }) => {
  const initialSessions = {
    edges: [
      {
        cursor: "",
        node: {
          classifierGrade: 0,
          createdAt: 0,
          grade: 0,
          lesson: {
            name: "",
          },
          sessionId: "",
          updatedAt: 0,
          username: "",
        },
      },
    ],
    pageInfo: {
      hasNextPage: false,
      endCursor: "",
    },
  };
  const classes = useStyles();
  const [sessions, setSessions] = React.useState<SessionsData>(initialSessions);
  const [showGraded, setShowGraded] = React.useState(false);
  const [prevPages, setPrevPages] = React.useState<string[]>([""]);
  const [page, setPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortDesc, setSortDesc] = React.useState(true);
  const rowsPerPage = 50;

  React.useEffect(() => {
    let mounted = true;
    fetchSessions(rowsPerPage, prevPages[page], sortBy, sortDesc)
      .then((sessions) => {
        console.log(`fetchSessions got`, sessions);
        if (mounted) {
          if (sessions !== undefined) {
            const tmp: any = sessions.edges;
            tmp.map((session: any) => {
              session.node.createdAt = new Date(session.node.createdAt);
            });
            setSessions(sessions);
          }
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    fetchSessions(
      rowsPerPage,
      prevPages[prevPages.length - 1],
      sortBy,
      sortDesc
    )
      .then((sessions) => {
        console.log(`page switch fetchSessions got`, sessions);
        if (sessions !== undefined) {
          const tmp: any = sessions.edges;
          tmp.map((session: any) => {
            session.node.createdAt = new Date(session.node.createdAt);
          });
          setSessions(sessions);
        }
      })
      .catch((err) => console.error(err));
  }, [prevPages]);

  React.useEffect(() => {
    fetchSessions(
      rowsPerPage,
      prevPages[prevPages.length - 1],
      sortBy,
      sortDesc
    )
      .then((sessions) => {
        console.log(`page switch fetchSessions got`, sessions);
        if (sessions !== undefined) {
          const tmp: any = sessions.edges;
          tmp.map((session: any) => {
            session.node.createdAt = new Date(session.node.createdAt);
          });
          setSessions(sessions);
        }
      })
      .catch((err) => console.error(err));
  }, [sortBy, sortDesc]);

  const handleShowGradedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setShowGraded(event.target.checked);
  };

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <FormControlLabel
          control={
            <Checkbox
              id="toggle"
              checked={showGraded}
              onChange={handleShowGradedChange}
              name="showGraded"
            />
          }
          label="Show Graded"
        />
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={
                        sortBy === column.id
                          ? sortDesc
                            ? "asc"
                            : "desc"
                          : "asc"
                      }
                      onClick={() => {
                        setSortBy(column.id);
                        setSortDesc(!sortDesc);
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions?.edges
                .filter((edge: Edge) => showGraded || edge.node.grade === null)
                .map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.node.sessionId}
                    >
                      <TableCell
                        key={`session-${i}`}
                        id={`session-${i}`}
                        align="left"
                      >
                        <Link
                          to={withPrefix(
                            `/sessions/session?sessionId=${row.node.sessionId}`
                          )}
                        >
                          {row.node.lesson.name
                            ? row.node.lesson.name
                            : "No Lesson Name"}
                          {/* {row.node.sessionId ? "(" + row.node.sessionId + ")": ""} */}
                        </Link>
                      </TableCell>
                      <TableCell key={`username-${i}`} align="center">
                        {row.node.username ? row.node.username : "Guest"}
                      </TableCell>
                      <TableCell key={`date-${i}`} align="center">
                        {row.node.createdAt
                          ? row.node.createdAt.toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell key={`classifier-grade-${i}`} align="center">
                        {row.node
                          ? Math.trunc(row.node.classifierGrade * 100)
                          : "?"}
                      </TableCell>
                      <TableCell key={`grade-${i}`} align="center">
                        {row.node.grade || row.node.grade === 0
                          ? Math.trunc(row.node.grade * 100)
                          : "?"}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <AppBar position="sticky" color="default" className={classes.appBar}>
        <Toolbar>
          <IconButton
            disabled={prevPages.length === 1 ? true : false}
            onClick={() => {
              setPrevPages(
                prevPages.filter(
                  (elem) => elem !== prevPages[prevPages.length - 1]
                )
              );
            }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton
            disabled={!sessions.pageInfo.hasNextPage}
            onClick={() => {
              setPrevPages((prevPages) => [
                ...prevPages,
                sessions.pageInfo.endCursor,
              ]);
            }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

const SessionsPage = ({ path, children }: { path: string; children: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar title="Sessions" />
      <SessionsTable path={path} />
      {children}
    </MuiThemeProvider>
  );
};

export default SessionsPage;
