import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme";
import { ProvideAuth } from "./hooks/useAuth";
import { ProvideMessenger } from "./hooks/useMessenger";
import Routes from "./Routes";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ProvideAuth>
        <ProvideMessenger>
          <Routes />
        </ProvideMessenger>
      </ProvideAuth>
      <CssBaseline />
    </MuiThemeProvider>
  );
}

export default App;
