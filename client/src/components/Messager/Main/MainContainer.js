import React, { useRef, useEffect } from "react";
import {
  Grid,
  Typography,
  Hidden,
  Paper,
  Button,
  makeStyles,
} from "@material-ui/core";
import { MoreHoriz, Menu } from "@material-ui/icons";

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
}));

export default function MainContainer({ toggleDrawer }) {
  const classes = useStyles();
  const messagesRef = useRef();
  const { createMessage, messages, currentConvo } = useMessenger();

  const scrollIntoView = () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollIntoView();
  }, [messages, scrollIntoView]);

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

          <Typography variant="h6" className={classes.heading}>
            {currentConvo && currentConvo?.users[0].username}
          </Typography>
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
