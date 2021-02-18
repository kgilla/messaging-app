import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "85vh",
    width: "100%",
    maxWidth: "450px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 16px",
    margin: "0 auto",
  },
}));

export default function Form(props) {
  const classes = useStyles();
  return (
    <form className={classes.root} onSubmit={props.handleSubmit}>
      {props.children}
    </form>
  );
}
