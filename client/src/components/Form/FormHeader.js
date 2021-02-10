import React from "react";
import {
  Grid,
  Button,
  Typography,
  Hidden,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: "15vh",
    width: "100%",
  },

  sideText: {
    color: "#aaa",
    fontSize: "16px",
    fontWeight: "500",
  },

  formSwitch: {
    margin: "32px",
    padding: "16px 32px",
    fontSize: "16px",
    background: "#fff",
    textTransform: "none",
    color: theme.palette.primary.main,
    fontWeight: "600",
  },
}));

export default function FormLayoutHeader({ formType }) {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Typography component="h4" className={classes.sideText}>
        {formType === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to={formType === "login" ? "/signup" : "/login"}
        className={classes.formSwitch}
      >
        <span>{formType === "login" ? "Create account" : "Login"}</span>
      </Button>
    </Grid>
  );
}
