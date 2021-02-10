import React from "react";
import Form from "./Form";
import { Button, TextField, Typography, makeStyles } from "@material-ui/core";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
  password: yup.string().required("Password is required").min(6).max(40),
  password2: yup
    .string()
    .required("Please re-enter password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function SignupForm({ classes }) {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form handleSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h1">Create an account.</Typography>
      <TextField
        name="username"
        label="Username"
        className={classes.input}
        inputRef={register}
        error={errors.username ? true : null}
        helperText={errors.username ? errors.username.message : null}
      />
      <TextField
        name="email"
        label="Email"
        className={classes.input}
        inputRef={register}
        error={errors.email ? true : null}
        helperText={errors.email ? errors.email.message : null}
      />
      <TextField
        name="password"
        label="Password"
        className={classes.input}
        inputRef={register}
        error={errors.password ? true : null}
        helperText={errors.password ? errors.password.message : null}
      />
      <TextField
        name="password2"
        label="Confirm Password"
        className={classes.input}
        inputRef={register}
        error={errors.password2 ? true : null}
        helperText={errors.password2 ? errors.password2.message : null}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.formButton}
      >
        Sign Up
      </Button>
    </Form>
  );
}
