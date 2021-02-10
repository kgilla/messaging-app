import React from "react";
import Form from "./Form";
import { useForm } from "../../hooks/useForm";
import { Grid, Button, TextField, makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

const initValues = {
  username: "",
  password: "",
};

const useStyles = makeStyles((theme) => ({
  input: {
    margin: "16px 0",
  },

  formButton: {
    width: "100%",
    maxWidth: "150px",
    margin: "32px auto",
    padding: "16px",
    fontWeight: "700",
    textTransform: "none",
  },
}));

export default function LoginForm() {
  const { values, handleInputChange } = useForm(initValues);
  const classes = useStyles();

  return (
    <Form>
      <h1>Welcome Back!</h1>
      <TextField
        name="username"
        type="text"
        label="Username"
        className={classes.input}
        value={values.username}
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        className={classes.input}
        value={values.password}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.formButton}
      >
        Login
      </Button>
    </Form>
  );
}
