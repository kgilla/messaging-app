import React, { useState, useEffect } from "react";
import { Typography, Paper, makeStyles } from "@material-ui/core";
import { useAuth } from "hooks/useAuth";
import {
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
} from "images/conversationImages";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    margin: "8px 0",
    padding: "16px",
    border: "1px solid #eee",
    background: "none",
    "&:hover": {
      cursor: "pointer",
      background: "#fff",
    },
  },

  circle: {
    display: "flex",
    justifyContent: "flex-start",
    height: "50px",
    width: "50px",
    marginRight: "16px",
    borderRadius: "50%",
    background: "#ccc",
    overflow: "hidden",
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

export default function Conversation({ convo, changeConvo, currentConvo, i }) {
  const [image, setImage] = useState("");
  const classes = useStyles();
  const auth = useAuth();

  useEffect(() => {
    setImage(randomImage());
  }, []);

  const recipient = () => {
    const user = convo.users.filter((user) => user._id !== auth.user._id);
    return user[0].username;
  };

  const randomImage = (i) => {
    const images = [image1, image2, image3, image4, image5, image6, image7];
    return images[i % 7];
  };

  return (
    <Paper
      className={classes.root}
      elevation={1}
      variant={
        currentConvo && currentConvo._id === convo._id
          ? "elevation"
          : "outlined"
      }
      onClick={() => changeConvo(convo)}
    >
      <img src={randomImage(i)} className={classes.circle} />
      <div className={classes.main}>
        <Typography variant="h6" className={classes.username}>
          {recipient()}
        </Typography>
        <Typography variant="h6" className={classes.userState}>
          {convo.messages?.[0]?.content}
        </Typography>
      </div>
    </Paper>
  );
}
