import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
//
import App from "./App";
import Theme from "./Components/Theme";
//
ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
