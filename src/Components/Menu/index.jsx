import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Stars as SavesIcon } from "@material-ui/icons";
import OpenBytezIcon from "mdi-react/RocketLaunchOutlineIcon";
//
export default () => {
  const classes = useStyles();
  //
  return (
    <List className={classes.root}>
      <ListItem
        button
        component="a"
        target="_none"
        href="https://bytez.com/read/arxiv/1706.03762/tour"
      >
        <ListItemIcon>
          <OpenBytezIcon />
        </ListItemIcon>
        <ListItemText primary="Open tutorial" />
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
