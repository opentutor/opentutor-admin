/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { CircularProgress, Button, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { userIsElevated } from "api";
import NavBar from "components/nav-bar";
import SessionContext from "context/session";
import "styles/layout.css";
import "react-toastify/dist/ReactToastify.css";
import { useWithTraining } from "hooks/use-with-training";
import { TrainState } from "types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "column",
  },
  container: {
    flexGrow: 1,
  },
  appBar: {
    height: "10%",
    top: "auto",
    bottom: 0,
  },
  progress: {
    marginLeft: "50%",
  },
  paging: {
    position: "absolute",
    right: theme.spacing(1),
  },
  trainButton: {
    marginTop: 25,
  },
  loading: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
  }
}));

function SettingsPage(props: { path: string }): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const styles = useStyles();
  const { isTraining, trainStatus, trainingMessage, startDefaultTraining } =
    useWithTraining();

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view users.</div>;
  }
  if (!context.user) {
    return <CircularProgress />;
  }
  if (!userIsElevated(context.user)) {
    return (
      <div>You must be an admin or content manager to view this page.</div>
    );
  }

  return (
    <div>
      <NavBar title="Settings" />
      <Container maxWidth="lg">
        <Button
          variant="contained"
          color="primary"
          className={styles.trainButton}
          onClick={() => {
            console.log("Ready the Ninjas! We have a mission!");
            startDefaultTraining();
          }}
          disabled={isTraining}
        >
          Train Default Classifier
        </Button>
        {isTraining ? (
          <CircularProgress className={styles.loading} />
        ) : trainStatus.state === TrainState.SUCCESS ? (
          <Typography id="train-success">{`TRAINING SUCCEEDED`}</Typography>
        ) : trainStatus.state === TrainState.FAILURE ? (
          <Typography id="train-failure">{`TRAINING FAILED`}</Typography>
        ) : null}
      </Container>
    </div>
  );
}

export default SettingsPage;
