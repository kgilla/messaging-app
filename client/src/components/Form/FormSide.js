import React from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";

import Image from "../../images/bg-img.png";
import Bubble from "../../images/bubble.svg";

const useStyles = makeStyles(() => ({
  formImage: {
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "16px",
    backgroundImage: `linear-gradient(rgba(58, 141, 255, 0.85),rgba(134, 185, 255, 0.85)),url(${Image})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },

  formBubble: {
    width: "80px",
    height: "auto",
    marginBottom: "32px",
  },

  whiteHeading: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
}));

export default function FormSide() {
  const classes = useStyles();
  return (
    <Grid container className={classes.formImage}>
      <img src={Bubble} className={classes.formBubble} alt="chat-bubble" />
      <Typography variant="h6" className={classes.whiteHeading}>
        Converse with anyone with any language
      </Typography>
    </Grid>
  );
}
