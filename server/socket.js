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
  socket.broadcast.emit("user connected", socket.user);

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

  socket.on("message", (message) => {
    const recipient = message.conversation.users.filter(
      (u) => u._id !== message.author._id
    );
    socket.to(recipient[0]._id).emit("newMessage", {
      ...message,
      dateCreated: Date.now(),
    });
  });

  socket.on("conversation", (payload) => {
    socket.to(payload.to._id).emit("conversation", payload.conversation);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.user);
  });
});

module.exports = io;
