import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    justifyContent: "center",
    alignItems: "center",
  },

  loader: {
    size: 500,
  },
});

export default function Loading() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress className={classes.loader} size={100} />
    </div>
  );
}
