/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer } from "react-toastify";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { fetchLesson, userCanEdit, fetchLessons } from "api";
import {
  COMPOSITE_CLASSIFIER_ARCHITECTURE,
  DEFAULT_CLASSIFIER_ARCHITECTURE,
  OPENAI_CLASSIFIER_ARCHITECTURE,
} from "admin-constants";
import SessionContext from "context/session";
import NavBar from "components/nav-bar";
import SideBar from "components/side-bar";
import ConclusionsList from "components/conclusions-list";
import ExpectationsList from "components/expectations-list";

import { Lesson, LessonExpectation, MediaType } from "types";
import withLocation from "wrap-with-location";

import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";
import "react-toastify/dist/ReactToastify.css";
import { StringParam, useQueryParam } from "use-query-params";
import LoadingIndicator from "components/loading-indicator";
import {
  ArrowRight,
  ArrowDropDown,
  InsertPhoto as InsertPhotoIcon,
  GpsNotFixed as GPSNotFixedIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import { Location } from "@reach/router";

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

const newLesson: Lesson = {
  lessonId: uuid(),
  arch: DEFAULT_CLASSIFIER_ARCHITECTURE,
  name: "",
  intro: "",
  dialogCategory: "default",
  question: "",
  conclusion: [""],
  expectations: [
    {
      expectation: "",
      expectationId: uuid().toString(),
      hints: [
        {
          text: "",
        },
      ],
      features: {},
    },
  ],
  createdAt: "",
  createdBy: "",
  createdByName: "",
  media: undefined,
  learningFormat: "default",
  features: {},
  lastTrainedAt: "",
  updatedAt: "",
};

interface LessonUnderEdit {
  lesson?: Lesson;
  dirty?: boolean;
}

export interface LessonEditSearch {
  lessonId: string;
  trainStatusPollInterval?: number;
  copyLesson?: string;
}

const LessonEdit = (props: {
  search: LessonEditSearch;
  location: Location;
}) => {
  const [lessonId, setLessonId] = useQueryParam("lessonId", StringParam);
  const [copyLesson] = useQueryParam("copyLesson", StringParam);

  const classes = useStyles();
  const [cookies] = useCookies(["accessToken"]);
  const context = useContext(SessionContext);
  const [lessonUnderEdit, setLessonUnderEdit] = React.useState<LessonUnderEdit>(
    { lesson: undefined, dirty: false }
  );
  const [error, setError] = React.useState("");

  const [isShowingAdvancedFeatures, setIsShowingAdvancedFeatures] =
    React.useState(false);

  const [mounted, setMounted] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const options = ["No Media", "Add Image", "Add Video"];

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedIndex(index);

    if (options[index] == "Add Image") {
      setLesson(
        {
          ...(lessonUnderEdit.lesson || newLesson),
          media: {
            type: (MediaType.IMAGE as string) || "",
            url: "",
            props: undefined,
          },
        },
        true
      );
    } else if (options[index] == "Add Video") {
      setLesson(
        {
          ...(lessonUnderEdit.lesson || newLesson),
          media: {
            type: (MediaType.VIDEO as string) || "",
            url: "",
            props: [
              { name: "start", value: "0" },
              {
                name: "end",
                value: String(Number.MAX_SAFE_INTEGER),
              },
            ],
          },
        },
        true
      );
    } else {
      setLesson(
        {
          ...(lessonUnderEdit.lesson || newLesson),
          media: null,
        },
        true
      );
    }
    setAnchorEl(null);
  };

  const handleClose = () => {
    2;
    setAnchorEl(null);
  };
  React.useEffect(() => {
    if (!lessonUnderEdit.lesson || mounted) {
      return;
    }
    window.scrollTo(0, 0);
    setMounted(true);
  }, [lessonUnderEdit.lesson]);

  React.useEffect(() => {
    if (lessonId) {
      fetchLesson(lessonId, cookies.accessToken)
        .then((lesson: Lesson) => {
          setLesson(lesson);
        })
        .catch((err: string) => console.error(err));
    } else if (copyLesson) {
      fetchLesson(copyLesson, cookies.accessToken)
        .then((lesson: Lesson) => {
          setLessonUnderEdit({
            lesson: {
              ...lesson,
              lessonId: uuid(),
              name: `Copy of ${lesson.name}`,
              createdByName: context.user?.name || "",
            },
            dirty: true,
          });
        })
        .catch((err: string) => console.error(err));
    } else {
      setLesson({
        ...newLesson,
        createdByName: context.user?.name || "",
      });
    }
  }, [context.user]);

  React.useEffect(() => {
    if (!lessonUnderEdit.lesson) {
      return;
    }
    const id = lessonUnderEdit.lesson.lessonId;
    if (!/^[a-z0-9-]+$/g.test(id)) {
      setError("id must be lower-case and alpha-numeric.");
    } else if (lessonId !== id) {
      fetchLessons({ lessonId: id }, 1, "", "", true, cookies.accessToken)
        .then((lessons) => {
          if (lessons && lessons.edges.length > 0) {
            setError("id is already being used for another lesson.");
          } else {
            setError("");
          }
        })
        .catch((err) => console.error(err));
    } else {
      setError("");
    }
  }, [lessonUnderEdit.lesson]);

  function setLesson(lesson?: Lesson, dirty?: boolean) {
    if (lessonUnderEdit.lesson?.lessonId !== lesson?.lessonId) {
      setError("verifying lesson id...");
    }
    setLessonUnderEdit({ lesson, dirty });
  }

  interface Prop {
    name: string;
    value: string;
  }

  function getProp(props: Array<Prop>, key: string): string {
    return props.find((p) => p.name === key)?.value || "";
  }

  function copyAndSetProp(props: Array<Prop>, prop: Prop): Array<Prop> {
    const pix = props.findIndex((p) => p.name === prop.name);
    if (pix >= 0) {
      return props.map((existing, i) => {
        if (i === pix) {
          return prop;
        } else {
          return existing;
        }
      });
    } else {
      return [...props, prop];
    }
  }

  if (!lessonUnderEdit.lesson) {
    return <LoadingIndicator />;
  }

  if (lessonId && !userCanEdit(lessonUnderEdit.lesson, context.user)) {
    return <div>You do not have permission to view this lesson.</div>;
  }

  const handleLessonName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        name: e.target.value || "",
      },
      true
    );
  };

  const handleLessonType = (e: SelectChangeEvent<string>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        learningFormat: (e.target.value as string) || "default",
      },
      true
    );
  };

  const handleLessonIntro = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        intro: e.target.value || "",
      },
      true
    );
  };

  const handleQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        question: e.target.value || "",
      },
      true
    );
  };

  const handleVideoStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        media: {
          url: lessonUnderEdit.lesson?.media?.url || "",
          type: MediaType.VIDEO,
          props: copyAndSetProp(
            (lessonUnderEdit.lesson || newLesson).media?.props || [],
            {
              name: "start",
              value: String(parseFloat(e.target.value) || 0) || "",
            }
          ),
        },
      },
      true
    );
  };

  const handleVideoEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        media: {
          url: lessonUnderEdit.lesson?.media?.url || "",
          type: MediaType.VIDEO,
          props: copyAndSetProp(
            (lessonUnderEdit.lesson || newLesson).media?.props || [],
            {
              name: "end",
              value:
                String(parseFloat(e.target.value) || Number.MAX_SAFE_INTEGER) ||
                "",
            }
          ),
        },
      },
      true
    );
  };

  const handleVideoURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        media: {
          ...(lessonUnderEdit.lesson || newLesson).media,
          type: MediaType.VIDEO,
          url: (e.target.value as string) || "",
        },
      },
      true
    );
  };

  const handleImageURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        media: {
          ...(lessonUnderEdit.lesson || newLesson).media,
          type: MediaType.IMAGE,
          url: (e.target.value as string) || "",
        },
      },
      true
    );
  };

  const handleLessonId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        lessonId: e.target.value || "",
      },
      true
    );
  };

  const handleDialogCategory = (e: SelectChangeEvent<string>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        dialogCategory: (e.target.value as string) || "",
      },
      true
    );
  };

  const handleClassifierArch = (e: SelectChangeEvent<string>) => {
    setLesson(
      {
        ...(lessonUnderEdit.lesson || newLesson),
        arch: (e.target.value as string) || DEFAULT_CLASSIFIER_ARCHITECTURE,
      },
      true
    );
  };

  const AdvancedFeatures = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 5,
            cursor: "pointer",
          }}
          onClick={() =>
            setIsShowingAdvancedFeatures(!isShowingAdvancedFeatures)
          }
        >
          {isShowingAdvancedFeatures ? <ArrowDropDown /> : <ArrowRight />}
          <Typography variant="body2" data-cy="advanced-features">
            {isShowingAdvancedFeatures
              ? "Hide Advanced Features"
              : "Show Advanced Features"}
          </Typography>
        </div>
        <div style={isShowingAdvancedFeatures ? {} : { display: "none" }}>
          <Grid
            container
            spacing={2}
            style={{ marginTop: 3, marginBottom: 20 }}
          >
            <Grid item xs={8}>
              <TextField
                data-cy="lesson-id"
                label="Lesson ID"
                placeholder="Unique alias to the lesson"
                fullWidth
                multiline
                error={error !== ""}
                helperText={error}
                InputLabelProps={{
                  shrink: true,
                }}
                value={lessonUnderEdit.lesson?.lessonId || ""}
                onChange={handleLessonId}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                multiline
                data-cy="lesson-creator"
                label="Created By"
                placeholder="Guest"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={lessonUnderEdit.lesson?.createdByName || "Guest"}
                disabled={true}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl className={classes.selectForm} variant="outlined">
                <InputLabel
                  shrink
                  id="dialog-category-label"
                  key="Confirmation Code"
                >
                  Dialog Category
                </InputLabel>
                <Select
                  labelId="dialog-category-label"
                  value={lessonUnderEdit.lesson?.dialogCategory || "NOT SET"}
                  label="Dialog Category"
                  onChange={handleDialogCategory}
                >
                  <MenuItem value={"default"}>Default</MenuItem>
                  <MenuItem value={"sensitive"}>Sensitive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.selectForm} variant="outlined">
                <InputLabel shrink id="classifier-arch-label">
                  Classifier Architecture
                </InputLabel>
                <Select
                  data-cy="classifier-arch"
                  labelId="classifier-arch-label"
                  label="Classifier Architecture"
                  value={
                    lessonUnderEdit.lesson?.arch ||
                    DEFAULT_CLASSIFIER_ARCHITECTURE
                  }
                  onChange={handleClassifierArch}
                >
                  <MenuItem value={DEFAULT_CLASSIFIER_ARCHITECTURE}>
                    LR2
                  </MenuItem>
                  <MenuItem value={OPENAI_CLASSIFIER_ARCHITECTURE}>
                    OpenAI
                  </MenuItem>
                  <MenuItem value={COMPOSITE_CLASSIFIER_ARCHITECTURE}>
                    COMPOSITE
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>{" "}
      </>
    );
  };

  return (
    <>
      <Grid container sx={{ display: "flex" }}>
        <SideBar
          lessonId={lessonId || ""}
          lessonUnderEdit={lessonUnderEdit}
          setLesson={setLesson}
          setLessonId={setLessonId}
          error={error}
          cookies={cookies}
          classes={classes}
          search={props.search}
        />
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
            <Grid container data-cy="lesson-edit-grid" spacing={2}>
              <Grid item xs={8}>
                <TextField
                  data-cy="lesson-name"
                  label="Lesson Title"
                  placeholder="Lesson Name"
                  fullWidth
                  multiline
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={lessonUnderEdit.lesson?.name || ""}
                  onChange={handleLessonName}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl className={classes.selectForm} variant="outlined">
                  <InputLabel shrink id="lesson-format-label">
                    Lesson Type
                  </InputLabel>
                  <Select
                    data-cy="lesson-format"
                    labelId="lesson-format-label"
                    label="Lesson Type"
                    value={lessonUnderEdit.lesson?.learningFormat || "default"}
                    onChange={handleLessonType}
                    renderValue={(value) => {
                      return (
                        <Box sx={{ display: "flex", gap: 17 }}>
                          {value == "default" ? (
                            <GPSNotFixedIcon />
                          ) : (
                            <ViewModuleIcon />
                          )}
                          {value == "default"
                            ? "Default Format"
                            : "Survey Says Format"}
                        </Box>
                      );
                    }}
                  >
                    <MenuItem value={"default"}>
                      <ListItemIcon>
                        <GPSNotFixedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Default Format" />
                    </MenuItem>
                    <MenuItem value={"surveySays"}>
                      <ListItemIcon>
                        <ViewModuleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Survey Says Format">
                        Survey Says Format
                      </ListItemText>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Divider variant="middle" className={classes.divider} />
            </Grid>

            <Paper elevation={0} style={{ textAlign: "left" }}>
              <Typography
                variant="h6"
                style={{ paddingTop: 5, paddingBottom: 15 }}
              >
                Question
              </Typography>

              <Grid container spacing={2} style={{ marginBottom: 20 }}>
                <Grid item xs={12}>
                  <TextField
                    data-cy="intro"
                    label="Introduction"
                    placeholder="Introduction of lesson, 'This lesson is about...'"
                    multiline
                    maxRows={4}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={lessonUnderEdit.lesson?.intro || ""}
                    onChange={handleLessonIntro}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={6}
                style={{ marginBottom: 20 }}
                alignItems="center"
              >
                <Grid item xs={10}>
                  <TextField
                    data-cy="question"
                    label="Question"
                    placeholder="What is...?"
                    multiline
                    maxRows={4}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={lessonUnderEdit.lesson?.question || ""}
                    onChange={handleQuestion}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={2} style={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    data-cy="media-type"
                    startIcon={<InsertPhotoIcon />}
                    size="large"
                    color="primary"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClickListItem}
                    style={{
                      backgroundColor: "#1B6A9C",
                      paddingLeft: 20,
                      paddingRight: 20,
                    }}
                  >
                    ADD MEDIA
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "media-button",
                      role: "listbox",
                    }}
                  >
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        data-cy={
                          option === "No Media"
                            ? "media-none"
                            : option === "Add Image"
                            ? "media-image"
                            : "media-video"
                        }
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </Grid>
              </Grid>
              {lessonUnderEdit.lesson.media &&
              lessonUnderEdit.lesson.media.type === MediaType.IMAGE ? (
                <Grid item xs={12}>
                  <div className={classes.image}>
                    <TextField
                      data-cy="image"
                      label="Image"
                      placeholder="Image URL"
                      required
                      multiline
                      maxRows={4}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={lessonUnderEdit.lesson.media.url || ""}
                      onChange={handleImageURL}
                      variant="outlined"
                    />
                    <img
                      className={classes.thumbnail}
                      data-cy="image-thumbnail"
                      src={lessonUnderEdit.lesson.media.url}
                      onClick={() => {
                        window.open(
                          lessonUnderEdit.lesson?.media?.url || "",
                          "_blank"
                        );
                      }}
                    />
                  </div>
                </Grid>
              ) : (
                <></>
              )}
              {lessonUnderEdit.lesson.media &&
              lessonUnderEdit.lesson.media.type === MediaType.VIDEO ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      data-cy="video-url"
                      label="Video"
                      placeholder="YouTube Video URL"
                      required
                      multiline
                      maxRows={4}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={lessonUnderEdit.lesson.media.url || ""}
                      onChange={handleVideoURL}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      // TODO: With MUI v5 We can dimply do: rowSpacing={2}
                      direction={"row"}
                      spacing={2}
                    >
                      <Grid item xs={6}>
                        <TextField
                          data-cy="video-start"
                          label="Video Start Time"
                          placeholder="0.0"
                          type="number"
                          required
                          multiline
                          maxRows={1}
                          // style={{ width: "50%" }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          value={
                            lessonUnderEdit.lesson.media &&
                            lessonUnderEdit.lesson.media.props
                              ? parseFloat(
                                  getProp(
                                    lessonUnderEdit.lesson.media.props,
                                    "start"
                                  )
                                ) || 0
                              : 0
                          }
                          onChange={handleVideoStart}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          data-cy="video-end"
                          label="Video End Time"
                          placeholder="180.0"
                          type="number"
                          required
                          multiline
                          fullWidth
                          maxRows={1}
                          // style={{ width: "50%" }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={
                            lessonUnderEdit.lesson.media &&
                            lessonUnderEdit.lesson.media.props
                              ? parseFloat(
                                  getProp(
                                    lessonUnderEdit.lesson.media.props,
                                    "end"
                                  )
                                ) || Number.MAX_SAFE_INTEGER
                              : Number.MAX_SAFE_INTEGER
                          }
                          onChange={handleVideoEnd}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
            </Paper>
            <Divider variant="middle" className={classes.divider} />

            <ExpectationsList
              classes={classes}
              lessonId={lessonId ?? ""}
              expectations={lessonUnderEdit.lesson?.expectations}
              updateExpectations={(exp: LessonExpectation[]) =>
                setLesson(
                  {
                    ...(lessonUnderEdit.lesson || newLesson),
                    expectations: exp,
                  },
                  true
                )
              }
            />
            <Divider variant="middle" className={classes.divider} />
            <ConclusionsList
              classes={classes}
              conclusions={lessonUnderEdit.lesson?.conclusion}
              updateConclusions={(conclusions: string[]) =>
                setLesson(
                  {
                    ...(lessonUnderEdit.lesson || newLesson),
                    conclusion: conclusions,
                  },
                  true
                )
              }
            />
          </form>
          <AdvancedFeatures />
          <Divider
            variant="middle"
            className={classes.divider}
            sx={{ marginTop: 2 }}
          />
          <ToastContainer />
        </Grid>
      </Grid>
    </>
  );
};

function EditPage(props: {
  search: LessonEditSearch;
  location: Location;
}): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const [lessonId] = useQueryParam("lessonId", StringParam);

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view lesson.</div>;
  }
  if (!context.user) {
    return <LoadingIndicator />;
  }
  return (
    <div>
      <div className="navbar-container">
        <NavBar title={lessonId ? "Edit Lesson" : "Create Lesson"} />
      </div>

      <LessonEdit search={props.search} location={props.location} />
    </div>
  );
}

export default withLocation(EditPage);
