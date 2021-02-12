import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Button, TextField, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

import Form from "./Form";

export default function LoginForm({ classes }) {
  const [error, setError] = useState(null);
  const { register, handleSubmit, errors } = useForm();

  const auth = useAuth();
  const history = useHistory();

  const onSubmit = async (data) => {
    const response = await auth.login(data);
    if (response) {
      setError(false);
      history.push("/messenger");
    } else {
      setError(true);
    }
  };

  return (
    <Form handleSubmit={handleSubmit(onSubmit)}>
      {error ? (
        <Alert severity="error" style={{ margin: "16px 0" }}>
          Invalid credentials.
        </Alert>
      ) : null}
      <Typography variant="h1">Welcome back!</Typography>
      <TextField
        name="username"
        type="text"
        label="Username"
        inputRef={register}
        className={classes.input}
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        inputRef={register}
        className={classes.input}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.formButton}
      >
        Login
      </Button>
    </Form>
  );
}
