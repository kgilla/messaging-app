import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme";
import { ProvideAuth } from "./hooks/useAuth";
import Routes from "./Routes";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:3001");

  socket.on("connect", () => {
    // either with send()
    socket.send("Hello!");

    // or with emit() and custom event names
    socket.emit(
      "salutations",
      "Hello!",
      { mr: "john" },
      Uint8Array.from([1, 2, 3, 4])
    );
  });
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
