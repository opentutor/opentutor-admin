import { createTheme, StyledEngineProvider, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import React from "react";
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
export const onServiceWorkerUpdateReady = () => {
  console.log("Test");
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  );
  if (answer === true) {
    window.location.reload();
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }) => (
  <StyledEngineProvider injectFirst>
    <MuiThemeProvider theme={theme}>
      <CookiesProvider>
        <SessionProvider>{element}</SessionProvider>
      </CookiesProvider>
    </MuiThemeProvider>
  </StyledEngineProvider>
);
