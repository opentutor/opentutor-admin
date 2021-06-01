/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Link, navigate } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import {
  AppBar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssessmentIcon from "@material-ui/icons/Assessment";
import GroupIcon from "@material-ui/icons/Group";
import SettingsIcon from "@material-ui/icons/Settings";
import { userIsElevated } from "api";
import SessionContext from "context/session";
import { UserRole } from "types";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textAlign: "left",
    flexGrow: 1,
  },
  login: {
    position: "absolute",
    right: theme.spacing(1),
  },
}));

function NavMenu(): JSX.Element {
  const context = useContext(SessionContext);
  return (
    <List dense>
      <ListItem button component={Link} to={"/lessons"}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Lessons" />
      </ListItem>
      <ListItem button component={Link} to={"/sessions"}>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Grading" />
      </ListItem>
      {userIsElevated(context.user) ? (
        <ListItem button component={Link} to={"/users"}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
      ) : undefined}
      {context.user && context.user.userRole === UserRole.ADMIN ? (
        <ListItem button component={Link} to={"/settings"}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      ) : undefined}
    </List>
  );
}

function LoginOption(props: { classes: { login: string } }): JSX.Element {
  const { classes } = props;
  const removeCookie = useCookies(["accessToken"])[2];
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const context = useContext(SessionContext);

  function handleMenu(e: React.MouseEvent<HTMLElement>): void {
    setAnchorEl(e.currentTarget);
  }

  function handleClose(): void {
    setAnchorEl(null);
  }

  function onLogout(): void {
    removeCookie("accessToken", { path: "/" });
    navigate("/");
  }

  return (
    <div id="login-option" className={classes.login}>
      <Button
        id="login-button"
        onClick={handleMenu}
        startIcon={<AccountCircle />}
        style={{ color: "white" }}
      >
        {context.user?.name}
      </Button>
      <Menu
        id="login-menu"
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
        open={open}
        onClose={handleClose}
      >
        <MenuItem id="logout" onClick={onLogout}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export function NavBar(props: {
  title: string;
  disableMenu?: boolean;
}): JSX.Element {
  const classes = useStyles();
  const context = useContext(SessionContext);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  function toggleDrawer(tf: boolean): void {
    setIsDrawerOpen(tf);
  }

  return (
    <div id="nav-bar" className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          {context.user ? (
            <IconButton
              id={props.disableMenu ? "back-button" : "menu-button"}
              edge="start"
              color="inherit"
              aria-label="menu"
              className={classes.menuButton}
              onClick={() => {
                if (props.disableMenu) {
                  window.history.back();
                } else {
                  toggleDrawer(true);
                }
              }}
            >
              {props.disableMenu ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          ) : undefined}
          <Typography id="title" variant="h6" className={classes.title}>
            {props.title}
          </Typography>
          {context.user ? <LoginOption classes={classes} /> : undefined}
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        id="drawer"
        anchor="left"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <Toolbar />
        <NavMenu />
      </SwipeableDrawer>
      <div className={classes.toolbar} /> {/* create space below app bar */}
    </div>
  );
}

export default NavBar;
