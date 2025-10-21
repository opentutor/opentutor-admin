/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import SessionContext from "context/session";
import NavBar from "components/nav-bar";
import LoadingIndicator from "components/loading-indicator";
import { Box, Grid } from "@mui/material";
import CogenerationFields from "components/cogeneration-fields";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";
import "react-toastify/dist/ReactToastify.css";
import { CogenerationProvider } from "context/cogeneration";
import CogenerationSideBar from "components/cogeneration-side-bar";
import { useStyles } from "helpers/lessonsHelpers";

const CogenerationContent = () => {
  const { classes } = useStyles();
  return (
    <Grid container sx={{ display: "flex" }}>
      <Box sx={{ display: "flex" }}>
        <CogenerationSideBar classes={classes} />
        <Grid
          item
          style={{
            flexGrow: 1,
            marginTop: 30,
            marginBottom: 10,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <form noValidate autoComplete="off">
            <CogenerationFields classes={classes} />
          </form>
        </Grid>
      </Box>
    </Grid>
  );
};

function CogenerationPage(): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view testbed.</div>;
  }
  if (!context.user) {
    return <LoadingIndicator />;
  }
  return (
    <div>
      <CogenerationProvider>
        <div className="navbar-container">
          <NavBar title="Cogeneration Testbed UI" />
        </div>
        <CogenerationContent />
      </CogenerationProvider>
    </div>
  );
}

export default CogenerationPage;
