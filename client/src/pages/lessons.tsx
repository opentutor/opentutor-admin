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
  FormControlLabel,
  Button,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { Link, navigate } from "@reach/router";
import "styles/layout.css";

import { Lesson, LessonEdge } from "types";
import { fetchLessons, createLesson } from "api";
import EditPage from "./edit";

import { template } from "@babel/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const columns: ColumnDef[] = [
  { id: "sessionId", label: "Lesson Name", minWidth: 170, align: "center" },
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
        updatedAt: 0,
        createdAt: 0,
      },
    },
  ];

  const [lessons, setLessons] = React.useState<LessonEdge[]>(initialLessons);
  const [newLesson, setNewLesson] = React.useState<Lesson>();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    fetchLessons()
      .then((lessons) => {
        console.log(`fetchLessons got`, lessons);
        if (Array.isArray(lessons)) {
          setLessons(lessons);
        }
      })
      .catch((err) => console.error(err));
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
        if (newLesson !== undefined) {
          setNewLesson(newLesson);
        }
        const copyLessons = [...lessons] as Array<any>;
        copyLessons.push({ node: newLesson });
        console.log(copyLessons);
        setLessons(copyLessons);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <div id="header">Lessons</div>
      <div id="add">
        <Button
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
                        <Link to={`/edit?lessonId=${row.node.lessonId}`}>
                          {row.node.name ? row.node.name : "No Lesson Name"}
                        </Link>
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

const LessonsPage = ({ path }: { path: string }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <LessonsTable path={path} />
    </MuiThemeProvider>
  );
};

export default LessonsPage;
