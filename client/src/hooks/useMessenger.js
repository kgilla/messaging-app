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
  const [allConvos, setAllConvos] = useState([]);
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
  // useEffect(() => {
  //   const getMessages = async (page = 0) => {
  //     try {
  //       const response = await fetch(
  //         `/api/convos/${currentConvo._id}/messages/?page=${page}&size=50`,
  //         { method: "get" }
  //       );
  //       const data = await response.json();
  //       messages
  //         ? setMessages(data.messages, ...messages)
  //         : setMessages(data.messages);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   currentConvo && getMessages();
  // }, [currentConvo]);

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
            unreadCount: 0,
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
      messages: [],
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
      unreadCount: 0,
    };
  };

  // Changes current conversation and removes unread messages
  const changeCurrentConvo = (newConvo) => {
    if (newConvo.unreadCount) {
      setAllConvos((currentConvos) =>
        currentConvos.map((c) =>
          c._id === newConvo._id ? { ...newConvo, unreadCount: 0 } : c
        )
      );
    }
    setCurrentConvo(newConvo);
  };

  // updates conversations latestMessage and handles unreadCount
  const updateConversation = (message) => {
    setAllConvos((currentConvos) =>
      currentConvos.map((c) =>
        c._id === message.conversation._id
          ? {
              ...c,
              messages: c.messages.push(message),
              unreadCount:
                message.conversation._id !== currentConvo._id
                  ? (c.unreadCount += 1)
                  : c.unreadCount,
            }
          : c
      )
    );
    updateCurrentConvo();
  };

  const updateCurrentConvo = () => {
    setAllConvos((currentConvos) => {
      setCurrentConvo((currentConvo) =>
        currentConvos.find((c) => c._id === currentConvo._id)
      );
      return currentConvos;
    });
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
      console.log(response);
      if (response.ok) {
        // socket.emit("message", {
        //   conversation: currentConvo,
        //   author: auth.user,
        //   content,
        // });
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
    updateConversation(message);
  };

  // Sorts convos based on online status
  const sortConvos = (convos) => {
    return convos.sort((c) => (c.isOnline ? -1 : 1));
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
    updateCurrentConvo();
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
    updateCurrentConvo();
  };

  // useEffect(() => {
  //   console.log("using effect");
  //   // Handles new messages based on currentConvo
  //   socket.on("newMessage", (message) => {
  //     updateConversation(message);
  //   });

  //   return () => {
  //     socket.off("newMessage");
  //   };
  // }, [currentConvo]);

  // socket listeners
  useEffect(() => {
    // socket.on("newMessage", (message) => {
    //   updateConversation(message);
    // });

    socket.on("conversation", (conversation) => {
      setAllConvos((currentConvos) => [...currentConvos, conversation]);
      socket.emit("users");
    });

    socket.on("users", (payload) => {
      let users = payload.map((item) => item.user);
      setOnlineStatus(users);
    });

    socket.on("user connected", (user) => {
      mapUserStatus(user, true);
    });

    socket.on("user disconnected", (user) => {
      mapUserStatus(user, false);
    });

    return () => {
      // socket.off("newMessage");
      socket.off("users");
      socket.off("conversation");
      socket.off("user connected");
      socket.off("user disconnected");
    };
  }, []);

  return {
    allConvos,
    currentConvo,
    createMessage,
    createConversation,
    changeCurrentConvo,
    updateConversation,
  };
}
