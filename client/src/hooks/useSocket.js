import io from "socket.io-client";

const socket = io.connect("http://localhost:3001", { autoConnect: false });

const connectSocket = (user) => {
  socket.auth = { user };
  socket.connect();
};

const emitMessage = (conversation, author, content) => {
  socket.emit("message", {
    conversation,
    author,
    content,
  });
};

const emitConversation = (conversation, authUser, recipient) => {
  socket.emit("conversation", {
    conversation: {
      ...conversation,
      users: [authUser],
      messages: [],
      unreadCount: 0,
      image: Math.floor(Math.random() * 7),
    },
    to: recipient,
  });
  emitUsers();
};

const emitUsers = () => {
  socket.emit("users");
};

// Just keeping for development

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export { socket, connectSocket, emitMessage, emitConversation, emitUsers };
