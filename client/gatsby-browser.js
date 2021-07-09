import React from "react";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { CookiesProvider } from "react-cookie";
import { SessionProvider } from "./src/context/session";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }) => (
  <MuiThemeProvider theme={theme}>
    <CookiesProvider>
      <SessionProvider>{element}</SessionProvider>
    </CookiesProvider>
  </MuiThemeProvider>
);
