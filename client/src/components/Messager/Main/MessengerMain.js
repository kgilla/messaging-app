import React, { useState, useEffect, useRef } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { useAuth } from "hooks/useAuth";
import MessengerHeader from "./MessengerHeader";
import MessengerForm from "./MessengerForm";
import Message from "./Message";

const useStyles = makeStyles((theme) => ({
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

export default function MessengerMain(props) {
  const { toggleDrawer, currentConvo, updateConversation, createSnack } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(null);
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

  const handleNewMessage = async (content) => {
    const message = makeFakeMessage(content);
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
    messages ? setMessages([...messages, message]) : setMessages([message]);
    updateConversation(message);
    scrollIntoView();
    return message;
  };

  const scrollIntoView = () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  return (
    <>
      <MessengerHeader
        currentConvo={currentConvo}
        toggleDrawer={toggleDrawer}
      />
      <div className={classes.main} ref={messagesRef}>
        {isLoading ? (
          <CircularProgress className={classes.centered} />
        ) : (
          messages &&
          messages.map((m) => (
            <Message key={m._id || m.dateCreated + m.author._id} message={m} />
          ))
        )}
      </div>
      <MessengerForm handleNewMessage={handleNewMessage} />
    </>
  );
}
