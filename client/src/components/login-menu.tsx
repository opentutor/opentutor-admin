/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { navigate } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { Button, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import NavBar from "components/nav-bar";
import SessionContext from "context/session";
import { loginGoogle, fetchAppConfig } from "api";
import { AppConfig, UserAccessToken } from "types";
import "styles/layout.css";
import LoadingIndicator from "components/loading-indicator";

const useStyles = makeStyles((theme: Theme) => ({
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

export function LoginMenu(): JSX.Element {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const context = useContext(SessionContext);
  const [googleClientId, setClientId] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;
    fetchAppConfig()
      .then((config: AppConfig) => {
        if (!mounted) {
          return;
        }
        setClientId(config.googleClientId);
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
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
    loginGoogle(loginResponse.accessToken).then((token: UserAccessToken) => {
      setCookie("accessToken", token.accessToken, {
        sameSite: "none",
        path: "/",
      });
    });
  };

  if (cookies.accessToken) {
    return (
      <div className={classes.root}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div data-cy="login-menu" className={classes.root}>
      <NavBar title="OpenTutor" />
      <Typography variant="h5" className={classes.title}>
        Welcome to OpenTutor
      </Typography>
      {process.env.ACCESS_TOKEN ? (
        <Button
          data-cy="login-button"
          variant="contained"
          color="primary"
          onClick={() =>
            setCookie("accessToken", process.env.ACCESS_TOKEN, {
              sameSite: "none",
              path: "/",
            })
          }
          className={classes.button}
        >
          Sign in
        </Button>
      ) : googleClientId ? (
        <GoogleLogin
          clientId={googleClientId}
          onSuccess={onGoogleLogin}
          cookiePolicy={"single_host_origin"}
          render={(renderProps) => (
            <Button
              data-cy="login-button"
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
          data-cy="login-button"
          variant="contained"
          color="primary"
          disabled={true}
          className={classes.button}
        >
          Sign in with Google
        </Button>
      )}
    </div>
  );
}

export default LoginMenu;
