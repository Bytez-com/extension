import React, { useCallback, useState } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import {
  // Menu,
  MenuItem,
  Tooltip,
  Switch,
  FormControlLabel
} from "@material-ui/core";
//
export default () => {
  // const classes = useStyles();

  const [state, setState] = useState({ enabled: true });

  // const toggleMenu = useCallback(event => {
  //   setState(state => ({
  //     ...state,

  //     anchor: !state.anchor ? event.target : undefined,

  //     imageURL: "",

  //     takeScreenshot: false,

  //     screenshot: undefined
  //   }));
  // }, []);

  const toggleSwitch = useCallback(() => {
    setState(state => ({ ...state, enabled: !state.enabled }));
  }, []);

  //

  return (
    <Tooltip
      title="Enable the smart reader to open ML papers"
      placement="right-end"
    >
      <MenuItem>
        <FormControlLabel
          control={
            <Switch
              onChange={toggleSwitch}
              checked={state.enabled}
              color="primary"
            />
          }
          label="Open Arxiv ML Papers"
        />
      </MenuItem>
    </Tooltip>
  );
};

// const useStyles = makeStyles(() => ({
// iframe: {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   bottom: 0,
//   right: 0,
//   width: "100%",
//   height: "100%",
//   border: "none",
//   margin: 0,
//   padding: 0,
//   zIndex: 999999
// }
// }));
