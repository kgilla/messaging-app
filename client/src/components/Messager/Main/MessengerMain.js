import React, { useState, useEffect } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import { useAuth } from "hooks/useAuth";

import MessengerHeader from "./MessengerHeader";
import MessengerForm from "./MessengerForm";
import Message from "./Message";

const useStyles = makeStyles((theme) => ({
  root: {},

  main: {
    display: "flex",
    flexDirection: "column",
    height: "70vh",
    width: "100%",
    padding: "16px",
    overflowY: "scroll",
  },

  message: {
    borderRadius: "16px",
    padding: "8px",
  },

  myMessage: {
    borderRadius: "16px",
    padding: "8px",
    margin: "8px 0",
    alignSelf: "flex-end",
    background: "#eee",
  },

  otherMessage: {
    borderRadius: "16px",
    padding: "8px",
    margin: "8px 0",
    alignSelf: "flex-start",
    background: "#eee",
  },
}));

export default function MessengerMain({ toggleDrawer, currentConvo }) {
  const [messages, setMessages] = useState(null);
  const [page, SetPage] = useState(0);
  const classes = useStyles();
  const auth = useAuth();

  useEffect(() => {
    const getMessages = async () => {
      const response = await fetch(
        `/api/convos/${currentConvo._id}/messages/?page=${page}`,
        { method: "get" }
      );
      const data = await response.json();
      console.log(data.messages);
      setMessages(data.messages);
    };
    if (currentConvo) getMessages();
  }, [currentConvo]);

  return (
    <>
      <MessengerHeader
        currentConvo={currentConvo}
        toggleDrawer={toggleDrawer}
      />
      <Grid item className={classes.main}>
        {messages && messages.map((m) => <Message key={m._id} message={m} />)}
      </Grid>
      <MessengerForm />
    </>
  );
}
