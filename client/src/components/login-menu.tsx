/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { navigate, withPrefix } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NavBar from "components/nav-bar";
import ToggleContext from "context/toggle";
import { getClientID } from "config";
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
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const context = useContext(ToggleContext);
  const [googleClientId, setClientId] = React.useState<string>("");

  React.useEffect(() => {
    getClientID().then((id: string) => {
      setClientId(id);
    });
  }, []);

  React.useEffect(() => {
    if (context.user) {
      navigate("/lessons");
    }
  }, [context.user]);

  const onGoogleLogin = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ): void => {
    if ((response as GoogleLoginResponseOffline).code !== undefined) {
      return;
    }
    const loginResponse = response as GoogleLoginResponse;
    // TODO: use google access token to get opentutor access token, which doesn't expire
    setCookie("accessToken", loginResponse.accessToken, { path: "/" });
  };

  if (cookies.accessToken) {
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
        Welcome to OpenTutor
      </Typography>
      {googleClientId ? (
        <GoogleLogin
          clientId={googleClientId}
          onSuccess={onGoogleLogin}
          cookiePolicy={"single_host_origin"}
          render={(renderProps) => (
            <Button
              id="login-button"
              variant="contained"
              color="primary"
              onClick={renderProps.onClick}
              className={classes.button}
              disabled={renderProps.disabled}
            >
              Sign in with Google
            </Button>
          )}
        />
      ) : (
        <Button
          id="login-button"
          variant="contained"
          color="primary"
          disabled={true}
          className={classes.button}
        >
          Sign in with Google
        </Button>
      )}
      {props.children}
    </div>
  );
};

export default LoginMenu;
