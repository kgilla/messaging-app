import React from "react";
import { Grid, Button, makeStyles } from "@material-ui/core";
import Image from "../images/bg-img.png";

const useStyles = makeStyles((theme) => ({
  formImage: {
    backgroundImage: `linear-gradient(rgba(58, 141, 255, 0.85),rgba(134, 185, 255, 0.85)),url(${Image})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    position: "relative",
  },
}));

export default function FormLayout() {
  const classes = useStyles();
  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={0} s={2} md={4} className={classes.formImage}>
        <Grid container></Grid>
      </Grid>
      <Grid item xs={12} s={10} md={8}>
        <Grid container>
          <header
            style={{ background: "green", height: "15vh", width: "100%" }}
          >
            <Button>Click Me</Button>
          </header>
          <main></main>
        </Grid>
      </Grid>
    </Grid>
  );
}
