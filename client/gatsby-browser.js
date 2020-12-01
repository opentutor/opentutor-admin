import React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { CookiesProvider } from "react-cookie";
import { SessionProvider } from "./src/context/session";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

export const wrapRootElement = ({ element }) => (
  <MuiThemeProvider theme={theme}>
    <CookiesProvider>
      <SessionProvider>{element}</SessionProvider>
    </CookiesProvider>
  </MuiThemeProvider>
);
