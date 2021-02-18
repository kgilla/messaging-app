import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import FormContainer from "./components/Form/FormContainer";

export default function Routes() {
  return (
    <Router>
      <Switch>
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
