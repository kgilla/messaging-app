import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Hidden,
  Paper,
  Button,
  makeStyles,
} from "@material-ui/core";
import { MoreHoriz, Menu } from "@material-ui/icons";

import { useAuth } from "hooks/useAuth";
import { socket } from "hooks/useSocket";

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
  },
}));

export default function MainContainer(props) {
  const { toggleDrawer, currentConvo, updateConversation, createSnack } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [page, SetPage] = useState(0);

  const auth = useAuth();
  const classes = useStyles();
  const messagesRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/convos/${currentConvo._id}/messages/?page=${page}&size=50`,
          { method: "get" }
        );
        const data = await response.json();
        messages
          ? setMessages(data.messages, ...messages)
          : setMessages(data.messages);
        setIsLoading(false);
        scrollIntoView();
      } catch (err) {
        console.log(err);
      }
    };
    if (currentConvo) getMessages();
  }, [currentConvo, page]);

  useEffect(() => {
    const updateMessages = (message) => {
      if (message.to._id === currentConvo._id) {
        const msg = {
          author: message.author,
          conversation: message.to,
          content: message.content,
          dateCreated: Date.now(),
        };
        setMessages((currentMessages) => [...currentMessages, msg]);
        scrollIntoView();
      } else {
        console.log(false);
      }
    };

    const listener = (message) => {
      updateMessages(message);
    };

    socket.on("newMessage", listener);

    return () => {
      socket.off("newMessage", listener);
    };
  }, [currentConvo, messagesRef]);

  const handleNewMessage = async (content) => {
    socket.emit("message", { to: currentConvo, author: auth.user, content });
    makeFakeMessage(content);
    try {
      const response = await fetch(
        `/api/convos/${currentConvo._id}/messages/`,
        {
          method: "post",
          body: JSON.stringify({ content }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        createSnack({
          message: "Message unable to send",
          severity: "error",
        });
        // Should add some message flag component or just remove the message from the messages array.
      }
    } catch (err) {
      console.log(err);
    }
  };

  const makeFakeMessage = (content) => {
    const message = {
      dateCreated: Date.now(),
      conversation: currentConvo,
      author: auth.user,
      content,
    };
    messages
      ? setMessages((currentMessages) => [...currentMessages, message])
      : setMessages([message]);
    updateConversation(message);
    scrollIntoView();
  };

  const recipient = () => {
    const user = currentConvo.users.filter(
      (user) => user._id !== auth.user._id
    );
    return user[0].username;
  };

  const scrollIntoView = () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
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
            {currentConvo && recipient()}
          </Typography>
        </div>
        <Button className={classes.moreButton}>
          <MoreHoriz />
        </Button>
      </Paper>
      <Grid className={classes.main} ref={messagesRef}>
        {isLoading ? (
          <CircularProgress className={classes.centered} />
        ) : (
          messages &&
          messages.map((m) => (
            <Message key={m._id || m.dateCreated + m.author._id} message={m} />
          ))
        )}
      </Grid>
      <MessengerForm handleNewMessage={handleNewMessage} />
    </>
  );
}
