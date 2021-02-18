import React, { useState, useEffect, useRef } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
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
  const { toggleDrawer, currentConvo, updateConversation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [page, SetPage] = useState(0);
  const classes = useStyles();

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
      } catch (err) {
        console.log(err);
      }
    };
    if (currentConvo) getMessages();
  }, [currentConvo, page]);

  const handleNewMessage = async (newMessage) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/convos/${currentConvo._id}/messages/`,
        {
          method: "post",
          body: JSON.stringify(newMessage),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setMessages([...messages, data.message]);
      setIsLoading(false);
      updateConversation(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  return (
    <>
      <MessengerHeader
        currentConvo={currentConvo}
        toggleDrawer={toggleDrawer}
      />
      <div className={classes.main}>
        {isLoading ? (
          <CircularProgress className={classes.centered} />
        ) : (
          messages && messages.map((m) => <Message key={m._id} message={m} />)
        )}
        <AlwaysScrollToBottom />
      </div>
      <MessengerForm handleNewMessage={handleNewMessage} />
    </>
  );
}
