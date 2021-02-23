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

  // Intialize call for conversations, users, and latest message in each conversation
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
          socket.emit("users");
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

  // Message fetch call
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

  // Conversation functions
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
        addConvoToState(data, recipient);
        socket.emit("conversation", {
          conversation: {
            ...data.conversation,
            users: [auth.user],
          },
          to: recipient,
        });
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

  // Adds new conversation to state, sets it as currentConvo, and emits to socket server
  const addConvoToState = (data, recipient) => {
    let conversation = {
      ...data.conversation,
      users: [recipient],
      image: Math.floor(Math.random() * 7),
    };
    setAllConvos((oldConvos) => [...oldConvos, conversation]);
    setCurrentConvo(conversation);
  };

  // filters auth user from conversations and adds random picture
  const changeConversationData = (conversation) => {
    let convo = {
      ...conversation,
      users: conversation.users.filter((u) => u._id !== auth.user._id),
      image: Math.floor(Math.random() * 7),
    };
    return convo;
  };

  // Changes current conversation and removes unread messages
  const changeCurrentConvo = (newConvo) => {
    if (newConvo.unreadCount) {
      const newConvos = allConvos.map((c) =>
        c._id === newConvo._id ? { ...newConvo, unreadCount: null } : c
      );
      setAllConvos(newConvos);
    }
    setCurrentConvo(newConvo);
  };

  // updates conversations latestMessage and handles unreadCount
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
    setAllConvos(newConvos);
  };

  // Message Functions
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
      if (response.ok) {
        socket.emit("message", {
          conversation: currentConvo,
          author: auth.user,
          content,
        });
      } else {
        setSnack({
          message: "Message unable to send",
          severity: "error",
        });
        // Should add some message flag component or just remove the message from the messages array.
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Constructs temp message to add to conversation prior to API call.
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

  // socket listeners
  useEffect(() => {
    const setOnlineStatus = (users) => {
      let convos = allConvos.map((c) =>
        users.some((user) => user._id === c.users[0]._id)
          ? { ...c, isOnline: true }
          : c
      );
      convos = convos.sort((c) => (c.isOnline ? -1 : 1));
      setAllConvos(convos);
    };

    socket.on("newMessage", (message) => {
      if (message.conversation._id === currentConvo._id) {
        makeTempMessage(message.content, message.author);
      } else {
        updateConversation(message, message.conversation);
      }
    });

    socket.on("conversation", (conversation) => {
      // users is wrong and needs to be reversed
      setAllConvos((currentConvos) => [...currentConvos, conversation]);
    });

    socket.on("users", (payload) => {
      console.log(payload);
      let users = payload.map((item) => item.user);
      setOnlineStatus(users);
    });

    socket.on("user connected", (user) => {
      let newConvos = allConvos.map((c) =>
        c.users[0]._id === user._id ? { ...c, isOnline: true } : c
      );
      newConvos = newConvos.sort((c) => (c.isOnline ? -1 : 1));
      setAllConvos(newConvos);
    });

    socket.on("user disconnected", (user) => {
      let newConvos = allConvos.map((c) =>
        c.users[0]._id === user._id ? { ...c, isOnline: false } : c
      );
      newConvos = newConvos.sort((c) => (c.isOnline ? -1 : 1));
      setAllConvos(newConvos);
    });

    return () => {
      socket.off("newMessage");
      socket.off("users");
      socket.off("conversation");
      socket.off("user connected");
      socket.off("user disconnected");
    };
  }, [allConvos, currentConvo]);

  return {
    allConvos,
    messages,
    currentConvo,
    createMessage,
    createConversation,
    changeCurrentConvo,
    updateConversation,
    makeTempMessage,
  };
}
