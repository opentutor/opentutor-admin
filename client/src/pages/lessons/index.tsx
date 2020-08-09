import { withPrefix } from "gatsby";
import React from "react";
import {
  AppBar,
  CircularProgress,
  Fab,
  IconButton,
  Paper,
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
import { LessonEdge, LessonsData } from "types";
import { fetchLessons } from "api";
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
  container: {},
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
  { id: "", label: "", minWidth: 0, align: "center" },
  { id: "name", label: "Lesson", minWidth: 200, align: "center" },
  { id: "updatedAt", label: "Date", minWidth: 170, align: "center" },
];

const LessonItem = (props: { location: any; row: LessonEdge; i: number }) => {
  const { location, row, i } = props;

  function launchLesson(id: string) {
    const host = process.env.TUTOR_ENDPOINT || location.origin;
    const path = `${host}/tutor?lesson=${id}`;
    window.location.href = path;
  }

  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={`lesson-${i}`}>
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
  onNext: () => void;
  onPrev: () => void;
}) => {
  const { classes, hasNext, hasPrev, onNext, onPrev } = props;

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
  const [lessons, setLessons] = React.useState<LessonsData>();
  const [prevPages, setPrevPages] = React.useState<string[]>([""]);
  const [page, setPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [sortDesc, setSortDesc] = React.useState(true);
  const rowsPerPage = 10;

  function onSort(id: string) {
    setSortBy(id);
    setSortDesc(!sortDesc);
  }

  function nextPage() {}

  function prevPage() {}

  React.useEffect(() => {
    fetchLessons(rowsPerPage, prevPages[page], sortBy, sortDesc)
      .then((lessons) => {
        console.log(`fetchLessons got`, lessons);
        if (lessons !== undefined) {
          const tmp: any = lessons.edges;
          tmp.map((lesson: any) => {
            lesson.node.updatedAt = new Date(lesson.node.updatedAt);
          });
          setLessons(lessons);
        }
      })
      .catch((err) => console.error(err));
  }, [page, prevPages, sortBy, sortDesc]);

  if (!lessons) {
    return (
      <div className={classes.root}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  }

  return (
    <div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <ColumnHeader
              columns={columns}
              sortBy={sortBy}
              sortDesc={sortDesc}
              onSort={onSort}
            />
            <TableBody>
              {lessons.edges.map((row, i) => (
                <LessonItem location={props.location} row={row} i={i} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TableFooter
        classes={classes}
        hasPrev={prevPages.length > 1}
        hasNext={lessons.pageInfo.hasNextPage}
        onPrev={prevPage}
        onNext={nextPage}
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
