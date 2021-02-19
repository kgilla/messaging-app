import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Loading from "./components/Loading";
import FormContainer from "./components/Form/FormContainer";
import MessagerContainer from "./components/Messager/MessagerContainer";
import PrivateRoute from "./components/PrivateRoute";

export default function Routes() {
  const auth = useAuth();

  return (
    <Router>
      <Switch>
        {auth.isLoading && <Loading />}
        <PrivateRoute path="/messenger">
          <MessagerContainer />
        </PrivateRoute>
        {auth.user && <Redirect to="/messenger" />}
        <Route path="/signup">
          <FormContainer formType="signup" />
        </Route>
        <Route path="/login">
          <FormContainer formType="login" />
        </Route>
        <Redirect to={auth.user ? "/messenger" : "/login"} />
      </Switch>
    </Router>
  );
}
