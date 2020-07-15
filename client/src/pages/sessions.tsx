import { withPrefix } from "gatsby";
import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Router, Link } from "@reach/router";
import { Edge, Session } from "types";
import "styles/layout.css";
import { Checkbox } from "@material-ui/core";
import { fetchSessions } from "api";

import SessionPage from "./session";
import { template } from "@babel/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const columns: ColumnDef[] = [
  { id: "sessionId", label: "Session Id", minWidth: 170, align: "center" },
  { id: "username", label: "Username", minWidth: 170, align: "center" },
  { id: "date", label: "Date", minWidth: 170, align: "center" },
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

interface DatedEdge {
  cursor: string;
  node: DatedSession;
}

interface DatedSession {
  sessionId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  classifierGrade: number;
  grade: number;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export const SessionsTable = ({ path }: { path: string }) => {
  const classes = useStyles();
  const [sessions, setSessions] = React.useState<Edge[]>([]);
  const [datedSessions, setDatedSessions] = React.useState<DatedEdge[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [showGraded, setShowGraded] = React.useState(false);

  React.useEffect(() => {
    fetchSessions()
      .then((sessions) => {
        console.log(`fetchSessions got`, sessions);
        if (Array.isArray(sessions)) {
          setSessions(sessions);
        }

        const tmp: any = sessions;
        tmp.map((session: DatedEdge, i: number) => {
          tmp[i].node.createdAt = new Date(session.node.createdAt);
        });
        setDatedSessions(
          tmp.sort(
            (a: DatedEdge, b: DatedEdge) =>
              +b.node.createdAt - +a.node.createdAt
          )
        );
      })
      .catch((err) => console.error(err));
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangePage = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeRowsPerPage = (event: any): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleShowGradedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setShowGraded(event.target.checked);
  };

  return (
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
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {datedSessions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter(
                (edge: DatedEdge) => showGraded || edge.node.grade === null
              )
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
                      <Link to={`/session?sessionId=${row.node.sessionId}`}>
                        {row.node.sessionId ? row.node.sessionId : ""}
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
                      {row.node.classifierGrade
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
      <TablePagination
        rowsPerPageOptions={[50, 75, 100]}
        component="div"
        count={sessions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const SessionsPage = ({ path }: { path: string }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <SessionsTable path={path} />
        <SessionPage path={`/session`} />
      </Router>
    </MuiThemeProvider>
  );
};

export default SessionsPage;
