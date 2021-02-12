import React from "react";
import {
  Grid,
  Typography,
  TextField,
  Hidden,
  Paper,
  Button,
  makeStyles,
} from "@material-ui/core";

import Sidebar from "./Sidebar";
import Conversation from "./Conversation";

const useStyles = makeStyles((theme) => ({
  root: {},

  test: {
    height: "100vh",
  },

  messengerMain: {},

  header: {
    height: "15vh",
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
    background: "#fff",
  },
}));

export default function MessengerMain({ toggleDrawer }) {
  const classes = useStyles();

  return (
    <>
      <Grid item className={classes.header}>
        <Paper
          square
          variant="outlined"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            border: "none",
            boxShadow: "0 2px 4px rgb(0 0 0 / 5%), 0 8px 16px rgb(0 0 0 / 5%)",
          }}
        >
          <Hidden mdUp>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleDrawer}
              style={{ marginRight: "16px" }}
            >
              Menu
            </Button>
          </Hidden>

          <Typography variant="h6" style={{ fontWeight: 600 }}>
            Santiago
          </Typography>
        </Paper>
      </Grid>
      <Grid item className={classes.main}>
        Messages
      </Grid>
      <Grid item className={classes.footer}>
        <TextField
          variant="outlined"
          placeholder="Type something..."
          fullWidth
          style={{ background: "#eee", border: "none" }}
        />{" "}
      </Grid>
    </>
  );
}
