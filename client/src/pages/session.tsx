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
  TableRow} from "@material-ui/core";
import "styles/layout.css";
import { SessionLog } from "types";
import { fetchSessionLog } from "api";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const columns: ColumnDef[] = [
  { id: "expected-text", label: "expected text", minWidth: 170 },
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

const SessionTable: React.FC = () => {
  const classes = useStyles();
  const [sessionLog, setSessionLog] = React.useState<SessionLog>();

  React.useEffect(() => {
    fetchSessionLog()
      .then((sessionLog) => {
        console.log(`fetchSessionLog got`, sessionLog);
          setSessionLog(sessionLog);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Paper className={classes.root}>
      <div id="session-display-name">session 1</div>
      <div id="username"> {sessionLog ? sessionLog.username: ""}</div>
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
            {sessionLog?.answers
              .map((row, i) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.toString()}
                  >
                    <TableCell
                      key={`answer-${i}`}
                      id={`answer-${i}`}
                      align="left"
                    >
                      {sessionLog.answers[i]}
                    </TableCell>

                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const SessionPage: React.FC = () => {
    return (
      <MuiThemeProvider theme={theme}>
        <SessionTable />
      </MuiThemeProvider>
    );
  };
  
  export default SessionPage;