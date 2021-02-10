import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { theme } from "./themes/theme";
import FormLayout from "./components/FormLayout";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/">
            <FormLayout></FormLayout>
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
