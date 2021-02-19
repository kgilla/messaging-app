import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme";
import { ProvideAuth } from "./hooks/useAuth";
import { ProvideSocket } from "./hooks/useSocket";
import Routes from "./Routes";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ProvideAuth>
        <ProvideSocket>
          <Routes />
        </ProvideSocket>
      </ProvideAuth>
      <CssBaseline />
    </MuiThemeProvider>
  );
}

export default App;
