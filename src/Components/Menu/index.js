import React, { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Menu,
  MenuItem,
  Tooltip,
  Switch,
  FormControlLabel
} from "@material-ui/core";

//
export default () => {
  const classes = useStyles();
  const [state, setState] = useState({ enabled: true });
  const toggleMenu = useCallback(event => {
    setState(state => ({
      ...state,
      anchor: !state.anchor ? event.target : undefined,
      imageURL: "",
      takeScreenshot: false,
      screenshot: undefined
    }));
  }, []);
  const toggleSwitch = useCallback(() => {
    setState(state => ({ ...state, enabled: !state.enabled }));
  }, []);
  //
  return (
    <Tooltip title="Send feedback" placement="bottom">
      <Menu
        className={classes.menu}
        anchorEl={state.anchor}
        open={!!state.anchor}
        onClose={toggleMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={Switch}>
          <FormControlLabel
            control={
              <Switch
                checked={state.enabled}
                onChange={toggleSwitch}
                name="checkedB"
                color="primary"
              />
            }
            label="Open Arxiv ML Papers"
          />
        </MenuItem>
      </Menu>
    </Tooltip>
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
