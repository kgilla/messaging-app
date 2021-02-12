import React, { useState } from "react";
import Form from "./Form";
import { Button, TextField, Typography, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("A username is required")
    .min(3, "Usernames must be between 3-20 characters in length")
    .max(20, "Usernames must be between 3-20 characters in length")
    .trim()
    .matches(/^[_a-zA-Z0-9]*$/, {
      message: "cannot contain special characters or spaces",
    }),
  email: yup
    .string()
    .required("An email is required")
    .email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, { message: "Password must be at least 6 characters long" }),
  passwordConfirm: yup
    .string()
    .required("Please re-enter password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const useStyles = makeStyles((theme) => ({
  input: theme.input,
  formButton: theme.formButton,
}));

export default function SignupForm() {
  const [error, setError] = useState(null);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const auth = useAuth();
  const classes = useStyles();

  const onSubmit = (data) => {
    const response = auth.signup(data);
  };

  return (
    <Form handleSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h1">Create an account.</Typography>
      {error && (
        <Alert severity="error" className={classes.error}>
          {error.msg}
        </Alert>
      )}
      <TextField
        name="username"
        label="Username"
        className={classes.input}
        inputRef={register}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        name="email"
        label="Email"
        className={classes.input}
        inputRef={register}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        className={classes.input}
        inputRef={register}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        name="passwordConfirm"
        label="Confirm Password"
        type="password"
        className={classes.input}
        inputRef={register}
        error={!!errors.passwordConfirm}
        helperText={errors.passwordConfirm?.message}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.formButton}
      >
        Create
      </Button>
    </Form>
  );
}
