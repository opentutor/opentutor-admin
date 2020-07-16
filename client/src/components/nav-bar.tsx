import { withPrefix } from "gatsby";
import React from "react";
import {
  AppBar,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/List";
import { Link } from "@reach/router";

export const NavBar = ({ title }: { title: string }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = (tf: boolean) => {
    setIsDrawerOpen(tf);
  };

  const navigationMenu = () => {
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

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <Toolbar />
        {navigationMenu()}
      </SwipeableDrawer>
    </div>
  );
};

export default NavBar;
