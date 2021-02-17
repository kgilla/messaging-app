import React from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import { useAuth } from "hooks/useAuth";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  message: {
    display: "flex",
    flexDirection: "column",
    margin: "8px 0",
  },

  messageHeader: {
    marginBottom: "4px",
    fontSize: "12px",
    color: "#aaa",
  },

  myMessage: {
    borderRadius: "16px 16px 0 16px",
    padding: "8px",
    background: "#eee",
  },

  otherMessage: {
    borderRadius: "0 16px 16px 16px",
    padding: "8px",
    alignSelf: "flex-start",
    color: "#fff",
    background: theme.palette.primary.main,
  },
}));

export default function Message({ message }) {
  const classes = useStyles();
  const auth = useAuth();

  return auth.user._id === message.author._id ? (
    <div className={classes.message} style={{ alignSelf: "flex-end" }}>
      <header
        className={classes.messageHeader}
        style={{ alignSelf: "flex-end" }}
      >
        <span>{moment(message.dateCreated).startOf("hour").fromNow()}</span>
      </header>
      <main className={classes.myMessage}>{message.content}</main>
    </div>
  ) : (
    <div className={classes.message} style={{ alignSelf: "flex-start" }}>
      <header
        className={classes.messageHeader}
        style={{ alignSelf: "flex-start" }}
      >
        <span>{message.author.username}</span>
        <span>{moment(message.dateCreated).startOf("hour").fromNow()}</span>
      </header>
      <main className={classes.otherMessage}>{message.content}</main>
    </div>
  );
}
