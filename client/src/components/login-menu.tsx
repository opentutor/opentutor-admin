/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
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
        id="login"
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
    <div id="login-menu" className={classes.root}>
      <NavBar title="OpenTutor" />
      <Typography variant="h5" className={classes.title}>
        {cookies.user
          ? `Welcome to OpenTutor, ${cookies.user}!`
          : `Welcome to OpenTutor`}
      </Typography>
      Teacher Login
      <TextField
        id="login-input"
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
