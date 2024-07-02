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

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  export interface Palette {
    primary: Palette["primary"];
    secondary: Palette["primary"];
    error: Palette["primary"];
    warning: Palette["primary"];
    success: Palette["primary"];
  }

  export interface PaletteOptions {
    primary?: PaletteOptions["primary"];
    secondary?: PaletteOptions["primary"];
    error?: PaletteOptions["primary"];
    warning?: PaletteOptions["primary"];
    success?: PaletteOptions["primary"];
  }
}

export const buttonTheme = createTheme({
  palette: {
    primary: {
      main: "#0C60AD",
    },
    secondary: {
      main: "#000000",
    },
    warning: {
      main: "#FFFF00",
      contrastText: "#000000",
    },
    success: {
      main: "#008000",
    },
    error: {
      main: "#FF0000",
    },
  },
});
