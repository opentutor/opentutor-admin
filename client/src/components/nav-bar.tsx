/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { withPrefix, navigate } from "gatsby";
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
import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import { Link } from "@reach/router";
import ToggleContext from "context/toggle";

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

const NavMenu = () => {
  return (
    <List dense>
      <ListItem button component={Link} to={withPrefix("/lessons")}>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Lessons" />
      </ListItem>
      <ListItem button component={Link} to={withPrefix("/sessions")}>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Grading" />
      </ListItem>
      <ListItem button component={Link} to={withPrefix("/users")}>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
    </List>
  );
};

const LoginOption = (props: { classes: any }) => {
  const { classes } = props;
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const context = useContext(ToggleContext);

  const handleMenu = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    removeCookie("accessToken", { path: "/" });
    navigate(withPrefix(`/`));
  };

  if (context.user) {
    return (
      <div id="login-option" className={classes.login}>
        <Button
          id="login-button"
          onClick={handleMenu}
          startIcon={<AccountCircle />}
          style={{ color: "white" }}
        >
          {context.user.name}
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

  return (
    <div id="login-option" className={classes.login}>
      <Button id="login-button" color="inherit" component={Link} to={"/admin"}>
        Login
      </Button>
    </div>
  );
};

export const NavBar = (props: { title: string }) => {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = (tf: boolean) => {
    setIsDrawerOpen(tf);
  };

  return (
    <div id="nav-bar" className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            id="menu-button"
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.menuButton}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography id="title" variant="h6" className={classes.title}>
            {props.title}
          </Typography>
          <LoginOption classes={classes} />
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
};

export default NavBar;
