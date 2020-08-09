import { withPrefix, navigate } from "gatsby";
import React from "react";
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
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/List";
import { Link } from "@reach/router";

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
}));

const NavMenu = () => {
  return (
    <List dense>
      <ListItem button component={Link} to={withPrefix("/")}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
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
    </List>
  );
};

const LoginOption = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    removeCookie("user", { path: "/" });
    navigate(withPrefix("/"));
  };

  if (cookies.user) {
    return (
      <div>
        <Button
          onClick={handleMenu}
          startIcon={<AccountCircle />}
          style={{ color: "white" }}
        >
          {cookies.user}
        </Button>
        <Menu
          id="menu-appbar"
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
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }

  return (
    <Button color="inherit" component={Link} to={withPrefix("/")}>
      Login
    </Button>
  );
};

export const NavBar = (props: { title: string }) => {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = (tf: boolean) => {
    setIsDrawerOpen(tf);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.menuButton}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
          <LoginOption />
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
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
