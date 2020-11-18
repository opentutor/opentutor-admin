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
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import LaunchIcon from "@material-ui/icons/Launch";
import { Link, navigate } from "@reach/router";
import { fetchLessons, deleteLesson } from "api";
import { Connection, Edge, Lesson } from "types";
import { ColumnDef, ColumnHeader } from "components/column-header";
import NavBar from "components/nav-bar";
import ToggleContext from "context/toggle";
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
];

const TableFooter = (props: {
  classes: any;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const { classes, hasNext, hasPrev, onNext, onPrev } = props;
  const context = useContext(ToggleContext);

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
  location: any;
  row: Edge<Lesson>;
  i: number;
  onDeleted: (id: string) => void;
}) => {
  const { location, row, i, onDeleted } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const deleteMenuOpen = Boolean(anchorEl);
  const context = useContext(ToggleContext);

  function canEdit() {
    if (!row.node.userPermissions) {
      return false;
    }
    return row.node.userPermissions.edit;
  }

  function launchLesson(id: string) {
    const host = process.env.TUTOR_ENDPOINT || location.origin;
    const guest = `&guest=${context.user?.name}`;
    const path = `${host}/tutor?lesson=${id}&admin=true${guest}`;
    window.location.href = path;
  }

  function handleGrade(): void {
    navigate(withPrefix(`/sessions?lessonId=${row.node.lessonId}`));
  }

  const handleDelete = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const confirmDelete = () => {
    toast("Deleting...");
    deleteLesson(row.node.lessonId)
      .then(() => {
        onDeleted(row.node.lessonId);
        setAnchorEl(null);
      })
      .catch((err) => {
        toast("Failed to delete lesson.");
        console.error(err);
      });
  };

  return (
    <TableRow id={`lesson-${i}`} hover role="checkbox" tabIndex={-1}>
      <TableCell id="name" align="left">
        {canEdit() ? (
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
          disabled={!canEdit()}
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
        <IconButton onClick={handleDelete} disabled={!canEdit()}>
          <DeleteIcon />
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

const LessonsTable = (props: { location: any }) => {
  const classes = useStyles();
  const context = useContext(ToggleContext);
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
    const filter: any = {};
    if (context.onlyCreator) {
      filter["createdBy"] = `${context.user?.id}`;
    }
    let mounted = true;
    fetchLessons(filter, rowsPerPage, cursor, sortBy, sortAsc)
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

const LessonsPage = (props: { location: any; path: string; children: any }) => {
  const context = useContext(ToggleContext);
  const [cookies] = useCookies(["accessToken"]);
  if (typeof window !== "undefined" && !cookies.accessToken) {
    navigate("/");
    return <div></div>;
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
