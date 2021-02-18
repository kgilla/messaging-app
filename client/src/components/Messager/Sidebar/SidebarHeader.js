import React, { useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { image3 } from "images/conversationImages";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "4px 0",
    padding: "32px 16px",
    border: "none",
    background: "none",
  },

  main: {
    display: "flex",
    alignItems: "center",
  },

  circle: {
    height: "50px",
    width: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "16px",
    borderRadius: "50%",
    background: "#ccc",
  },

  username: {
    fontSize: "16px",
    fontWeight: 600,
  },

  userState: {
    fontSize: "14px",
    fontWeight: 600,
  },

  moreButton: {
    color: "#aaa",
  },
}));

export default function SidebarHeader() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.logout();
    history.push("/");
  };

  return (
    <Paper className={classes.root} elevation={1} variant="outlined">
      <div className={classes.main}>
        <img src={image3} className={classes.circle} />

        <Typography variant="h6" className={classes.username}>
          {auth.user.username}
        </Typography>
      </div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Paper>
  );
}
