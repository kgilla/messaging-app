import React from "react";
import {
  Grid,
  Typography,
  TextField,
  Hidden,
  Paper,
  makeStyles,
} from "@material-ui/core";

import Conversation from "./Conversation";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0 16px",
    boxSizing: "border-box",
  },

  test: {
    height: "100vh",
  },

  messengerMain: {},

  header: {
    height: "15vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  main: {
    height: "70vh",
    width: "100%",
    padding: "8px",
    overflowY: "scroll",
  },

  footer: {
    height: "15vh",
    width: "100%",
    padding: "8px",
  },
}));

export default function Sidebar() {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <Grid item className={classes.header}>
        <Conversation header />
      </Grid>
      <Grid container style={{ height: "85vh", width: "100%" }}>
        <Grid item className={classes.footer}>
          <Typography
            variant="h6"
            style={{ margin: "0", padding: "0", fontWeight: 600 }}
          >
            Chats
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search"
            fullWidth
            style={{ background: "#ddd", border: "none", outline: "none" }}
          />
        </Grid>
        <Grid item className={classes.main}>
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
        </Grid>
      </Grid>
    </Grid>
  );
}
