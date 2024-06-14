/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Lesson, TrainState, TrainStatus } from "types";
import { months } from "constants/lessonConstants";
import { styled, CSSObject, Theme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { ButtonColor } from "constants/lessonConstants";
interface LessonUnderEdit {
  lesson?: Lesson;
  dirty?: boolean;
}

export const getTrainButtonColor = (trainStatus: TrainStatus): ButtonColor => {
  return trainStatus.state !== TrainState.SUCCESS &&
    trainStatus.state !== TrainState.FAILURE
    ? "secondary"
    : trainStatus.state === TrainState.FAILURE
    ? "error"
    : !(
        trainStatus.info &&
        trainStatus.info?.expectations &&
        Array.isArray(trainStatus.info?.expectations) &&
        trainStatus.info.expectations.length > 0
      )
    ? "error"
    : Math.min(...trainStatus.info?.expectations.map((x) => x.accuracy)) >= 0.6
    ? "success"
    : Math.min(...trainStatus.info?.expectations.map((x) => x.accuracy)) >= 0.4
    ? "warning"
    : "error";
};

export const getLastTrainedAtString = (
  lessonUnderEdit: LessonUnderEdit
): string => {
  let lastTrainedString = "Never";
  if (lessonUnderEdit.lesson?.lastTrainedAt) {
    const lastTrained = new Date(lessonUnderEdit.lesson?.lastTrainedAt);
    const isAM = lastTrained.getHours() < 12;
    let hours = lastTrained.getHours() % 12;
    if (hours == 0) {
      hours = 12;
    }
    lastTrainedString = `${
      months[lastTrained.getMonth()]
    } ${lastTrained.getDate()}, ${lastTrained.getUTCFullYear()}, at ${hours}:${lastTrained.getMinutes()} ${
      isAM ? "am" : "pm"
    }`; //January 12, 2022, at 3:45 pm
  }

  return lastTrainedString;
};

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
