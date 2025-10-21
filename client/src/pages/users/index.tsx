/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import {
  AppBar,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Toolbar,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import { fetchUsers, updateUserPermissions, userIsElevated } from "api";
import { Connection, Edge, User, UserRole } from "types";
import NavBar from "components/nav-bar";
import { ColumnDef, ColumnHeader } from "components/column-header";
import SessionContext from "context/session";
import "styles/layout.css";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndicator from "components/loading-indicator";

const useStyles = makeStyles({ name: "UsersPage" })((theme: Theme) => ({
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
  paging: {
    position: "absolute",
    right: theme.spacing(1),
  },
  dropdown: {
    width: 170,
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
    id: "userRole",
    label: "Role",
    minWidth: 170,
    align: "left",
    sortable: true,
  },
];

function TableFooter(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classes: any;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}): JSX.Element {
  const { classes, hasNext, hasPrev, onNext, onPrev } = props;
  return (
    <AppBar position="sticky" color="default" className={classes.appBar}>
      <Toolbar>
        <div className={classes.paging}>
          <IconButton data-cy="prev-page" disabled={!hasPrev} onClick={onPrev}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton data-cy="next-page" disabled={!hasNext} onClick={onNext}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

function UserItem(props: {
  row: Edge<User>;
  i: number;
  onUpdated: (error?: string) => void;
}): JSX.Element {
  const { row, i } = props;
  const [cookies] = useCookies(["accessToken"]);
  const context = useContext(SessionContext);
  const { classes: styles } = useStyles();

  async function handleRoleChange(user: string, permission: string) {
    try {
      await updateUserPermissions(user, permission, cookies.accessToken);
      props.onUpdated();
    } catch (err) {
      let message;
      if (err instanceof Error) {
        message = err.message;
        props.onUpdated(message);
      } else {
        message = String(err);
        props.onUpdated(message);
      }
    }
  }

  return (
    <TableRow data-cy={`user-${i}`} hover role="checkbox" tabIndex={-1}>
      <TableCell data-cy="name" align="left">
        {row.node.name}
      </TableCell>
      <TableCell data-cy="email" align="left">
        {row.node.email}
      </TableCell>
      <TableCell data-cy="role" align="left">
        <Select
          data-cy="select-role"
          value={row.node.userRole}
          onChange={(event: SelectChangeEvent<string>) => {
            handleRoleChange(row.node.id, event.target.value as string);
          }}
          className={styles.dropdown}
        >
          <MenuItem data-cy={UserRole.AUTHOR} value={UserRole.AUTHOR}>
            Author
          </MenuItem>
          <MenuItem
            data-cy={UserRole.CONTENT_MANAGER}
            value={UserRole.CONTENT_MANAGER}
          >
            Content Manager
          </MenuItem>
          <MenuItem
            data-cy={UserRole.ADMIN}
            value={UserRole.ADMIN}
            disabled={context.user?.userRole !== UserRole.ADMIN}
          >
            Admin
          </MenuItem>
        </Select>
      </TableCell>
    </TableRow>
  );
}

function UsersTable(): JSX.Element {
  const { classes } = useStyles();
  const [cookies] = useCookies(["accessToken"]);
  const [users, setUsers] = React.useState<Connection<User>>();
  const [cursor, setCursor] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name");
  const [sortAsc, setSortAsc] = React.useState(false);
  const rowsPerPage = 20;

  React.useEffect(() => {
    updateUsers();
  }, [rowsPerPage, cursor, sortBy, sortAsc]);

  async function updateUsers() {
    try {
      setUsers(
        await fetchUsers(
          {},
          rowsPerPage,
          cursor,
          sortBy,
          sortAsc,
          cookies.accessToken
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  function onUserUpdated(error?: string) {
    if (error) {
      toast(error);
    } else {
      updateUsers();
    }
  }

  function onSort(id: string): void {
    if (sortBy === id) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(id);
    }
    setCursor("");
  }

  if (!users) {
    return (
      <div className={classes.root}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <TableContainer style={{ height: "calc(100vh - 128px)" }}>
          <Table stickyHeader aria-label="sticky table">
            <ColumnHeader
              columns={columns}
              sortBy={sortBy}
              sortAsc={sortAsc}
              onSort={onSort}
            />
            <TableBody data-cy="users">
              {users.edges.map((row, i) => (
                <UserItem
                  key={row.node.id}
                  row={row}
                  i={i}
                  onUpdated={onUserUpdated}
                />
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
      <ToastContainer />
    </div>
  );
}

function UsersPage(): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);

  // Only check cookies after client hydration to avoid SSR mismatch
  if (context.isClient && !cookies.accessToken) {
    return <div>Please login to view users.</div>;
  }
  if (!context.user) {
    return <LoadingIndicator />;
  }
  if (!userIsElevated(context.user)) {
    return (
      <div>You must be an admin or content manager to view this page.</div>
    );
  }

  return (
    <div>
      <NavBar title="Manage Users" />
      <UsersTable />
    </div>
  );
}

export default UsersPage;
