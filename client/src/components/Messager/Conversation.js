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
import { useHistory } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    margin: "4px 0",
    padding: "32px 16px",
    border: "none",
    background: "none",
  },

  circle: {
    height: "50px",
    width: "50px",
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

export default function Conversation({ header }) {
  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();

  const handleClick = () => {
    auth.logout();
    history.push("/");
  };
  return (
    <Paper className={classes.root} elevation={1} variant="outlined">
      <div className={classes.circle}></div>
      <div className={classes.main}>
        <Typography variant="h6" className={classes.username}>
          {header ? auth.user.username : "Username"}
        </Typography>
        {!header ? (
          <Typography variant="p" className={classes.userState}>
            hey ther spud!
          </Typography>
        ) : null}
      </div>
      {header ? <Button onClick={handleClick}>Logout</Button> : null}
    </Paper>
  );
}
