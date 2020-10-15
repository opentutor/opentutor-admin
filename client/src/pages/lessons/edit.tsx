import Ajv from "ajv";
import { navigate } from "gatsby";
import React from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  fetchLesson,
  updateLesson,
  fetchTrainingStatus,
  trainLesson,
} from "api";
import NavBar from "components/nav-bar";
import ConclusionsList from "components/conclusions-list";
import ExpectationsList from "components/expectations-list";
import { Lesson, LessonExpectation, TrainStatus, TrainState } from "types";
import withLocation from "wrap-with-location";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";
import "react-toastify/dist/ReactToastify.css";

const TRAIN_STATUS_POLL_INTERVAL_DEFAULT = 1000;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "100ch",
    },
    "& > *": {
      borderBottom: "unset",
    },
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
  },
  listDragging: {
    background: "lightgreen",
  },
  button: {
    margin: theme.spacing(2),
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
    padding: 10,
  },
}));

const LessonEdit = (props: {
  search: { lessonId: string; trainStatusPollInterval?: number };
}) => {
  const { lessonId } = props.search;
  const trainStatusPollInterval = !isNaN(
    Number(props.search.trainStatusPollInterval)
  )
    ? Number(props.search.trainStatusPollInterval)
    : TRAIN_STATUS_POLL_INTERVAL_DEFAULT;
  const classes = useStyles();
  const [cookies] = useCookies(["user"]);
  const [change, setChange] = React.useState(false);
  const newLesson = {
    lessonId: uuid(),
    createdBy: cookies.user || "",
    name: "Display name for the lesson",
    intro:
      "Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'",
    question:
      "Question the student needs to answer, e.g. 'What are the colors in RGB?'",
    image: "",
    conclusion: [
      "Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'",
    ],
    expectations: [
      {
        expectation: "Add a short ideal answer for an expectation, e.g. 'Red'",
        hints: [
          {
            text:
              "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
          },
        ],
        features: {},
      },
    ],
    features: {},
    isTrainable: false,
    lastTrainedAt: "",
  };
  const [lesson, setLesson] = React.useState(newLesson);
  const [loaded, setLoaded] = React.useState(false);
  const [savePopUp, setSavePopUp] = React.useState(false);
  const [isTraining, setIsTraining] = React.useState(false);
  const [trainPopUp, setTrainPopUp] = React.useState(false);
  const [statusUrl, setStatusUrl] = React.useState("");
  const [trainData, setTrainData] = React.useState<TrainStatus>({
    state: TrainState.NONE,
  });

  React.useEffect(() => {
    let mounted = true;
    if (lessonId !== "new") {
      fetchLesson(lessonId)
        .then((lesson: Lesson) => {
          if (mounted && lesson) {
            setLesson(lesson);
            setLoaded(true);
          }
        })
        .catch((err: string) => console.error(err));
      return () => {
        mounted = false;
      };
    } else {
      setLoaded(true);
    }
  }, []);

  function isValidId(): boolean {
    return /^[a-z0-9-]+$/g.test(lesson.lessonId);
  }

  function isExpValid(exp: LessonExpectation): boolean {
    if (!exp.features) {
      return true;
    }
    const ajv = new Ajv({ allErrors: true, verbose: true });
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const schema = require("schemas/expectation-feature-schema.json");
    const validate = ajv.compile(schema);
    return validate(exp.features) === true;
  }

  function isLessonValid(): boolean {
    return (
      lesson &&
      loaded &&
      isValidId() &&
      lesson.expectations.every((exp) => isExpValid(exp))
    );
  }

  function handleLessonNameChange(name: string): void {
    setChange(true);
    setLesson({ ...lesson, name: name });
  }

  function handleLessonIdChange(lessonId: string): void {
    setChange(true);
    setLesson({ ...lesson, lessonId: lessonId });
  }

  function handleIntroChange(intro: string): void {
    setChange(true);
    setLesson({ ...lesson, intro: intro });
  }

  function handleQuestionChange(question: string): void {
    setChange(true);
    setLesson({ ...lesson, question: question });
  }

  function handleImageChange(image: string): void {
    setChange(true);
    setLesson({ ...lesson, image: image });
  }

  function handleExpectationsChange(exp: LessonExpectation[]): void {
    try {
      setChange(true);
      setLesson({
        ...lesson,
        expectations: exp,
      });
    } catch (e) {
      console.error(e);
    }
  }

  function handleConclusionsChange(conclusions: string[]): void {
    setChange(true);
    setLesson({
      ...lesson,
      conclusion: conclusions,
    });
  }

  function handleSave() {
    setSavePopUp(true);
  }

  function handleSavePopUp(): void {
    setSavePopUp(false);
  }

  function handleSaveExit(): void {
    saveChanges();
    navigate(`/lessons`);
  }

  function handleSaveContinue(): void {
    saveChanges();
    handleSavePopUp();
  }

  function saveChanges(): void {
    toast("Saving...");
    const converted = encodeURI(JSON.stringify(lesson));
    let origId = lessonId;
    if (lessonId === "new") {
      origId = lesson.lessonId;
    }
    updateLesson(origId, converted)
      .then((lesson) => {
        if (lesson) {
          setLesson(lesson);
        }
        toast("Success!");
      })
      .catch((err) => {
        toast("Failed to save lesson.");
        console.error(err);
      });
  }

  function handleLaunch() {
    saveChanges();
    const host = process.env.TUTOR_ENDPOINT || location.origin;
    const guest = cookies.user ? `&guest=${cookies.user}` : "";
    const path = `${host}/tutor?lesson=${lessonId}&admin=true${guest}`;
    window.location.href = path;
  }

  function handleDiscard() {
    navigate(`/lessons`);
  }

  function useInterval(callback: any, delay: number | null) {
    const savedCallback = React.useRef() as any;

    React.useEffect(() => {
      savedCallback.current = callback;
    });

    React.useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      if (delay) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  function handleTrain(): void {
    if (lesson.isTrainable) {
      trainLesson(lesson.lessonId)
        .then((trainJob) => {
          setStatusUrl(trainJob.statusUrl);
          setIsTraining(true);
        })
        .catch((err: any) => {
          console.error(err);
          setTrainData({
            state: TrainState.FAILURE,
            status: err.message || `${err}`,
          });
          setIsTraining(false);
          setTrainPopUp(true);
        });
    } else {
      setTrainPopUp(true);
    }
  }

  useInterval(
    () => {
      fetchTrainingStatus(statusUrl)
        .then((trainStatus) => {
          setTrainData(trainStatus);
          if (
            trainStatus.state === TrainState.SUCCESS ||
            trainStatus.state === TrainState.FAILURE
          ) {
            setTrainPopUp(true);
            setIsTraining(false);
            if (trainStatus.state === TrainState.SUCCESS) {
              const converted = encodeURI(
                JSON.stringify({ ...lesson, lastTrainedAt: new Date() })
              );
              updateLesson(lesson.lessonId, converted)
                .then((lesson) => {
                  if (lesson !== undefined) {
                    setLesson(lesson);
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            }
          }
        })
        .catch((err: Error) => {
          setTrainData({ state: TrainState.FAILURE, status: err.message });
          setTrainPopUp(true);
          setIsTraining(false);
          console.error(err);
        });
    },
    isTraining ? trainStatusPollInterval : null
  );

  function handleTrainPopUp(): void {
    setTrainPopUp(false);
  }

  return (
    <div style={{ paddingTop: "20px" }}>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
        >
          <TextField
            id="lesson-name"
            label="Lesson Name"
            placeholder="Display name for the lesson"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.name || ""}
            onChange={(e) => {
              handleLessonNameChange(e.target.value);
            }}
            variant="outlined"
          />
          <TextField
            id="lesson-id"
            label="Lesson ID"
            placeholder="Unique alias to the lesson"
            fullWidth
            error={!isValidId()}
            helperText={isValidId() ? "" : "must be a-z 0-9"}
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.lessonId || ""}
            onChange={(e) => {
              handleLessonIdChange(e.target.value);
            }}
            variant="outlined"
            size="small"
          />
          <TextField
            id="lesson-creator"
            label="Created By"
            placeholder="Guest"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.createdBy}
            disabled={true}
            size="small"
          />
        </Grid>
        <Grid
          container
          justify="flex-start"
          direction="column"
          alignItems="flex-start"
          style={{ paddingTop: "40px" }}
        >
          <TextField
            id="intro"
            label="Introduction"
            placeholder="Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'"
            multiline
            rowsMax={4}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.intro || ""}
            onChange={(e) => {
              handleIntroChange(e.target.value);
            }}
            variant="outlined"
          />
          <TextField
            id="question"
            label="Question"
            placeholder="Question the student needs to answer, e.g. 'What are the colors in RGB?'"
            multiline
            rowsMax={4}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={lesson.question || ""}
            onChange={(e) => {
              handleQuestionChange(e.target.value);
            }}
            variant="outlined"
          />
          <div className={classes.image}>
            <TextField
              id="image"
              label="Image"
              placeholder="Link to image url"
              multiline
              rowsMax={4}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={lesson.image || ""}
              onChange={(e) => {
                handleImageChange(e.target.value);
              }}
              variant="outlined"
            />
            <img
              className={classes.thumbnail}
              id="image-thumbnail"
              src={lesson.image}
              style={{ height: 50 }}
              onClick={() => {
                window.open(lesson.image, "_blank");
              }}
            />
          </div>
        </Grid>
        <Divider style={{ marginTop: 20 }} />
        <ExpectationsList
          classes={classes}
          loaded={loaded}
          expectations={lesson.expectations}
          updateExpectations={handleExpectationsChange}
        />
        <Divider />
        <ConclusionsList
          classes={classes}
          conclusions={lesson.conclusion}
          updateConclusions={handleConclusionsChange}
        />
      </form>
      <Box
        id="train-data"
        border={5}
        borderColor={
          trainData.state !== TrainState.SUCCESS &&
          trainData.state !== TrainState.FAILURE
            ? null
            : trainData.state === TrainState.FAILURE
            ? "#FF0000"
            : !(
                trainData.info &&
                trainData.info!.expectations &&
                Array.isArray(trainData.info!.expectations) &&
                trainData.info!.expectations!.length > 0
              )
            ? "#FF0000"
            : Math.min(
                ...trainData.info!.expectations!.map((x) => x.accuracy)
              ) >= 0.6
            ? "#008000"
            : Math.min(
                ...trainData.info!.expectations!.map((x) => x.accuracy)
              ) >= 0.4
            ? "#FFFF00"
            : "#FF0000"
        }
      >
        <Typography variant="h5">Training Data</Typography>
        <Typography>
          {lesson.lastTrainedAt
            ? `Last Trained: ${lesson.lastTrainedAt}`
            : `Last Trained: Never Trained`}
        </Typography>
        {isTraining ? (
          <CircularProgress />
        ) : trainData.state === TrainState.SUCCESS ? (
          <List>
            {trainData.info!.expectations!.map((x, i) => (
              <ListItem key={`train-success-accuracy-${i}`}>
                <ListItemText
                  style={{ textAlign: "center" }}
                  id={`train-success-accuracy-${i}`}
                >{`Accuracy: ${x.accuracy.toFixed(2)}`}</ListItemText>
              </ListItem>
            ))}
          </List>
        ) : trainData.state === TrainState.FAILURE ? (
          <Typography id="train-failure">{`TRAINING FAILED`}</Typography>
        ) : null}
      </Box>
      <div>
        <Button
          id="train-button"
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          style={{ background: lesson.isTrainable ? "#1B6A9C" : "#808080" }}
          disabled={isTraining}
          onClick={handleTrain}
        >
          Train
        </Button>
        <Button
          id="launch-button"
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          disabled={lessonId === "new" || !isLessonValid()}
          onClick={handleLaunch}
        >
          Launch
        </Button>
        {change ? (
          <Button
            id="save-button"
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
            disabled={!isLessonValid()}
          >
            Save
          </Button>
        ) : null}
        <Button
          id="discard-button"
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          style={{ background: "#1B6A9C" }}
          onClick={handleDiscard}
        >
          Discard
        </Button>
      </div>
      <Dialog open={trainPopUp} onClose={handleTrainPopUp}>
        {!lesson.isTrainable ? (
          <DialogTitle> NEEDS MORE GRADED DATA </DialogTitle>
        ) : trainData.state === TrainState.SUCCESS ? (
          <DialogTitle> Training Success </DialogTitle>
        ) : trainData.state === TrainState.FAILURE ? (
          <DialogTitle> Training Failed</DialogTitle>
        ) : null}
      </Dialog>
      <Dialog open={savePopUp} onClose={handleSavePopUp}>
        <DialogTitle>Save</DialogTitle>
        <DialogActions>
          <Button
            id="save-continue"
            onClick={handleSaveContinue}
            color="primary"
          >
            Continue
          </Button>
          <Button id="save-exit" onClick={handleSaveExit} color="primary">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

const EditPage = (props: { path: string; search: any }) => {
  return (
    <div>
      <NavBar title="Edit Lesson" />
      <LessonEdit search={props.search} />
    </div>
  );
};

export default withLocation(EditPage);
