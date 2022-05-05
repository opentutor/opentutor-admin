/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Button, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NavBar from "components/nav-bar";
import SessionContext from "context/session";
import "styles/layout.css";
import "react-toastify/dist/ReactToastify.css";
import { useWithTraining } from "hooks/use-with-training";
import { ExpectationDataCSV, TrainState, UserRole } from "types";
import LoadingIndicator from "components/loading-indicator";
import { fetchExpectationDataCSV } from "api";

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
  },
}));

const NoAdminMessage = (): JSX.Element => {
  return (
    <Container maxWidth="lg" data-cy="admin-error-container">
      <Typography variant="h4" data-cy="admin-error-message">
        You must be an admin to view this page.
      </Typography>
    </Container>
  );
};

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
function SettingsPage(): JSX.Element {
  const { isTraining, trainStatus, startDefaultTraining } = useWithTraining();
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const fileDownloadAnchor = useRef<HTMLAnchorElement>(null);
  const styles = useStyles();

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view settings.</div>;
  }

  useEffect(() => {
    //Callback
    if (fileDownloadUrl !== "") {
      if (fileDownloadAnchor.current) {
        fileDownloadAnchor.current.click();
      } else {
        console.error("Could not download csv.");
      }
      URL.revokeObjectURL(fileDownloadUrl); // free up storage--no longer needed.
      setFileDownloadUrl("");
    }
  }, [fileDownloadUrl]);

  const displayLoadingProgress = !context.user ? <LoadingIndicator /> : null;

  useEffect(() => {
    if (context?.user?.userRole === UserRole.ADMIN) {
      setIsAdmin(true);
    }
  }, [context]);

  return (
    <div>
      <NavBar title="Settings" />
      {displayLoadingProgress}
      {isAdmin ? (
        <>
          <Container maxWidth="lg">
            <Button
              variant="contained"
              color="primary"
              className={styles.trainButton}
              onClick={() => {
                fetchExpectationDataCSV(cookies.accessToken).then(
                  (csvJson: ExpectationDataCSV) => {
                    const blob = new Blob([csvJson.me.allExpectationData.csv]);
                    const fileDownloadUrl = URL.createObjectURL(blob);
                    setFileDownloadUrl(fileDownloadUrl);
                  }
                );
              }}
              disabled={isTraining}
              data-cy="download-expectation-button"
            >
              Download Expectation Data
            </Button>
            <a
              style={{ display: "none" }}
              download={"expectation_data.csv"}
              href={fileDownloadUrl}
              ref={fileDownloadAnchor}
            >
              Download File
            </a>
          </Container>
          <Container maxWidth="lg">
            <Button
              variant="contained"
              color="primary"
              className={styles.trainButton}
              onClick={() => {
                startDefaultTraining();
              }}
              disabled={isTraining}
              data-cy="train-default-button"
            >
              Train Default Classifier
            </Button>
            {isTraining ? (
              <LoadingIndicator />
            ) : trainStatus.state === TrainState.SUCCESS ? (
              <Typography data-cy="train-success">{`Training Succeeded`}</Typography>
            ) : trainStatus.state === TrainState.FAILURE ? (
              <Typography data-cy="train-failure">{`Training Failed`}</Typography>
            ) : null}
          </Container>
        </>
      ) : (
        <NoAdminMessage />
      )}
    </div>
  );
}

export default SettingsPage;
