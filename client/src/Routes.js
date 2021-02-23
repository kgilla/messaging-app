import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import FormContainer from "./components/Form/FormContainer";
import MessagerContainer from "./components/Messager/MessagerContainer";
import PrivateRoute from "./components/PrivateRoute";

export default function Routes() {
  const auth = useAuth();

  return (
    <Router>
      <Switch>
        <PrivateRoute path="/messenger">
          <MessagerContainer />
        </PrivateRoute>
        <Route path="/login">
          <FormContainer formType="login" />
        </Route>
        <Route path="/signup">
          <FormContainer formType="signup" />
        </Route>
        <Redirect to={auth.user ? "/messenger" : "/login"} />
      </Switch>
    </Router>
  );
}
