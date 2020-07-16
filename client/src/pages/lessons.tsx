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
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link, navigate } from "@reach/router";

import { LessonEdge, LessonExpectation } from "types";
import { fetchLessons, createLesson } from "api";
import NavBar from "components/nav-bar";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const columns: ColumnDef[] = [
  { id: "sessionId", label: "Lesson Name", minWidth: 170, align: "center" },
  {
    id: "date",
    label: "Date",
    minWidth: 170,
    align: "center",
    format: (value: number): string => value.toLocaleString("en-US"),
  },
];

interface ColumnDef {
  id: string;
  name?: string;
  label: string;
  minWidth: number;
  align?: "right" | "left" | "center";
  format?: (v: number) => string;
}

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

export const LessonsTable = ({ path }: { path: string }) => {
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
        const path = "/edit?lessonId=" + newLesson?.lessonId;
        navigate(path);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <div id="header">Lessons</div>
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
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
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
                        key={`lesson-name-${i}`}
                        id={`lesson-name-${i}`}
                        align="left"
                      >
                        <Link to={`edit?lessonId=${row.node.lessonId}`}>
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

const LessonsPage = ({ path, children }: { path: string; children: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar title="Lessons" />
      <LessonsTable path={path} />
      {children}
    </MuiThemeProvider>
  );
};

export default LessonsPage;
