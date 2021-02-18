const io = require("socket.io")();

io.on("connection", (socket) => {
  console.log("hello!");
});

module.exports = io;
