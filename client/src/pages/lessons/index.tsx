/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { withPrefix } from "gatsby";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import LaunchIcon from "@material-ui/icons/Launch";
import { Link, navigate } from "@reach/router";
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
    marginLeft: "50%",
  },
}));

const columns: ColumnDef[] = [
  { id: "name", label: "Lesson", minWidth: 200, align: "left", sortable: true },
  {
    id: "launch",
    label: "Launch",
    minWidth: 0,
    align: "left",
    sortable: false,
  },
  {
    id: "grade",
    label: "Grade",
    minWidth: 0,
    align: "center",
    sortable: false,
  },
  {
    id: "updatedAt",
    label: "Date",
    minWidth: 170,
    align: "center",
    sortable: true,
  },
  {
    id: "createdByName",
    label: "Created By",
    minWidth: 200,
    align: "center",
    sortable: true,
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 0,
    align: "center",
    sortable: false,
  },
  {
    id: "copy",
    label: "Copy",
    minWidth: 0,
    align: "center",
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
    navigate(withPrefix("/lessons/edit"));
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
  location: Location;
  row: Edge<Lesson>;
  i: number;
  onDeleted: (id: string) => void;
}) => {
  const { location, row, i, onDeleted } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const deleteMenuOpen = Boolean(anchorEl);
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);

  function launchLesson(id: string) {
    const host = process.env.TUTOR_ENDPOINT || location.origin;
    const guest = `&guest=${context.user?.name}`;
    const path = `${host}/tutor?lesson=${id}&admin=true${guest}`;
    window.location.href = path;
  }

  function handleCopy(): void {
    navigate(withPrefix(`/lessons/edit?copyLesson=${row.node.lessonId}`));
  }

  function handleGrade(): void {
    navigate(withPrefix(`/sessions?lessonId=${row.node.lessonId}`));
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
          <Link to={withPrefix(`/lessons/edit?lessonId=${row.node.lessonId}`)}>
            {row.node.name || "No Lesson Name"}
          </Link>
        ) : (
          row.node.name || "No Lesson Name"
        )}
      </TableCell>
      <TableCell id="launch" align="left">
        <IconButton onClick={() => launchLesson(row.node.lessonId)}>
          <LaunchIcon />
        </IconButton>
      </TableCell>
      <TableCell id="grade">
        <IconButton
          onClick={() => {
            handleGrade();
          }}
          disabled={!userCanEdit(row.node, context.user)}
        >
          <AssignmentIcon />
        </IconButton>
      </TableCell>
      <TableCell id="date" align="center">
        {row.node.updatedAt ? row.node.updatedAt.toLocaleString() : ""}
      </TableCell>
      <TableCell id="creator" align="center">
        {row.node.createdByName}
      </TableCell>
      <TableCell id="delete" align="center">
        <IconButton
          onClick={handleDelete}
          disabled={!userCanEdit(row.node, context.user)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
      <TableCell id="copy" align="center">
        <IconButton onClick={handleCopy}>
          <FileCopyIcon />
        </IconButton>
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

const LessonsTable = (props: { location: Location }) => {
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
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
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
                  location={props.location}
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

const LessonsPage = (props: {
  location: Location;
  path: string;
  children?: React.ReactNode;
}): JSX.Element => {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view lessons.</div>;
  }
  if (!context.user) {
    return <CircularProgress />;
  }

  return (
    <div>
      <NavBar title="Lessons" />
      <LessonsTable location={props.location} />
      {props.children}
    </div>
  );
};

export default LessonsPage;
