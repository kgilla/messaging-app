import React from "react";
import {
  Grid,
  Button,
  Typography,
  Hidden,
  makeStyles,
} from "@material-ui/core";

import Image from "../../images/bg-img.png";
import Bubble from "../../images/bubble.svg";

const useStyles = makeStyles((theme) => ({
  formImage: {
    height: "100vh",
    backgroundImage: `linear-gradient(rgba(58, 141, 255, 0.85),rgba(134, 185, 255, 0.85)),url(${Image})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },

  formBubble: {
    width: "80px",
    height: "auto",
    marginBottom: "32px",
  },
}));

export default function FormSide() {
  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      className={classes.formImage}
    >
      <img src={Bubble} className={classes.formBubble} />
      <Typography
        component="h1"
        style={{
          color: "#fff",
          fontWeight: "400",
          fontSize: "22px",
          textAlign: "center",
          padding: "0 64px",
        }}
      >
        Converse with anyone with any language
      </Typography>
    </Grid>
  );
}
