import React from "react";
import {
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  makeStyles,
} from "@material-ui/core";
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
import { useMessenger } from "hooks/useMessenger";

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

  circle: theme.circleImage,

  icon: {
    color: theme.palette.primary.main,
  },

  username: {
    fontSize: "16px",
    fontWeight: 600,
  },
}));

export default function SearchResult(props) {
  const classes = useStyles();
  const { user, i, clearSearchResults, toggleDrawer } = props;
  const { createConversation } = useMessenger();

  const randomImage = (i) => {
    const images = [image1, image2, image3, image4, image5, image6, image7];
    return images[i % 7];
  };

  const handleClick = () => {
    createConversation(user);
    clearSearchResults();
    toggleDrawer();
  };

  return (
    <Paper className={classes.root} variant="outlined">
      <Grid container justify="space-between" alignItems="center">
        <Grid item xs={10}>
          <Grid container justify="flex-start" alignItems="center" spacing={3}>
            <Grid item xs={3}>
              <Avatar
                src={randomImage(i)}
                alt={user.username}
                className={classes.circle}
              />
            </Grid>
            <Grid item xs={9}>
              {" "}
              <Typography variant="h6" className={classes.username}>
                {user.username}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          {" "}
          <Button onClick={handleClick}>
            <AddCircleIcon className={classes.icon} />
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
