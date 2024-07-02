/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import {
  Autocomplete,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import NavBar from "components/nav-bar";
import SessionContext from "context/session";
import "styles/layout.css";
import "react-toastify/dist/ReactToastify.css";
import { useWithTraining } from "hooks/use-with-training";
import { AppConfig, Lesson, TrainState, UserRole } from "types";
import LoadingIndicator from "components/loading-indicator";
import { fetchAppConfig, fetchLessons, updateAppConfig } from "api";
import { Delete } from "@mui/icons-material";

const useStyles = makeStyles((theme: Theme) => ({
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
    margin: 20,
    width: 200,
  },
  loading: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
  },
  thumbnail: {
    boxSizing: "border-box",
    height: 56,
    padding: 5,
  },
}));

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
function SettingsPage(props: { path: string }): JSX.Element {
  const styles = useStyles();
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const { isTraining, trainStatus, startDefaultTraining } = useWithTraining();

  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const [config, setConfig] = React.useState<AppConfig>();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const featuredLessons = config?.featuredLessons || [];

  React.useEffect(() => {
    let mounted = true;
    fetchAppConfig()
      .then((config: AppConfig) => {
        if (!mounted) {
          return;
        }
        setConfig(config);
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    fetchLessons({}, 9999, "", "", true, cookies.accessToken)
      .then((lessons) => {
        if (mounted && lessons) {
          setLessons(lessons.edges.map((e) => e.node));
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  function onSave() {
    if (!config || !cookies.accessToken) {
      return;
    }
    setIsSaving(true);
    updateAppConfig(cookies.accessToken, config)
      .then((config: AppConfig) => {
        setIsSaving(false);
        setConfig(config);
      })
      .catch((err) => {
        console.error(err);
        setIsSaving(false);
      });
  }

  function onUpdateConfig(c: Partial<AppConfig>) {
    if (!config) {
      return;
    }
    setConfig({ ...config, ...c });
  }

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view settings.</div>;
  }
  if (!context.user) {
    return <LoadingIndicator />;
  }
  if (context.user.userRole !== UserRole.ADMIN) {
    return <div>You must be an admin to view this page.</div>;
  }

  return (
    <div>
      <NavBar title="Settings" />
      <Container maxWidth="lg">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            justifyItems: "center",
            alignContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <TextField
            fullWidth
            data-cy="logoIcon"
            data-test={config?.logoIcon}
            variant="outlined"
            label="Logo Image URL"
            value={config?.logoIcon}
            disabled={!config}
            onChange={(e) => onUpdateConfig({ logoIcon: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <img
            data-cy="logo-thumbnail"
            className={styles.thumbnail}
            src={config?.logoIcon}
            onClick={() => {
              window.open(config?.logoIcon || "", "_blank");
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            justifyItems: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            data-cy="logoLargeIcon"
            data-test={config?.logoLargeIcon}
            variant="outlined"
            label="Logo Full Image URL"
            value={config?.logoLargeIcon}
            disabled={!config}
            onChange={(e) => onUpdateConfig({ logoLargeIcon: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <img
            data-cy="logo-large-thumbnail"
            className={styles.thumbnail}
            src={config?.logoLargeIcon}
            onClick={() => {
              window.open(config?.logoLargeIcon || "", "_blank");
            }}
          />
        </div>
        <List data-cy="lessons-list">
          <ListSubheader>Featured Lessons</ListSubheader>
          {featuredLessons.map((fl, i) => {
            const lesson = lessons.find((l) => l.lessonId === fl);
            return (
              <ListItem
                key={`lesson-${i}`}
                data-cy={`lesson-${i}`}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() =>
                      onUpdateConfig({
                        featuredLessons: [
                          ...featuredLessons.filter(
                            (l) => l !== lesson?.lessonId
                          ),
                        ],
                      })
                    }
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={lesson?.name}
                  secondary={lesson?.lessonId}
                />
              </ListItem>
            );
          })}
        </List>
        <Autocomplete
          data-cy="lesson-search"
          options={lessons
            .filter((l) => !featuredLessons.includes(l.lessonId))
            .map((l) => ({ ...l, label: l.name }))}
          onChange={(e, v) => {
            if (v)
              onUpdateConfig({
                featuredLessons: [...featuredLessons, v?.lessonId],
              });
          }}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search lessons"
            />
          )}
          renderOption={(props, option) => (
            <Typography
              {...props}
              data-cy={`lesson-option-${option}`}
              key={option.lessonId}
            >
              {option.name}
            </Typography>
          )}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            className={styles.trainButton}
            onClick={onSave}
            disabled={isSaving || !config}
            data-cy="update-config-button"
            style={{ marginBottom: 10 }}
          >
            Update Config
          </Button>
          <Button
            variant="outlined"
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
        </div>
        {isTraining ? (
          <LoadingIndicator />
        ) : trainStatus.state === TrainState.SUCCESS ? (
          <Typography data-cy="train-success">{`Training Succeeded`}</Typography>
        ) : trainStatus.state === TrainState.FAILURE ? (
          <Typography data-cy="train-failure">{`Training Failed`}</Typography>
        ) : null}
      </Container>
    </div>
  );
}

export default SettingsPage;
