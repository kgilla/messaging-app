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
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", ({ to, author, content }) => {
    const recipient = to.users.filter((u) => u._id !== author._id);
    console.log({ recipient, content });
    socket
      .to(recipient[0]._id)
      .emit("newMessage", {
        conversation: to,
        author,
        content,
        dateCreated: Date.now(),
      });
  });

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      user: socket.user,
    });
  }
  socket.emit("users", users);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

module.exports = io;
