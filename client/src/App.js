import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme";
import { ProvideAuth } from "./hooks/useAuth";
import { ProvideMessenger } from "./hooks/useMessenger";
import { ProvideSnack } from "./hooks/useSnack";
import Routes from "./Routes";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ProvideSnack>
        <ProvideAuth>
          <ProvideMessenger>
            <CssBaseline />
            <Routes />
          </ProvideMessenger>
        </ProvideAuth>
      </ProvideSnack>
    </MuiThemeProvider>
  );
}

export default App;
