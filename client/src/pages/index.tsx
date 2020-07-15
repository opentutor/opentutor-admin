import { withPrefix } from "gatsby";
import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { Router, Link } from "@reach/router";
import "styles/layout.css";

import SessionPage from "./session";
import SessionsPage from "./sessions";
import CreatePage from "./lessons";
import { template } from "@babel/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

export const AdminMenu = ({ path }: { path: string }) => {
  return (
    <div>
      <li>
        <Link to="/sessions">Sessions</Link>
      </li>
      <li>
        <Link to="/lessons">Lessons</Link>
      </li>
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <AdminMenu path={withPrefix("/")} />
        <CreatePage path={withPrefix("/lessons")} />
        <SessionsPage path={withPrefix("/sessions")} />
      </Router>
    </MuiThemeProvider>
  );
};

export default IndexPage;
