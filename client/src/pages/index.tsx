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
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Edge, FetchSessions } from "types";
import "styles/layout.css";
import { Checkbox } from "@material-ui/core";
import { fetchSessions } from "api";

import SessionPage from './session';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const columns: ColumnDef[] = [
  { id: "sessionId", label: "Session Id", minWidth: 170 },
  {
    id: "classifierGrade",
    label: "Classifier Grade",
    minWidth: 170,
    align: "right",
    format: (value: number): string => value.toLocaleString("en-US"),
  },
  {
    id: "grade",
    label: "Grade",
    minWidth: 170,
    align: "right",
    format: (value: number): string => value.toLocaleString("en-US"),
  },
];

interface ColumnDef {
  id: string;
  name?: string;
  label: string;
  minWidth: number;
  align?: "right" | "left";
  format?: (v: number) => string;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export const SessionsTable: React.FC = () => {
  const classes = useStyles();
  const [fetch, setFetch] = React.useState<FetchSessions>();
  const [sessions, setSessions] = React.useState<Edge[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    fetchSessions()
      .then((fetch) => {
        console.log(`fetchSessions got`, fetch);
        setFetch(fetch);
        if (Array.isArray(fetch.sessions.edges)) {
          setSessions(fetch.sessions.edges);
        }

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

  return (
    <Paper className={classes.root}>
      <Checkbox id="show-graded-checkbox"></Checkbox>
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
            {sessions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                      <Link to="/session">{row.node.sessionId}</Link>
                    </TableCell>
                    <TableCell key={`classifier-grade-${i}`} align="right">
                      {row.node.classifierGrade}
                    </TableCell>
                    <TableCell key={`grade-${i}`} align="right">
                      {row.node.grade}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
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

const IndexPage: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <SessionsTable />
          </Route>
          <Route path="/session">
            <SessionPage />
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
};

export default IndexPage;
