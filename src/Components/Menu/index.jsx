import React, { useCallback, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider
} from "@material-ui/core";
import {
  PowerSettingsNew as OnIcon,
  Stars as SavesIcon
} from "@material-ui/icons";
import OpenBytezIcon from "mdi-react/RocketLaunchOutlineIcon";
//
export default () => {
  const classes = useStyles();
  const [state, setState] = useState({ enabled: true });
  //
  const toggleSwitch = useCallback(() => {
    setState(state => {
      const enabled = !state.enabled;
      // save this value across browsers
      chrome.storage.sync.set({ settings_v1: { ...state, enabled } });
      // update the component state
      return { ...state, enabled };
    });
  }, []);
  //
  useEffect(() => {
    chrome.storage.sync.get("settings_v1", ({ settings_v1 }) => {
      if (settings_v1) {
        setState(settings_v1);
      }
    });
  }, []);
  //
  return (
    <List className={classes.root}>
      <ListItem
        button
        component="a"
        target="_none"
        href="https://bytez.com/app"
      >
        <ListItemIcon>
          <OpenBytezIcon />
        </ListItemIcon>
        <ListItemText primary="Launch Bytez" />
      </ListItem>
      <ListItem
        button
        component="a"
        target="_none"
        href="https://bytez.com/saves"
      >
        <ListItemIcon>
          <SavesIcon />
        </ListItemIcon>
        <ListItemText primary="View saved papers" />
      </ListItem>
      <Divider />
      <ListSubheader>SmartReader settings</ListSubheader>
      <ListItem button onClick={toggleSwitch}>
        <ListItemIcon>
          <OnIcon />
        </ListItemIcon>
        <ListItemText primary="Open - Arxiv ML papers" />
        <ListItemSecondaryAction>
          <Switch
            color="primary"
            edge="end"
            onChange={toggleSwitch}
            checked={state.enabled}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    minWidth: 360,
    backgroundColor: theme.palette.colors.surfaceGray
  }
}));
