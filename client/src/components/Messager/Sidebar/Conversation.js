import React from "react";
import {
  Typography,
  Paper,
  Grid,
  Avatar,
  Badge,
  makeStyles,
} from "@material-ui/core";
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
    margin: "8px 0",
    padding: "16px",
    border: "none",
    background: "none",
    "&:hover": {
      cursor: "pointer",
      background: "#fff",
    },
  },

  grid: {},

  selected: {
    boxShadow: "0 2px 4px rgb(0 0 0 / 5%), 0 8px 16px rgb(0 0 0 / 5%)",
    background: "#fff",
  },

  userImage: theme.circleImage,

  username: {
    fontSize: "16px",
    fontWeight: 600,
  },

  lastMessage: {
    color: "#666",
    fontSize: "14px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  unreadMessage: {
    color: "#222",
  },

  badgeBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function Conversation({ convo, changeConvo, currentConvo }) {
  const classes = useStyles();

  const stringTrimmer = (string) => {
    if (!string) return;
    return string.length > 25 ? string.slice(0, 25) + "..." : string;
  };

  const getImage = () => {
    const images = [image1, image2, image3, image4, image5, image6, image7];
    return images[convo.image];
  };

  return (
    <Paper
      className={
        currentConvo && currentConvo._id === convo._id
          ? `${classes.root} ${classes.selected}`
          : `${classes.root}`
      }
      variant="outlined"
      onClick={() => changeConvo(convo)}
    >
      <Grid container justify="space-between" alignItems="center">
        <Grid item xs={10}>
          <Grid container justify="flex-start" alignItems="center">
            <Avatar
              src={getImage()}
              alt="message-recipient"
              className={classes.userImage}
            />
            <div className={classes.main}>
              <Typography variant="h6" className={classes.username}>
                {convo.users[0].username}
              </Typography>
              <Typography
                variant="h6"
                className={
                  convo.unreadCount
                    ? ` ${classes.lastMessage} ${classes.unreadMessage}`
                    : classes.lastMessage
                }
              >
                {stringTrimmer(convo.latestMessage?.content)}
              </Typography>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={2} className={classes.badgeBox}>
          {convo.unreadCount && (
            <Badge badgeContent={convo.unreadCount} color="primary"></Badge>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
