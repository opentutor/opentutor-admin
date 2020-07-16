import { withPrefix } from "gatsby";
import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Router, Link } from "@reach/router";

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

export const AdminMenu = ({
  path,
  children,
}: {
  path: string;
  children: any;
}) => {
  return (
    <div>
      <NavBar title="Home" />
      <p>
        <Link to="lessons">Lessons</Link>
      </p>
      <p>
        <Link to="sessions">Grading</Link>
      </p>
      {children}
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <AdminMenu path={withPrefix("/")}>
          <CreatePage path={withPrefix("lessons")}>
            <EditPage path={withPrefix("/lessons/edit")} />
          </CreatePage>
          <SessionsPage path={withPrefix("sessions")}>
            <SessionPage path={withPrefix("sessions/session")} />
          </SessionsPage>
        </AdminMenu>
      </Router>
    </MuiThemeProvider>
  );
};

export default IndexPage;
