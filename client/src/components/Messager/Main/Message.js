import React from "react";
import { makeStyles } from "@material-ui/core";
import { useAuth } from "hooks/useAuth";
import moment from "moment";
import { image1 } from "images/conversationImages";

const useStyles = makeStyles((theme) => ({
  message: {
    display: "flex",
    flexDirection: "column",
    margin: "12px 0",
  },

  messageHeader: {
    marginBottom: "4px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#bbb",
  },

  myMessage: {
    borderRadius: "12px 12px 0 12px",
    padding: "10px",
    background: "#eee",
    fontSize: "15px",
    fontWeight: 600,
    color: "#666",
  },

  otherMessage: {
    borderRadius: "0 12px 12px 12px",
    padding: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, #86B9FF)`,
  },

  leftMessage: {
    alignSelf: "flex-start",
    display: "flex",
  },

  smallCircle: theme.smallCircleImage,

  right: {
    alignSelf: "flex-end",
  },
}));

export default function Message({ message }) {
  const classes = useStyles();
  const auth = useAuth();

  return auth.user._id === message.author ||
    auth.user._id === message.author._id ? (
    <div className={`${classes.message} ${classes.right}`}>
      <header className={`${classes.messageHeader} ${classes.right}`}>
        <span>{moment(message.dateCreated).format("M-D, h:mm a")}</span>
      </header>
      <main className={classes.myMessage}>{message.content}</main>
    </div>
  ) : (
    <div className={classes.leftMessage}>
      <img
        src={image1}
        alt="message-recipient"
        className={classes.smallCircle}
      />
      <div className={classes.message}>
        <header className={classes.messageHeader}>
          <span>{message.author.username + " "}</span>
          <span>{moment(message.dateCreated).format("M-D, h:mm a")}</span>
        </header>
        <main className={classes.otherMessage}>{message.content}</main>
      </div>
    </div>
  );
}
