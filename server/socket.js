const io = require("socket.io")();

io.on("connection", (socket) => {
  socket.broadcast.emit("hello");

  socket.on("message", (msg) => {
    console.log("message: " + msg);
  });
});

module.exports = io;
