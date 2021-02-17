import React, { useState } from "react";

// Hooks
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useHistory } from "react-router-dom";

// Validators
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//Components
import { Button, TextField, Typography, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Form from "./Form";

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
  const history = useHistory();

  const onSubmit = async (data) => {
    const response = await auth.login(data);
    if (response.user) {
      history.push("/messenger");
    } else if (response.error) {
      setError({ msg: response.error });
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
