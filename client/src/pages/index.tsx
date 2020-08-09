import { withPrefix } from "gatsby";
import React from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import {
  Button,
  InputAdornment,
  Typography,
  TextField,
} from "@material-ui/core";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Router } from "@reach/router";
import SessionsPage from "./sessions/index";
import SessionPage from "./sessions/session";
import CreatePage from "./lessons/index";
import EditPage from "./lessons/edit";
import NavBar from "../components/nav-bar";
import "styles/layout.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexFlow: "column",
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    margin: 25,
  },
  input: {
    margin: theme.spacing(1),
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
    width: 300,
  },
}));

export const LoginMenu = (props: { path: string; children: any }) => {
  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [input, setInput] = React.useState(cookies.user);

  function onInput(text: string) {
    setInput(text);
  }

  function onLogin() {
    if (cookies.user) {
      removeCookie("user", { path: "/" });
    } else {
      setCookie("user", input, { path: "/" });
    }
  }

  const LoginButton = () => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={onLogin}
        className={classes.button}
        disabled={!input}
      >
        {cookies.user ? "Logout" : "Login"}
      </Button>
    );
  };

  return (
    <div className={classes.root}>
      <NavBar title="OpenTutor" />
      <Typography variant="h5" className={classes.title}>
        {cookies.user
          ? `Welcome to OpenTutor, ${cookies.user}!`
          : `Welcome to OpenTutor`}
      </Typography>
      Teacher Login
      <TextField
        variant="filled"
        label="username"
        value={input || ""}
        disabled={cookies.user}
        onChange={(e: any) => {
          onInput(e.target.value);
        }}
        className={classes.input}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
      <LoginButton />
      {props.children}
    </div>
  );
};

const IndexPage: React.FC = (props: any) => {
  return (
    <CookiesProvider>
      <MuiThemeProvider theme={theme}>
        <Router>
          <LoginMenu path={withPrefix("/")}>
            <CreatePage path={withPrefix("lessons")} location={props.location}>
              <EditPage path={withPrefix("/lessons/edit")} />
            </CreatePage>
            <SessionsPage path={withPrefix("sessions")}>
              <SessionPage path={withPrefix("sessions/session")} />
            </SessionsPage>
          </LoginMenu>
        </Router>
      </MuiThemeProvider>
    </CookiesProvider>
  );
};

export default IndexPage;
