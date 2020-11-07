import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
//
import App from "./App";
import Theme from "./Components/Theme";
//
ReactDOM.render(
  <StrictMode>
    <CssBaseline />
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById("root")
);
