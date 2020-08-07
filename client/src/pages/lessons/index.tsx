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
  TableSortLabel,
  TableRow,
  Button,
  IconButton,
  Toolbar,
  AppBar,
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import AddIcon from "@material-ui/icons/Add";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { Link, navigate } from "@reach/router";

import { LessonsData, Lesson } from "types";
import { fetchLessons } from "api";
import NavBar from "components/nav-bar";
import "styles/layout.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const columns: ColumnDef[] = [
  { id: "name", label: "Lesson", minWidth: 170, align: "center" },
  { id: "updatedAt", label: "Date", minWidth: 170, align: "center" },
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
  appBar: {
    height: "10%",
    top: "auto",
    bottom: 0,
  },
});

export const LessonsTable = (props: { location: any }) => {
  const classes = useStyles();
  const initialLessons: LessonsData = {
    edges: [
      {
        cursor: "",
        node: {
          id: "",
          lessonId: "",
          name: "",
          intro: "",
          question: "",
          conclusion: [""],
          expectations: [
            {
              expectation: "",
              hints: [{ text: "" }],
            },
          ],
          updatedAt: "",
          createdAt: "",
        },
      },
    ],
    pageInfo: {
      hasNextPage: false,
      endCursor: "",
    },
  };

  const [lessons, setLessons] = React.useState<LessonsData>(initialLessons);
  const [prevPages, setPrevPages] = React.useState<string[]>([""]);
  const [page, setPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [sortDesc, setSortDesc] = React.useState(true);
  const rowsPerPage = 10;

  React.useEffect(() => {
    let mounted = true;
    fetchLessons(rowsPerPage, prevPages[prevPages.length - 1], sortBy, sortDesc)
      .then((lessons) => {
        console.log(`fetchLessons got`, lessons);
        if (mounted && lessons && Array.isArray(lessons.edges)) {
          lessons.edges.map((lesson) => {
            lesson.node.updatedAt = new Date(
              lesson.node.updatedAt
            ).toISOString();
          });
          setLessons(lessons);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [prevPages, sortBy, sortDesc]);

  function handleCreate() {
    navigate(withPrefix("/lessons/edit?lessonId=new"));
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
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={
                        sortBy === column.id
                          ? sortDesc
                            ? "asc"
                            : "desc"
                          : "asc"
                      }
                      onClick={() => {
                        setSortBy(column.id);
                        setSortDesc(!sortDesc);
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {lessons.edges.map((row, i) => {
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
      </Paper>
      <AppBar position="sticky" color="default" className={classes.appBar}>
        <Toolbar>
          <IconButton
            disabled={prevPages.length === 1 ? true : false}
            onClick={() => {
              setPrevPages(
                prevPages.filter(
                  (elem) => elem !== prevPages[prevPages.length - 1]
                )
              );
            }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton
            disabled={!lessons.pageInfo.hasNextPage}
            onClick={() => {
              setPrevPages((prevPages) => [
                ...prevPages,
                lessons.pageInfo.endCursor,
              ]);
            }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
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
