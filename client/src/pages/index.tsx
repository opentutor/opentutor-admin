/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
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
          <EditPage path={withPrefix("lessons/edit")} />
        </CreatePage>
        <SessionsPage path={withPrefix("sessions")}>
          <SessionPage path={withPrefix("sessions/session")} />
        </SessionsPage>
      </LoginMenu>
    </Router>
  );
};

export default IndexPage;
