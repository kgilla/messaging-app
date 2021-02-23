import React, { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./useAuth";
import { socket } from "./useSocket";

const messengerContext = createContext();

export function ProvideMessenger({ children }) {
  const messenger = useProvideMessenger();
  return (
    <messengerContext.Provider value={messenger}>
      {children}
    </messengerContext.Provider>
  );
}

export const useMessenger = () => {
  return useContext(messengerContext);
};

function useProvideMessenger() {
  const [allConvos, setAllConvos] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentConvo, setCurrentConvo] = useState(null);
  const [snack, setSnack] = useState(null);

  const auth = useAuth();

  // Get Requests
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api/convos", {
          method: "get",
        });
        if (response.ok) {
          let conversations = await response.json();
          conversations = conversations.map((c) => changeConversationData(c));
          setAllConvos(conversations);
          setCurrentConvo(conversations[0]);
          setSnack({
            message: `Welcome back ${auth.user.username}!`,
            severity: "success",
          });
        } else {
          setSnack({
            message: "Something went wrong on our end",
            severity: "error",
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    auth.user && getData();
  }, [auth.user]);

  useEffect(() => {
    const getMessages = async (page = 0) => {
      try {
        const response = await fetch(
          `/api/convos/${currentConvo._id}/messages/?page=${page}&size=50`,
          { method: "get" }
        );
        const data = await response.json();
        messages
          ? setMessages(data.messages, ...messages)
          : setMessages(data.messages);
      } catch (err) {
        console.log(err);
      }
    };
    currentConvo && getMessages();
  }, [currentConvo]);

  // Creates conversations with users after search
  const createConversation = async (recipient) => {
    try {
      const response = await fetch("/api/convos", {
        method: "post",
        body: JSON.stringify({ recipient: recipient._id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        let conversation = {
          ...data.conversation,
          users: [recipient],
          image: Math.floor(Math.random() * 7),
        };
        setAllConvos((oldConvos) => [...oldConvos, conversation]);
        setCurrentConvo(conversation);
        // socket.emit("conversation", conversation);
        setSnack({
          message: "Conversation created successfully!",
          severity: "success",
        });
      } else {
        setSnack({
          message: "Something went wrong on our end",
          severity: "error",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createMessage = async (content) => {
    makeTempMessage(content);
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
        setSnack({
          message: "Message unable to send",
          severity: "error",
        });
        // Should add some message flag component or just remove the message from the messages array.
      } else {
        // socket.emit("message", {
        //   conversation: currentConvo,
        //   author: auth.user,
        //   content,
        // });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeConversationData = (conversation) => {
    let convo = {
      ...conversation,
      users: conversation.users.filter((u) => u._id !== auth.user._id),
      image: Math.floor(Math.random() * 7),
    };
    return convo;
  };

  const changeCurrentConvo = (newConvo) => {
    if (newConvo.unreadCount) {
      const newConvos = allConvos.map((c) =>
        c._id === newConvo._id ? { ...newConvo, unreadCount: null } : c
      );
      setAllConvos(newConvos);
    }
    setCurrentConvo(newConvo);
  };

  const updateConversation = (newMessage, conversation = currentConvo) => {
    let newConvos;
    if (conversation === currentConvo) {
      newConvos = allConvos.map((c) =>
        c._id === conversation._id ? { ...c, latestMessage: newMessage } : c
      );
    } else {
      newConvos = allConvos.map((c) =>
        c._id === conversation._id
          ? {
              ...c,
              latestMessage: newMessage,
              unreadCount: c.unreadCount ? (c.unreadCount += 1) : 1,
            }
          : c
      );
    }
  };

  const makeTempMessage = (content, author = auth.user) => {
    const message = {
      dateCreated: Date.now(),
      conversation: currentConvo,
      author,
      content,
    };
    messages
      ? setMessages((currentMessages) => [...currentMessages, message])
      : setMessages([message]);
    updateConversation(message);
  };

  // Creates a Snack component for errors or success messages
  const createSnack = (data) => {
    const { message, severity } = data;
    setSnack({ message, severity });
  };

  return {
    allConvos,
    messages,
    currentConvo,
    snack,
    createMessage,
    createConversation,
    createSnack,
    changeCurrentConvo,
  };
}
