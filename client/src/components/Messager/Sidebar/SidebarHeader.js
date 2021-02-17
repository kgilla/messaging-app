import React from "react";
import { Typography, Paper, Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { image7 } from "images/conversationImages";

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
}));

export default function SidebarHeader() {
  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();

  const handleClick = () => {
    auth.logout();
    history.push("/");
  };

  return (
    <Paper className={classes.root} elevation={1} variant="outlined">
      <div className={classes.main}>
        <img src={image7} className={classes.circle} />

        <Typography variant="h6" className={classes.username}>
          {auth.user.username}
        </Typography>
      </div>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Logout
      </Button>
    </Paper>
  );
}
