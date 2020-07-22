import { withPrefix } from "gatsby";
import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  IconButton,
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import AddIcon from "@material-ui/icons/Add";
import { Link, navigate } from "@reach/router";

import { LessonEdge } from "types";
import { fetchLessons, createLesson } from "api";
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
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  button: {
    margin: theme.spacing(1),
  },
});

export const LessonsTable = (props: { location: any }) => {
  const classes = useStyles();
  const initialLessons = [
    {
      node: {
        id: "",
        lessonId: "",
        name: "",
        intro: "",
        question: "",
        conclusion: "",
        expectations: [
          {
            expectation: "",
            hints: [{ text: "" }],
          },
        ],
        updatedAt: new Date(0),
        createdAt: new Date(0),
      },
    },
  ];

  const [lessons, setLessons] = React.useState<LessonEdge[]>(initialLessons);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    let mounted = true;
    fetchLessons()
      .then((lessons) => {
        console.log(`fetchLessons got`, lessons);
        if (mounted) {
          if (Array.isArray(lessons)) {
            const tmp: any = lessons;
            lessons.map((lesson: LessonEdge, i: number) => {
              lessons[i].node.updatedAt = new Date(lesson.node.updatedAt);
            });
            setLessons(
              lessons.sort(
                (a: LessonEdge, b: LessonEdge) =>
                  +b.node.updatedAt - +a.node.updatedAt
              )
            );
          }
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangePage = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeRowsPerPage = (event: any): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function handleCreate() {
    createLesson()
      .then((newLesson) => {
        console.log(`fetchCreateLesson got`, newLesson);
        const path = withPrefix(
          "/lessons/edit?lessonId=" + newLesson?.lessonId
        );
        navigate(path);
      })
      .catch((err) => console.error(err));
  }

  function handleLaunch(id: string) {
    const host = process.env.TUTOR_ENDPOINT || props.location.origin;
    const path = `${host}/tutor?lesson=${id}`;
    window.location.href = path;
  }

  return (
    <div>
      <div>
        <Button
          id="create-button"
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Lesson
        </Button>
      </div>

      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center"> Lesson </TableCell>
                <TableCell align="center"> Date </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lessons
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`lesson-${i}`}
                    >
                      <TableCell
                        key={`lesson-launch-${i}`}
                        id={`lesson-launch-${i}`}
                        align="left"
                      >
                        <IconButton
                          onClick={() => handleLaunch(row.node.lessonId)}
                        >
                          <LaunchIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        key={`lesson-name-${i}`}
                        id={`lesson-name-${i}`}
                        align="left"
                      >
                        <Link
                          to={withPrefix(
                            `/lessons/edit?lessonId=${row.node.lessonId}`
                          )}
                        >
                          {row.node.name ? row.node.name : "No Lesson Name"}
                        </Link>
                      </TableCell>
                      <TableCell key={`date-${i}`} align="center">
                        {row.node.updatedAt
                          ? row.node.updatedAt.toLocaleString()
                          : ""}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={lessons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
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
