import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import FormHeader from "./FormHeader";
import FormSide from "./FormSide";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function FormContainer({ formType }) {
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
