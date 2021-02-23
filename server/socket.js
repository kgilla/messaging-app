const io = require("socket.io")();

io.use((socket, next) => {
  const user = socket.handshake.auth.user;
  if (!user) {
    return next(new Error("invalid credentials"));
  }
  socket.user = user;
  socket.join(user._id);
  next();
});

io.on("connection", (socket) => {
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.user,
  });

  socket.on("users", () => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        user: socket.user,
      });
    }
    socket.emit("users", users);
  });

  socket.on("message", ({ conversation, author, content }) => {
    const recipient = conversation.users.filter((u) => u._id !== author._id);
    socket.to(recipient[0]._id).emit("newMessage", {
      conversation,
      author,
      content,
      dateCreated: Date.now(),
    });
  });

  socket.on("conversation", (conversation) => {
    console.log(conversation);
    socket.to(conversation.users[0]._id).emit("conversation", conversation);
  });

  socket.on("userTyping", () => {
    console.log("User is typing");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

module.exports = io;
