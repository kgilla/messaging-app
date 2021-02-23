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

import { useMessenger } from "hooks/useMessenger";

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

  online: {
    width: "15px",
    height: "15px",
    border: "2px solid #fff",
    borderRadius: "100%",
    background: theme.palette.online.main,
  },

  offline: {
    width: "15px",
    height: "15px",
    border: "2px solid #fff",
    borderRadius: "100%",
    background: "#aaa",
  },
}));

export default function Conversation({ convo, toggleDrawer }) {
  const classes = useStyles();
  const { currentConvo, changeCurrentConvo } = useMessenger();

  const stringTrimmer = (string) => {
    if (!string) return;
    return string.length > 25 ? string.slice(0, 25) + "..." : string;
  };

  const getImage = () => {
    const images = [image1, image2, image3, image4, image5, image6, image7];
    return images[convo.image];
  };

  const handleClick = () => {
    changeCurrentConvo(convo);
    toggleDrawer();
  };

  return (
    <Paper
      className={
        currentConvo && currentConvo._id === convo._id
          ? `${classes.root} ${classes.selected}`
          : `${classes.root}`
      }
      variant="outlined"
      onClick={handleClick}
    >
      <Grid container justify="space-between" alignItems="center">
        <Grid item xs={10}>
          <Grid container justify="flex-start" alignItems="center" spacing={3}>
            <Grid item xs={3}>
              {" "}
              <Badge
                variant="dot"
                overlap="circle"
                classes={{
                  badge: convo.isOnline ? classes.online : classes.offline,
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar
                  src={getImage()}
                  alt="message-recipient"
                  className={classes.userImage}
                />
              </Badge>
            </Grid>
            <Grid item xs={9}>
              {" "}
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
