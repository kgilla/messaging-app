import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";

// Validators
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//Components
import {
  Grid,
  Button,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";

const schema = yup.object().shape({
  content: yup.string().required("A message cannot be blank"),
});

const useStyles = makeStyles((theme) => ({
  root: {},

  messengerForm: {
    height: "15vh",
    margin: "0 24px",
    background: "#fff",
    boxSizing: "border-box",
  },

  messengerInput: {
    background: "#eee",
  },
}));
export default function MessengerForm() {
  const classes = useStyles();

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form className={classes.messengerForm} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="content"
        variant="outlined"
        placeholder="Type something..."
        fullWidth
        className={classes.messengerInput}
        inputRef={register}
        error={!!errors.content}
        helperText={errors.content?.message}
      />{" "}
    </form>
  );
}
