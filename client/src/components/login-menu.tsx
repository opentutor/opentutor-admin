import { navigate } from "gatsby";
import React from "react";
import { useCookies } from "react-cookie";
import {
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NavBar from "components/nav-bar";
import "styles/layout.css";

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
  progress: {
    marginLeft: "50%",
  },
}));

export const LoginMenu = (props: { path: string; children: any }) => {
  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [input, setInput] = React.useState(cookies.user);

  React.useEffect(() => {
    if (cookies.user) {
      navigate("/lessons");
    }
  }, [cookies]);

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
        id="login-button"
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

  if (cookies.user) {
    return (
      <div className={classes.root}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  }

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
        id="login-text-field"
        variant="filled"
        label="username"
        value={input || ""}
        disabled={cookies.user ? true : false}
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

export default LoginMenu;
