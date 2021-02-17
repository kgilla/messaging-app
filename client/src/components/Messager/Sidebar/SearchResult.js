import React from "react";
import { Typography, Paper, Button, makeStyles } from "@material-ui/core";
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
    justifyContent: "space-between",
    margin: "4px 0",
    padding: "32px 16px",
    border: "none",
    background: "none",
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

export default function SearchResult({ user, i, createConversation }) {
  const classes = useStyles();

  const randomImage = (i) => {
    const images = [image1, image2, image3, image4, image5, image6, image7];
    return images[i % 7];
  };

  return (
    <Paper className={classes.root} elevation={1}>
      <div className={classes.main}>
        <img src={randomImage(i)} className={classes.circle} />

        <Typography variant="h6" className={classes.username}>
          {user.username}
        </Typography>
      </div>
      <Button onClick={() => createConversation(user)}>+</Button>
    </Paper>
  );
}
