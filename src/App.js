import React from "react";
import { makeStyles } from "@material-ui/core/styles";
//
export default () => {
  const classes = useStyles();
  //
  return (
    <iframe
      title="window"
      src="https://bytez.com/home"
      className={classes.iframe}
    />
  );
};
const useStyles = makeStyles(() => ({
  iframe: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
    border: "none",
    margin: 0,
    padding: 0,
    zIndex: 999999
  }
}));
