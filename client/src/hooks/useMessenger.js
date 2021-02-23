import React, { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./useAuth";
import { socket } from "./useSocket";
import { useSnack } from "./useSnack";

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

  const auth = useAuth();
  const { createSnack } = useSnack();

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
          createSnack({
            message: `Welcome back ${auth.user.username}!`,
            severity: "success",
          });
        } else {
          createSnack({
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
            image: Math.floor(Math.random() * 7),
          },
          to: recipient,
        });
        socket.emit("users");
        createSnack({
          message: "Conversation created successfully!",
          severity: "success",
        });
      } else {
        createSnack({
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
    return {
      ...conversation,
      users: conversation.users.filter((u) => u._id !== auth.user._id),
      image: Math.floor(Math.random() * 7),
    };
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
    // Sorts convos based on online status
    const sortConvos = (convos) => {
      return convos.sort((c) => (c.isOnline ? -1 : 1));
    };

    // maps inital array of connected users
    const setOnlineStatus = (users) => {
      return allConvos.map((c) =>
        users.some((user) => user._id === c.users[0]._id)
          ? { ...c, isOnline: true }
          : c
      );
    };

    // maps single user
    const mapUserStatus = (user, online) => {
      return allConvos.map((c) =>
        c.users[0]._id === user._id ? { ...c, isOnline: online } : c
      );
    };

    // Handles new messages based on currentConvo
    socket.on("newMessage", (message) => {
      message.conversation._id === currentConvo._id
        ? makeTempMessage(message.content, message.author)
        : updateConversation(message, message.conversation);
    });

    socket.on("conversation", (conversation) => {
      setAllConvos((currentConvos) => [...currentConvos, conversation]);
      socket.emit("users");
    });

    socket.on("users", (payload) => {
      let users = payload.map((item) => item.user);
      setAllConvos(sortConvos(setOnlineStatus(users)));
    });

    socket.on("user connected", (user) => {
      setAllConvos(sortConvos(mapUserStatus(user, true)));
    });

    socket.on("user disconnected", (user) => {
      setAllConvos(sortConvos(mapUserStatus(user, false)));
    });

    return () => {
      // Need to find some better way to do this
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
