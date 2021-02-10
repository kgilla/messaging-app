import React from "react";
import { Grid, Hidden, makeStyles } from "@material-ui/core";
import FormHeader from "./FormHeader";
import FormSide from "./FormSide";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const useStyles = makeStyles((theme) => ({}));

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
        {formType === "login" ? <LoginForm /> : <SignupForm />}
      </Grid>
    </Grid>
  );
}
