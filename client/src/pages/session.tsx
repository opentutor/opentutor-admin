import React from "react";
import Link from "react-router-dom"
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
  Theme, 
  createStyles
} from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select, 
  MenuItem,
  Button,
} from "@material-ui/core";
import "styles/layout.css";

import { 
  Classification,
  Expectation, 
  Question,
  UserResponseExpectationScore,
  UserResponse,
  UserSession} from "types";

import { fetchUserSession, setGrade } from "api";

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

interface GradeChange {
  grade: Classification;
  index: number;
}



const SessionTable: React.FC = () => {
  const classes = useStyles();

  const [userSession, setUserSession] = React.useState<UserSession>();
  const [sessionId, setSessionId] = React.useState("session1");
  const [gradeChange, setGradeChange] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [expectations, setExpectations] = React.useState<Expectation[]>([]);
  const [userResponses, setUserResponses] = React.useState<UserResponse[]>([]);

  const handleGradeExpectationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event.target.value as string);
    // setGradeChange(event.target.value as string);
    // setGrade(sessionId, 0, gradeChange)
  };

  React.useEffect(() => {
    fetchUserSession()
      .then((userSession) => {
        console.log(`fetchUserSession got`, userSession);
          if(userSession !== undefined){
            setUserSession(userSession);
          }
          if(userSession.question.text !== undefined){
            setQuestion(userSession.question.text);
          }
          if(userSession.username !== undefined){
            setUsername(userSession.username);
          }
          if(userSession.question.expectations !== undefined){
            setExpectations(userSession.question.expectations);
          }
          if(userSession.userResponses !== undefined){
            setUserResponses(userSession.userResponses);
          }

      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Paper className={classes.root}>
      <div id="session-display-name">session 1</div>
      <div id="username"> {username}</div>
      <div id="question"> {question} </div>      
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell id="userAnswer">User Answer</TableCell>
              {/* <TableCell id="userGrade">Grade</TableCell>
              <TableCell id="classifierGrade">Classifier Grade</TableCell> */}
              {expectations
                .map((column, i) => (
                <TableCell
                  key={`expectation-${i}`}
                  id={`expectation-${i}`}
                  //align="right"
                  style={{minWidth:170}}
                >
                  {column.text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {userResponses
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.text}
                  >
                    <TableCell
                      key={`answer-${i}`} id={`answer-${i}`} align="left">
                      {row.text}
                    </TableCell>

                    {expectations
                      .map((column, j) => (
                      <TableCell key={`grade-${j}`} id={`grade-${j}`}align ="right">
                        <TableCell key={`classifier-grade-${i}`} id={`classifier-grade-${i}`} align="right">
                          Classifier Grade: {row.userResponseExpectationScores[0]}
                        </TableCell>
                        <TableCell
                          key={`expectation-grade-${j}`}
                          id={`expectation-grade-${j}`}
                          align="right"
                        >
                          Grade: 
                          <Select
                            labelId= {`set-grade-${j}`}
                            id= {`select-grade-${j}`}
                            //value={gradeChange}
                            onChange={handleGradeExpectationChange}
                          >
                            <MenuItem value="">
                              <em>Empty</em>
                            </MenuItem>
                            <MenuItem value= {"Good"}>Good</MenuItem>
                            <MenuItem value= {"Bad"}>Bad</MenuItem>
                          </Select>
                        </TableCell>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={sessions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}

      {/* <Link to="/"> <Button> Done</Button> </Link> */}
    </Paper>
  );
};

const SessionPage: React.FC = () => {
    return (
      <MuiThemeProvider theme={theme}>
        <SessionTable/>
      </MuiThemeProvider>
    );
  };
  
  export default SessionPage;