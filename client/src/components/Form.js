import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "32px",
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
