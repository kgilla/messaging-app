import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import FormContainer from "./components/Form/FormContainer";
import MessagerContainer from "./components/Messager/MessagerContainer";
import PrivateRoute from "./components/PrivateRoute";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/messenger">
          <MessagerContainer />
        </PrivateRoute>
        <Route path="/signup">
          <FormContainer formType="signup" />
        </Route>
        <Route path="/login">
          <FormContainer formType="login" />
        </Route>
        <Route path="/">
          <FormContainer formType="login" />
        </Route>
      </Switch>
    </Router>
  );
}
