import React, { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./useAuth";
import { emitConversation, emitMessage, emitUsers, socket } from "./useSocket";
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
  const [allConvos, setAllConvos] = useState([]);
  const [currentConvo, setCurrentConvo] = useState(0);

  const auth = useAuth();
  const { createSnack } = useSnack();

  // API CALLS

  // Intialize API call
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
          emitUsers();
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

  const getMessages = async (page = 1) => {
    try {
      const response = await fetch(
        `/api/convos/${currentConvo._id}/messages/?page=${page}&size=50`,
        { method: "get" }
      );
      const data = await response.json();
      if (response.ok) {
        // add messages to conversation
      } else {
        // deal with no more messages to load
      }
    } catch (err) {
      console.log(err);
    }
  };

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
        emitConversation(data.conversation, auth.user, recipient);
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

  const createMessage = async (content) => {
    makeTempMessage(content);
    try {
      const response = await fetch(
        `/api/convos/${allConvos[currentConvo]._id}/messages/`,
        {
          method: "post",
          body: JSON.stringify({ content }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        emitMessage(allConvos[currentConvo], auth.user, content);
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

  const addConvoToState = (data, recipient) => {
    let conversation = {
      ...data.conversation,
      users: [recipient],
      messages: [],
      image: Math.floor(Math.random() * 7),
    };
    setAllConvos((oldConvos) =>
      oldConvos.length ? [...oldConvos, conversation] : [conversation]
    );
    setCurrentConvo(0);
  };

  // filters auth user from conversations and adds random picture
  const changeConversationData = (conversation) => {
    return {
      ...conversation,
      users: conversation.users.filter((u) => u._id !== auth.user._id),
      image: Math.floor(Math.random() * 7),
      unreadCount: 0,
    };
  };

  // Changes current conversation and removes unread messages
  const changeCurrentConvo = (newConvo) => {
    const i = allConvos.findIndex((c) => c._id === newConvo._id);
    let convoCopy = allConvos.slice();
    convoCopy[i].unreadCount = 0;
    setCurrentConvo(i);
    setAllConvos(convoCopy);
  };

  // updates conversations latestMessage and handles unreadCount
  const updateConversation = (message) => {
    setAllConvos((currentConvos) =>
      currentConvos.map((c) =>
        c._id === message.conversation._id
          ? {
              ...c,
              messages: c.messages.length
                ? [...c.messages, message]
                : [message],
              unreadCount:
                message.conversation._id !== currentConvos[currentConvo]._id
                  ? (c.unreadCount += 1)
                  : c.unreadCount,
            }
          : c
      )
    );
  };

  // Constructs temp message to add to conversation prior to API call.
  const makeTempMessage = (content, author = auth.user) => {
    const message = {
      dateCreated: Date.now(),
      conversation: allConvos[currentConvo],
      author,
      content,
    };
    updateConversation(message);
  };

  // Sorts convos based on online status, updates currentConvo to new index
  const sortConvos = (convos) => {
    const oldConvos = convos.slice();
    const sorted = convos.sort((c) => (c.isOnline ? -1 : 1));
    setCurrentConvo((i) => sorted.findIndex((c) => c._id === oldConvos[i]._id));
    return sorted;
  };

  // maps inital array of connected users
  const setOnlineStatus = (users) => {
    setAllConvos((currentConvos) => {
      return sortConvos(
        currentConvos.map((c) =>
          users.some((user) => user._id === c.users[0]._id)
            ? { ...c, isOnline: true }
            : c
        )
      );
    });
  };

  // maps single user
  const mapUserStatus = (user, online) => {
    setAllConvos((currentConvos) => {
      return sortConvos(
        currentConvos.map((c) =>
          c.users[0]._id === user._id ? { ...c, isOnline: online } : c
        )
      );
    });
  };

  // seperate useEffect to keep ref to latest currentConvo
  useEffect(() => {
    // Handles new messages based on currentConvo
    socket.on("newMessage", (message) => {
      updateConversation(message);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [currentConvo]);

  // socket listeners
  useEffect(() => {
    socket.on("conversation", (conversation) => {
      setAllConvos((currentConvos) => [...currentConvos, conversation]);
      emitUsers();
    });

    socket.on("users", (payload) => {
      let users = payload.map((item) => item.user);
      setOnlineStatus(users);
    });

    socket.on("user connected", (user) => {
      console.log(user + "connected");
      mapUserStatus(user, true);
    });

    socket.on("user disconnected", (user) => {
      mapUserStatus(user, false);
    });

    return () => {
      socket.off("users");
      socket.off("conversation");
      socket.off("user connected");
      socket.off("user disconnected");
    };
  }, []);

  return {
    allConvos,
    currentConvo,
    getMessages,
    createMessage,
    createConversation,
    changeCurrentConvo,
  };
}
