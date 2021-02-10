import React from "react";
import Form from "./Form";
import { useForm } from "../hooks/useForm";
import { Grid, Button, TextField, makeStyles } from "@material-ui/core";

const initValues = {
  username: "",
  password: "",
};

export default function LoginForm() {
  const { values, handleInputChange } = useForm(initValues);
  return (
    <Form>
      <h1>Log In</h1>
      <TextField name="username" label="Username" />
      <TextField name="password" label="Password" />
      <Button variant="contained" color="primary">
        Log In
      </Button>
    </Form>
  );
}
