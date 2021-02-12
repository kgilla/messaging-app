import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Button, TextField, Typography, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Form from "./Form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  username: yup.string().required("A username is required"),
  password: yup.string().required("Password is required"),
});

const useStyles = makeStyles((theme) => ({
  input: theme.input,
  formButton: theme.formButton,
  error: theme.error,
}));

export default function LoginForm() {
  const [error, setError] = useState(null);
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const classes = useStyles();
  const auth = useAuth();

  const onSubmit = async (data) => {
    const response = await auth.login(data);
    console.log(response);
    if (response.user) {
      setError(false);
      console.log("success");
      // move forward
    } else if (response.msg) {
      setError({ msg: response.msg });
    } else {
      setError({ msg: "Server Error" });
    }
  };

  return (
    <Form handleSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h1">Welcome back!</Typography>
      {error && (
        <Alert severity="error" className={classes.error}>
          {error.msg}
        </Alert>
      )}
      <TextField
        name="username"
        type="text"
        label="Username"
        inputRef={register}
        className={classes.input}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        inputRef={register}
        className={classes.input}
        error={!!errors.password}
        helperText={errors.password?.message}
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
