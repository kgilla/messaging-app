import React from "react";
import { Grid, Hidden, makeStyles } from "@material-ui/core";
import FormHeader from "./FormHeader";
import FormSide from "./FormSide";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: "12px 0",
  },

  formButton: {
    width: "100%",
    maxWidth: "150px",
    margin: "16px auto",
    padding: "16px",
    fontWeight: "700",
    textTransform: "none",
  },
}));

export default function FormLayout({ formType }) {
  const classes = useStyles();

  return (
    <Grid container>
      <Hidden xsDown>
        <Grid item sm={4}>
          <FormSide />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={8}>
        <FormHeader formType={formType} />
        {formType === "login" ? (
          <LoginForm classes={classes} />
        ) : (
          <SignupForm classes={classes} />
        )}
      </Grid>
    </Grid>
  );
}
