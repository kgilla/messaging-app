import React from "react";
import { Grid, Avatar, makeStyles } from "@material-ui/core";
import { useAuth } from "hooks/useAuth";
import moment from "moment";
import {
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
} from "images/conversationImages";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  leftMessage: {
    display: "flex",
    alignSelf: "flex-start",
  },

  rightMessage: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },

  message: {
    display: "flex",
    flexDirection: "column",
    margin: "12px 0",
  },

  smallCircle: theme.smallCircleImage,

  messageHeader: {
    marginBottom: "4px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#bbb",
  },

  textRight: {
    textAlign: "right",
  },

  messageBubble: {
    width: "fit-content",
    padding: "10px",
    fontSize: "15px",
    fontWeight: 600,
  },

  myMessage: {
    borderRadius: "12px 12px 0 12px",
    background: "#eee",
    color: "#666",
  },

  otherMessage: {
    borderRadius: "0 12px 12px 12px",
    color: "#fff",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, #86B9FF)`,
  },
}));

export default function Message({ message, image }) {
  const classes = useStyles();
  const auth = useAuth();

  const check = () => {
    return auth.user._id === message.author._id;
  };

  const getImage = () => {
    const images = [image1, image2, image3, image4, image5, image6, image7];
    return images[image];
  };

  return (
    <Grid item className={check() ? classes.rightMessage : classes.leftMessage}>
      {!check() && (
        <Avatar
          src={getImage()}
          alt={message.author.username}
          className={classes.smallCircle}
        />
      )}
      <div
        className={clsx(classes.message, {
          [classes.rightMessage]: check(),
        })}
      >
        <header className={classes.messageHeader}>
          {!check() && <span>{message.author.username + " "}</span>}
          <span>{moment(message.dateCreated).format("M-D, h:mm a")}</span>
        </header>
        <main
          className={clsx(
            [classes.messageBubble],
            check() ? classes.myMessage : classes.otherMessage
          )}
        >
          {message.content}
        </main>
      </div>
    </Grid>
  );
}
