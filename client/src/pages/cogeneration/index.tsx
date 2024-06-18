/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import SessionContext from "context/session";
import NavBar from "components/nav-bar";
import LoadingIndicator from "components/loading-indicator";
import {
  Button,
  Grid,
} from "@mui/material";
import CogenerationFields from "components/cogeneration-fields";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";
import "react-toastify/dist/ReactToastify.css";


const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: 2,
  },
  drawer: {
    paddingTop: "10%",
    flexShrink: 0,
    zIndex: 1,
    position: "sticky",
  },
  cardRoot: {
    width: "100%",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  list: {
    background: "#F5F5F5",
    borderRadius: 10,
  },
  listDragging: {
    background: "lightblue",
    borderRadius: 10,
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  container: {
    maxHeight: 440,
  },
  input: {
    "&:invalid": {
      border: "red solid 2px",
    },
  },
  image: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    boxSizing: "border-box",
    height: 56,
    padding: 5,
  },
  video: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputForm: {},
  selectForm: {
    width: "100%",
  },
  divider: {
    marginTop: 25,
    marginBottom: 25,
  },
  actionFooter: {
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CogenerationContent = () => {
  const classes = useStyles();
  const [genRecipe, setGenRecipe] = React.useState("multipleChoice");
  return (
    <Grid container sx={{ display: "flex" }}>
      <Grid
        item
        xs={12}
        style={{
          marginTop: 30,
          marginBottom: 10,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <form noValidate autoComplete="off">
          <CogenerationFields classes={classes} genRecipe={genRecipe} setGenRecipe={setGenRecipe}/>
        </form>
      </Grid>
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
      <div className="navbar-container">
        <NavBar title="Cogeneration Testbed UI" />
      </div>
      <CogenerationContent />
    </div>
  );
}

export default CogenerationPage;
