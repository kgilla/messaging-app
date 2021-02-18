import React from "react";
import { Typography, Paper, Button, makeStyles } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
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
    margin: "8px 0",
    padding: "16px",
    border: "none",
    background: "none",
  },

  main: {
    display: "flex",
    alignItems: "center",
  },

  circle: theme.circleImage,

  icon: {
    color: theme.palette.primary.main,
  },

  username: {
    fontSize: "16px",
    fontWeight: 600,
  },
}));

export default function SearchResult({
  user,
  i,
  createConversation,
  clearSearchResults,
}) {
  const classes = useStyles();

  const randomImage = (i) => {
    const images = [image1, image2, image3, image4, image5, image6, image7];
    return images[i % 7];
  };

  const handleClick = () => {
    createConversation(user);
    clearSearchResults();
  };

  return (
    <Paper className={classes.root} variant="outlined">
      <div className={classes.main}>
        <img src={randomImage(i)} className={classes.circle} />

        <Typography variant="h6" className={classes.username}>
          {user.username}
        </Typography>
      </div>
      <Button onClick={handleClick}>
        <AddCircleIcon className={classes.icon} />
      </Button>
    </Paper>
  );
}
