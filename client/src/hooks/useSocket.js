import io from "socket.io-client";

const socket = io.connect("http://localhost:3001", { autoConnect: false });

const connectSocket = (user) => {
  socket.auth = { user };
  socket.connect();
};

// Just keeping for development

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });

export { socket, connectSocket };
