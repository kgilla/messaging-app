import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { theme } from "./themes/theme";
import FormLayout from "./components/FormLayout";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/signup">
            <FormLayout>
              <SignupForm />
            </FormLayout>
          </Route>
          <Route path="/login">
            <FormLayout>
              <LoginForm />
            </FormLayout>
          </Route>
          <Route path="/">
            <FormLayout>
              <LoginForm />
            </FormLayout>
          </Route>
        </Switch>
      </Router>
      <CssBaseline />
    </MuiThemeProvider>
  );
}

export default App;
