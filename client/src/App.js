import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme";
import { ProvideAuth } from "./hooks/useAuth";
import Routes from "./Routes";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:3001");

  socket.emit("hello", "This is a payload");

  socket.on("connect", () => {
    socket.send("Hello!");
  });

  socket.on("message", (payload) => {
    console.log("new Message!" + payload);
  });

  socket.on("conversation", () => {
    console.log("new Conversation!");
  });

  socket.on("typing", () => {
    console.log("Typing!");
  });

  // when entering a conversation, a user is entering a room so to speak

  return (
    <MuiThemeProvider theme={theme}>
      <ProvideAuth>
        <Routes />
      </ProvideAuth>
      <CssBaseline />
    </MuiThemeProvider>
  );
}

export default App;
