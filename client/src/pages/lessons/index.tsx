import { withPrefix } from "gatsby";
import React from "react";
import { useCookies } from "react-cookie";
import {
  AppBar,
  CircularProgress,
  Fab,
  FormGroup,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
} from "@material-ui/core";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import LaunchIcon from "@material-ui/icons/Launch";
import AddIcon from "@material-ui/icons/Add";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { Link, navigate } from "@reach/router";
import { fetchLessons } from "api";
import { Edge, Lesson, LessonsData } from "types";
import { ColumnDef, ColumnHeader } from "components/column-header";
import NavBar from "components/nav-bar";
import "styles/layout.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexFlow: "column",
  },
  container: {
    flex: 1,
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  appBar: {
    height: "10%",
    top: "auto",
    bottom: 0,
  },
  fab: {
    position: "absolute",
    right: theme.spacing(1),
    zIndex: 1,
  },
  progress: {
    marginLeft: "50%",
  },
});

const columns: ColumnDef[] = [
  { id: "", label: "", minWidth: 0, align: "left" },
  { id: "name", label: "Lesson", minWidth: 200, align: "left" },
  { id: "createdBy", label: "Created By", minWidth: 200, align: "left" },
  { id: "updatedAt", label: "Date", minWidth: 170, align: "center" },
];

const LessonItem = (props: { location: any; row: Edge<Lesson>; i: number }) => {
  const { location, row, i } = props;

  function launchLesson(id: string) {
    const host = process.env.TUTOR_ENDPOINT || location.origin;
    const path = `${host}/tutor?lesson=${id}`;
    window.location.href = path;
  }

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell
        key={`lesson-launch-${i}`}
        id={`lesson-launch-${i}`}
        align="left"
      >
        <IconButton onClick={() => launchLesson(row.node.lessonId)}>
          <LaunchIcon />
        </IconButton>
      </TableCell>
      <TableCell key={`lesson-name-${i}`} id={`lesson-name-${i}`} align="left">
        <Link to={withPrefix(`/lessons/edit?lessonId=${row.node.lessonId}`)}>
          {row.node.name ? row.node.name : "No Lesson Name"}
        </Link>
      </TableCell>
      <TableCell
        key={`lesson-creator-${i}`}
        id={`lesson-creator-${i}`}
        align="left"
      >
        {row.node.createdBy}
      </TableCell>
      <TableCell key={`date-${i}`} align="center">
        {row.node.updatedAt ? row.node.updatedAt.toLocaleString() : ""}
      </TableCell>
    </TableRow>
  );
};

const TableFooter = (props: {
  classes: any;
  hasNext: boolean;
  hasPrev: boolean;
  showCreator: boolean;
  onNext: () => void;
  onPrev: () => void;
  onToggle: () => void;
}) => {
  const {
    classes,
    hasNext,
    hasPrev,
    showCreator,
    onNext,
    onPrev,
    onToggle,
  } = props;
  const [cookies] = useCookies(["user"]);

  function onCreate() {
    navigate(withPrefix("/lessons/edit?lessonId=new"));
  }

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        <IconButton disabled={!hasPrev} onClick={onPrev}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton disabled={!hasNext} onClick={onNext}>
          <KeyboardArrowRightIcon />
        </IconButton>
        {!cookies.user ? undefined : (
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showCreator}
                  onChange={onToggle}
                  aria-label="switch"
                />
              }
              label={"Only Mine"}
            />
          </FormGroup>
        )}
        <Fab
          id="create-button"
          variant="extended"
          color="primary"
          className={classes.fab}
          onClick={onCreate}
        >
          <AddIcon />
          Create Lesson
        </Fab>
      </Toolbar>
    </AppBar>
  );
};

export const LessonsTable = (props: { location: any }) => {
  const classes = useStyles();
  const [cookies] = useCookies(["user"]);
  const [lessons, setLessons] = React.useState<LessonsData>();
  const [cursors, setCursors] = React.useState<string[]>([""]);
  const [page, setPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [sortDesc, setSortDesc] = React.useState(true);
  const [showCreator, setShowCreator] = React.useState<boolean>(cookies.user);
  const rowsPerPage = 10;

  const onToggleShowCreator = (): void => {
    setShowCreator(!showCreator);
  };

  function onSort(id: string) {
    if (sortBy === id) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(id);
    }
  }

  function nextPage() {
    setPage(page + 1);
  }

  function prevPage() {
    setPage(page - 1);
  }

  React.useEffect(() => {
    fetchLessons(rowsPerPage, cursors[page], sortBy, sortDesc)
      .then((l) => {
        console.log(`fetchLessons got`, l);
        if (l !== undefined) {
          const tmp: any = l.edges;
          tmp.map((lesson: any) => {
            lesson.node.updatedAt = new Date(lesson.node.updatedAt);
          });
          setLessons(l);
        }
      })
      .catch((err) => console.error(err));
  }, [page, sortBy, sortDesc]);

  React.useEffect(() => {
    if (!lessons) {
      return;
    }
    const updateCursors = cursors;
    if (lessons.pageInfo.hasNextPage) {
      updateCursors[page + 1] = lessons.pageInfo.endCursor;
    }
    setCursors(updateCursors);
  }, [lessons]);

  if (!lessons) {
    return (
      <div className={classes.root}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <ColumnHeader
              columns={columns}
              sortBy={sortBy}
              sortDesc={sortDesc}
              onSort={onSort}
            />
            <TableBody>
              {lessons.edges
                .filter(
                  (edge: Edge<Lesson>) =>
                    !showCreator || edge.node.createdBy === cookies.user
                )
                .map((row, i) => (
                  <LessonItem
                    key={`lesson-${i}`}
                    location={props.location}
                    row={row}
                    i={i}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TableFooter
        classes={classes}
        hasPrev={page > 0}
        hasNext={lessons.pageInfo.hasNextPage}
        showCreator={showCreator}
        onPrev={prevPage}
        onNext={nextPage}
        onToggle={onToggleShowCreator}
      />
    </div>
  );
};

const LessonsPage = (props: { location: any; path: string; children: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar title="Lessons" />
      <LessonsTable location={props.location} />
      {props.children}
    </MuiThemeProvider>
  );
};

export default LessonsPage;
