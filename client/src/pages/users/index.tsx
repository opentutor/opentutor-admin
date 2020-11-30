/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { withPrefix } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { navigate } from "@reach/router";
import {
  AppBar,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { fetchUsers, updateUserPermissions } from "api";
import { Connection, Edge, User } from "types";
import NavBar from "components/nav-bar";
import { ColumnDef, ColumnHeader } from "components/column-header";
import ToggleContext from "context/toggle";
import withLocation from "wrap-with-location";
import "styles/layout.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "column",
  },
  container: {
    flexGrow: 1,
  },
  appBar: {
    height: "10%",
    top: "auto",
    bottom: 0,
  },
  progress: {
    marginLeft: "50%",
  },
  paging: {
    position: "absolute",
    right: theme.spacing(1),
  },
}));

const columns: ColumnDef[] = [
  {
    id: "name",
    label: "Name",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
  {
    id: "role",
    label: "Role",
    minWidth: 170,
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

  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        <div className={classes.paging}>
          <IconButton id="prev-page" disabled={!hasPrev} onClick={onPrev}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton id="next-page" disabled={!hasNext} onClick={onNext}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const UserItem = (props: {
  row: Edge<User>;
  i: number;
  onUpdated: () => void;
}) => {
  const { row, i } = props;
  const [cookies] = useCookies(["accessToken"]);
  const context = useContext(ToggleContext);

  function handleRoleChange(user: string, permission: string): void {
    updateUserPermissions(user, permission, cookies.accessToken)
      .then((user: User) => {
        if (user) {
          props.onUpdated();
        }
      })
      .catch((err: string) => console.error(err));
  }

  return (
    <TableRow id={`user-${i}`} hover role="checkbox" tabIndex={-1}>
      <TableCell id="name" align="left">
        {row.node.name}
      </TableCell>
      <TableCell id="email" align="left">
        {row.node.email}
      </TableCell>
      <TableCell id="role" align="center">
        <Select
          id="select-role"
          value={
            row.node.isAdmin
              ? "admin"
              : row.node.isContentManager
              ? "contentManager"
              : "author"
          }
          onChange={(
            event: React.ChangeEvent<{ value: unknown; name?: unknown }>
          ) => {
            handleRoleChange(row.node.id, event.target.value as string);
          }}
        >
          <MenuItem id="author" value="author">
            Author
          </MenuItem>
          <MenuItem id="contentManager" value="contentManager">
            Content Manager
          </MenuItem>
          <MenuItem id="admin" value="admin" disabled={!context.user?.isAdmin}>
            Admin
          </MenuItem>
        </Select>
      </TableCell>
    </TableRow>
  );
};

const UsersTable = (props: { path: string }) => {
  const classes = useStyles();
  const [cookies] = useCookies(["accessToken"]);
  const [users, setUsers] = React.useState<Connection<User>>();
  const [cursor, setCursor] = React.useState("");
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortAsc, setSortAsc] = React.useState(false);
  const rowsPerPage = 50;

  function onSort(id: string): void {
    if (sortBy === id) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(id);
    }
    setCursor("");
  }

  function fetch(): void {
    const filter: any = {};
    fetchUsers(
      filter,
      rowsPerPage,
      cursor,
      sortBy,
      sortAsc,
      cookies.accessToken
    )
      .then((users) => {
        if (users) {
          setUsers(users);
        }
      })
      .catch((err) => console.error(err));
  }

  React.useEffect(() => {
    fetch();
  }, [rowsPerPage, cursor, sortBy, sortAsc]);

  if (!users) {
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
            <TableBody id="users">
              {users.edges.map((row, i) => (
                <UserItem key={row.node.id} row={row} i={i} onUpdated={fetch} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TableFooter
        classes={classes}
        hasNext={users.pageInfo.hasNextPage}
        hasPrev={users.pageInfo.hasPreviousPage}
        onNext={() => {
          setCursor("next__" + users.pageInfo.endCursor);
        }}
        onPrev={() => {
          setCursor("prev__" + users.pageInfo.startCursor);
        }}
      />
    </div>
  );
};

const UsersPage = (props: { path: string }) => {
  const context = useContext(ToggleContext);
  const [cookies] = useCookies(["accessToken"]);
  if (typeof window !== "undefined" && !cookies.accessToken) {
    navigate(withPrefix(`/`));
    return <div></div>;
  }
  if (!context.user) {
    return <CircularProgress />;
  }
  if (!context.user.isAdmin && !context.user.isContentManager) {
    return <div>Only Admins and Content Managers can view this page</div>;
  }

  return (
    <div>
      <NavBar title="Users" />
      <UsersTable path={props.path} />
    </div>
  );
};

export default UsersPage;
