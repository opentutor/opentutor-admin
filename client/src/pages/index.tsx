import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import "styles/layout.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const IndexPage: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Typography>Hello World</Typography>
    </MuiThemeProvider>
  );
};

export default IndexPage;
