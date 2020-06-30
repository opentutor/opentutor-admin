import React from "react";
import {Link} from "react-router-dom";
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

import { fetchUserSession, setGrade } from "api";

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

export interface GradeInput {
  sessionId: string;
  index: number;
  graderGrade: number;
}

const SessionTable: React.FC = () => {
  const classes = useStyles();

  const [userSession, setUserSession] = React.useState<UserSession>();
  const [sessionId, setSessionId] = React.useState("session1");
  const [question, setQuestion] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [expectations, setExpectations] = React.useState<Expectation[]>([]);
  const [userResponses, setUserResponses] = React.useState<UserResponse[]>([]);

  const [inputGrade, setInputGrade] = React.useState("");
  const [userIndex, setUserIndex] = React.useState(0);
  const [expectationIndex, setExpectationIndex] = React.useState(0);


  const handleGradeExpectationChange = (event: React.ChangeEvent<{ value: unknown, name?: unknown}>) => {
    var indeces = event.target.name as string;
    var indexSplit = indeces.split(" ");
    setUserIndex(Number(indexSplit[0]));
    setExpectationIndex(Number(indexSplit[1]));
    setInputGrade(event.target.value as string);
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
    setGrade(sessionId, userIndex, expectationIndex, inputGrade)
      .then(() => {
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
      })
      .catch((err) => console.error(err));
    
  }, [inputGrade]);

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
                  align="right"
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
                      <TableCell key={`grade-${i}-${j}`} id={`grade-${i}-${j}`}align ="right">
                        <Typography key={`classifier-grade-${i}-${j}`} id={`classifier-grade-${i}-${j}`} align="right">
                          Classifier Grade: {row.userResponseExpectationScores[j] ? row.userResponseExpectationScores[j].classifierGrade:""}
                        </Typography>
                        <Typography
                          key={`expectation-grade-${i}-${j}`}
                          id={`expectation-grade-${i}-${j}`}
                          align="right"
                        >
                          Grade: 
                          <Select
                            labelId= {`set-grade-${i}-${j}`}
                            id= {`select-grade-${i}-${j}`}
                            value={row.userResponseExpectationScores[j].graderGrade}
                            name={`${i} ${j}`}
                            onChange={handleGradeExpectationChange}
                          >
                            <MenuItem id={`empty-grade-${i}-${j}`} value="">
                              <em>Empty</em>
                            </MenuItem>
                            <MenuItem id={`good-grade-${i}-${j}`} value= {"Good"}>Good</MenuItem>
                            <MenuItem id={`bad-grade-${i}-${j}`} value= {"Bad"}>Bad</MenuItem>
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
      {/* <Link to="/">Done</Link> */}
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