import { withPrefix } from "gatsby";
import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { Router, Link } from "@reach/router";
import "styles/layout.css";

import SessionPage from "./session";
import SessionsPage from "./sessions";
import CreatePage from "./lessons";
import EditPage from "./edit";
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
      <nav>
        <Link to="lessons">Lessons</Link> <Link to="sessions">Sessions</Link>
      </nav>
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <AdminMenu path={withPrefix("/")} />
        <CreatePage path={withPrefix("/lessons")} />
        <EditPage path={withPrefix("/lessons/edit")} />
        <SessionsPage path={withPrefix("/sessions")} />
        <SessionPage path={withPrefix("/sessions/session")} />
      </Router>
    </MuiThemeProvider>
  );
};

export default IndexPage;
