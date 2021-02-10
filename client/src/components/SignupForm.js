import React from "react";
import Form from "./Form";
import { useForm } from "../hooks/useForm";
import {
  Grid,
  Button,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";

const initValues = {
  username: "",
  email: "",
  password: "",
  password2: "",
};

export default function SignupForm() {
  const { values, handleInputChange } = useForm(initValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Typography component="h1">Create an account.</Typography>
      <TextField
        name="username"
        label="Username"
        value={values.username}
        onChange={handleInputChange}
      />
      <TextField
        name="email"
        label="Email"
        value={values.email}
        onChange={handleInputChange}
      />
      <TextField
        name="password"
        label="Password"
        value={values.password}
        onChange={handleInputChange}
      />
      <TextField
        name="password2"
        label="Confirm Password"
        value={values.password2}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Sign Up
      </Button>
    </Form>
  );
}
