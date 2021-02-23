import React, { useRef, useLayoutEffect } from "react";
import {
  Grid,
  Typography,
  Hidden,
  Badge,
  Paper,
  Button,
  makeStyles,
} from "@material-ui/core";
import { MoreHoriz, Menu } from "@material-ui/icons";
import clsx from "clsx";

import { useMessenger } from "hooks/useMessenger";

import MessengerForm from "./MessengerForm";
import Message from "./Message";

const useStyles = makeStyles((theme) => ({
  header: {
    height: "15vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    border: "none",
    boxShadow: "0 2px 4px rgb(0 0 0 / 5%), 0 8px 16px rgb(0 0 0 / 5%)",
  },

  flexed: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  button: {
    marginRight: "16px",
  },

  heading: {
    fontWeight: 600,
    marginRight: "32px",
  },

  moreButton: {
    color: "#aaa",
  },

  main: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "70vh",
    width: "100%",
    padding: "32px",
    boxSizing: "border-box",
    overflowY: "scroll",
  },

  centered: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },

  online: {
    background: theme.palette.online.main,
  },

  offline: {
    background: "#aaa",
  },

  status: {
    width: "15px",
    height: "15px",
    border: "2px solid #fff",
    borderRadius: "100%",
    margin: "1px 8px",
  },

  statusText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#ccc",
    marginTop: "2px",
  },
}));

export default function MainContainer({ toggleDrawer }) {
  const classes = useStyles();
  const messagesRef = useRef();
  const { messages, currentConvo, createMessage } = useMessenger();

  const scrollIntoView = () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  useLayoutEffect(() => {
    scrollIntoView();
  });

  const handleNewMessage = (content) => {
    createMessage(content);
    scrollIntoView();
  };

  return (
    <>
      <Paper square variant="outlined" className={classes.header}>
        <div className={classes.flexed}>
          <Hidden mdUp>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={toggleDrawer}
            >
              <Menu />
            </Button>
          </Hidden>

          {currentConvo && (
            <>
              <Typography variant="h6" className={classes.heading}>
                {currentConvo?.users[0].username}
              </Typography>
              <Badge
                variant="dot"
                overlap="circle"
                classes={{
                  badge: clsx(classes.status, {
                    [classes.online]: currentConvo.isOnline,
                    [classes.offline]: !currentConvo.isOnline,
                  }),
                }}
              ></Badge>
              <Typography variant="h6" className={classes.statusText}>
                {currentConvo?.isOnline ? "Online" : "Offline"}
              </Typography>
            </>
          )}
        </div>
        <Button className={classes.moreButton}>
          <MoreHoriz />
        </Button>
      </Paper>

      <Grid className={classes.main} ref={messagesRef}>
        {messages ? (
          messages.map((m) => (
            <Message key={m._id || m.dateCreated + m.author._id} message={m} />
          ))
        ) : (
          <Typography variant="h5" className={classes.centered}>
            Don't be afraid to make the first move!
          </Typography>
        )}
      </Grid>

      <MessengerForm handleNewMessage={handleNewMessage} />
    </>
  );
}
