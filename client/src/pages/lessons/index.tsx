/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Link, navigate } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import {
  AppBar,
  CircularProgress,
  Fab,
  FormGroup,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import LaunchIcon from "@material-ui/icons/Launch";
import { fetchLessons, deleteLesson, userCanEdit } from "api";
import { Connection, Edge, Lesson } from "types";
import { ColumnDef, ColumnHeader } from "components/column-header";
import NavBar from "components/nav-bar";
import SessionContext from "context/session";
import "styles/layout.css";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
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
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const columns: ColumnDef[] = [
  { id: "name", label: "Lesson", minWidth: 200, align: "left", sortable: true },
  {
    id: "updatedAt",
    label: "Date",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "createdByName",
    label: "Created By",
    minWidth: 200,
    align: "left",
    sortable: true,
  },
  {
    id: "actions",
    label: "",
    minWidth: 0,
    align: "left",
    sortable: false,
  },
];

const TableFooter = (props: {
  classes: { appBar: string; fab: string };
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const { classes, hasNext, hasPrev, onNext, onPrev } = props;
  const context = useContext(SessionContext);

  function onCreate() {
    navigate("/lessons/edit");
  }

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        <IconButton id="prev-page" disabled={!hasPrev} onClick={onPrev}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton id="next-page" disabled={!hasNext} onClick={onNext}>
          <KeyboardArrowRightIcon />
        </IconButton>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                id="toggle-creator"
                checked={context.onlyCreator}
                onChange={context.toggleCreator}
                aria-label="switch"
              />
            }
            label={"Only Mine"}
          />
        </FormGroup>
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

const LessonItem = (props: {
  row: Edge<Lesson>;
  i: number;
  onDeleted: (id: string) => void;
}) => {
  const { row, i, onDeleted } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const deleteMenuOpen = Boolean(anchorEl);
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);

  function launchLesson(id: string) {
    const host = process.env.TUTOR_ENDPOINT || window.location.origin;
    const guest = `&guest=${context.user?.name}`;
    const path = `${host}/tutor?lesson=${id}&admin=true${guest}`;
    window.location.href = path;
  }

  function handleCopy(): void {
    navigate(`/lessons/edit?copyLesson=${row.node.lessonId}`);
  }

  function handleGrade(): void {
    navigate(`/sessions?lessonId=${row.node.lessonId}`);
  }

  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function confirmDelete() {
    toast("Deleting...");
    try {
      await deleteLesson(row.node.lessonId, cookies.accessToken);
      onDeleted(row.node.lessonId);
      setAnchorEl(null);
    } catch (err) {
      toast("Failed to delete lesson.");
    }
  }

  return (
    <TableRow id={`lesson-${i}`} hover role="checkbox" tabIndex={-1}>
      <TableCell id="name" align="left">
        {userCanEdit(row.node, context.user) ? (
          <Link to={`/lessons/edit?lessonId=${row.node.lessonId}`}>
            {row.node.name || "No Lesson Name"}
          </Link>
        ) : (
          row.node.name || "No Lesson Name"
        )}
      </TableCell>
      <TableCell id="date" align="left">
        {row.node.updatedAt ? row.node.updatedAt.toLocaleString() : ""}
      </TableCell>
      <TableCell id="creator" align="left">
        {row.node.createdByName}
      </TableCell>
      <TableCell id="actions" align="right">
        <Tooltip title="Grade" arrow>
          <IconButton
            id="grade-button"
            onClick={() => {
              handleGrade();
            }}
            disabled={!userCanEdit(row.node, context.user)}
          >
            <AssessmentIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Launch" arrow>
          <IconButton
            id="launch-button"
            onClick={() => launchLesson(row.node.lessonId)}
          >
            <LaunchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Duplicate" arrow>
          <IconButton id="copy-button" onClick={handleCopy}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" arrow>
          <IconButton
            id="delete-button"
            onClick={handleDelete}
            disabled={!userCanEdit(row.node, context.user)}
          >
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        </Tooltip>
      </TableCell>
      <Menu
        id="delete-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={deleteMenuOpen}
        onClose={handleClose}
      >
        <MenuItem id="confirm-delete" onClick={confirmDelete}>
          Confirm
        </MenuItem>
        <MenuItem id="cancel-delete" onClick={handleClose}>
          Cancel
        </MenuItem>
      </Menu>
    </TableRow>
  );
};

const LessonsTable = () => {
  const classes = useStyles();
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const [lessons, setLessons] = React.useState<Connection<Lesson>>();
  const [cursor, setCursor] = React.useState("");
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [deleted, setDeleted] = React.useState("");
  const rowsPerPage = 10;

  const onDeleted = (id: string): void => {
    setDeleted(id);
  };

  const onSort = (id: string): void => {
    if (sortBy === id) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(id);
    }
    setCursor("");
  };

  React.useEffect(() => {
    setCursor("");
  }, [context.onlyCreator]);

  React.useEffect(() => {
    let mounted = true;
    fetchLessons(
      context.onlyCreator ? { createdByName: `${context.user?.name}` } : {},
      rowsPerPage,
      cursor,
      sortBy,
      sortAsc,
      cookies.accessToken
    )
      .then((lessons) => {
        if (mounted && lessons) {
          setLessons(lessons);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [context.onlyCreator, deleted, rowsPerPage, cursor, sortBy, sortAsc]);

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
        <TableContainer
          style={{ height: "calc(100vh - 128px)" }}
          data-cy="lessons-table"
        >
          <Table stickyHeader={true} aria-label="sticky table">
            <ColumnHeader
              columns={columns}
              sortBy={sortBy}
              sortAsc={sortAsc}
              onSort={onSort}
            />
            <TableBody id="lessons">
              {lessons.edges.map((row, i) => (
                <LessonItem
                  key={`lesson-${i}`}
                  row={row}
                  i={i}
                  onDeleted={onDeleted}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TableFooter
        classes={classes}
        hasPrev={lessons.pageInfo.hasPreviousPage}
        hasNext={lessons.pageInfo.hasNextPage}
        onPrev={() => {
          setCursor("prev__" + lessons.pageInfo.startCursor);
        }}
        onNext={() => {
          setCursor("next__" + lessons.pageInfo.endCursor);
        }}
      />
      <ToastContainer />
    </div>
  );
};

const LessonsPage = (): JSX.Element => {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const styles = useStyles();

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view lessons.</div>;
  }
  if (!context.user) {
    return <CircularProgress className={styles.progress} />;
  }

  return (
    <div>
      <NavBar title="Lessons" />
      <LessonsTable />
    </div>
  );
};

export default LessonsPage;
