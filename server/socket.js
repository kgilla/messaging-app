const io = require("socket.io")();

io.on("connection", (socket) => {
  console.log("hello!");

  socket.on("hello", (payload) => {
    socket.emit("message", payload);
  });
});

module.exports = io;
