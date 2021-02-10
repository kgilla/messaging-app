import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Button, TextField, Typography } from "@material-ui/core";

import Form from "./Form";

export default function LoginForm({ classes }) {
  const { register, handleSubmit, errors } = useForm();

  const auth = useAuth();

  const onSubmit = async (data) => {
    console.log(data);
    await auth.login(data);
  };

  return (
    <Form handleSubmit={handleSubmit(onSubmit)}>
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
