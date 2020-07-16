import { withPrefix } from "gatsby";
import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Router, Link } from "@reach/router";

import SessionPage from "./session";
import SessionsPage from "./sessions";
import CreatePage from "./lessons";
import EditPage from "./edit";
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
        <Link to="sessions">Sessions</Link>
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
          <CreatePage path="lessons">
            <EditPage path="edit" />
          </CreatePage>
          <SessionsPage path="sessions">
            <SessionPage path="session" />
          </SessionsPage>
        </AdminMenu>
      </Router>
    </MuiThemeProvider>
  );
};

export default IndexPage;
