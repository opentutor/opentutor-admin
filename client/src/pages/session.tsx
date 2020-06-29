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
  Typography
} from "@material-ui/core";
import "styles/layout.css";

import { 
  Classification,
  Expectation, 
  Question,
  UserResponseExpectationScore,
  UserResponse,
  UserSession} from "types";

import { fetchUserSession, inputGrade } from "api";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

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

  const [userSession, setUserSession] = React.useState<UserSession>();
  const [sessionId, setSessionId] = React.useState("session1");
  const [question, setQuestion] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [expectations, setExpectations] = React.useState<Expectation[]>([]);
  const [userResponses, setUserResponses] = React.useState<UserResponse[]>([]);

  const [grade, setGrade] = React.useState("");
  const [index, setIndex] = React.useState(0);

  const handleGradeExpectationChange = (event: React.ChangeEvent<{ value: unknown, name?: unknown}>) => {
    console.log("Grade change", event.target.value as string);
    setIndex(event.target.name as number);
    setGrade(event.target.value as string);

  };

  React.useEffect(() => {
    fetchUserSession()
      .then((userSession) => {
        console.log(`fetchUserSession got`, userSession);
          try{
            setUserSession(userSession);
          }catch(error){
            console.log("error:", error)
          }
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

  React.useEffect(() => {
    inputGrade(sessionId, index, grade)
      .then((userSession) => {
        console.log(`update got`, userSession);
        setUserSession(userSession);
      })
      .catch((err) => console.error(err));
  }, [grade]);

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
                        <Typography key={`classifier-grade-${i}`} id={`classifier-grade-${i}`} align="right">
                          Classifier Grade: {row.userResponseExpectationScores[j] ? row.userResponseExpectationScores[j].classifierGrade:""}
                        </Typography>
                        <Typography
                          key={`expectation-grade-${j}`}
                          id={`expectation-grade-${j}`}
                          align="right"
                        >
                          Grade: 
                          <Select
                            labelId= {`set-grade-${j}`}
                            id= {`select-grade-${j}`}
                            value={row.userResponseExpectationScores[j].graderGrade}
                            name={`${i}`}
                            onChange={handleGradeExpectationChange}
                          >
                            <MenuItem value="">
                              <em>Empty</em>
                            </MenuItem>
                            <MenuItem value= {"Good"}>Good</MenuItem>
                            <MenuItem value= {"Bad"}>Bad</MenuItem>
                          </Select>
                        </Typography>
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