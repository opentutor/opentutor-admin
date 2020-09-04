import { withPrefix } from "gatsby";
import React from "react";
import { Router } from "@reach/router";
import LoginMenu from "components/login-menu";
import CreatePage from "pages/lessons/index";
import EditPage from "pages/lessons/edit";
import SessionsPage from "pages/sessions/index";
import SessionPage from "pages/sessions/session";
import "styles/layout.css";

const IndexPage: React.FC = (props: any) => {
  return (
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
  );
};

export default IndexPage;
