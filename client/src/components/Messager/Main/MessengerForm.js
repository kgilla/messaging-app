import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, makeStyles } from "@material-ui/core";

const schema = yup.object().shape({
  content: yup.string().required("A message cannot be blank"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "15vh",
    display: "flex",
    alignItems: "center",
    margin: "0 24px",
    boxSizing: "border-box",
  },

  messengerInput: {
    background: "#F4F6F6",
  },
}));

export default function MessengerForm({ handleNewMessage }) {
  const classes = useStyles();

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    handleNewMessage(data);
    reset();
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
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
