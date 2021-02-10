import React from "react";
import {
  Grid,
  Button,
  Typography,
  Hidden,
  makeStyles,
} from "@material-ui/core";
import Image from "../images/bg-img.png";
import Bubble from "../images/bubble.svg";

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

export default function FormLayout(props) {
  const classes = useStyles();
  return (
    <Grid container>
      <Hidden xsDown>
        <Grid item sm={4}>
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
                fontSize: "26px",
                textAlign: "center",
                padding: "0 64px",
              }}
            >
              Converse with anyone with any language
            </Typography>
          </Grid>
        </Grid>
      </Hidden>

      <Grid item xs={12} sm={8}>
        <header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "15vh",
            width: "100%",
          }}
        >
          <Typography component="span" style={{ color: "#888" }}>
            Already have an account?
          </Typography>
          <Button
            variant="contained"
            style={{
              margin: "0 32px",
              padding: "8px 32px",
              background: "#fff",
              textTransform: "none",
            }}
          >
            <span color="primary">Login</span>
          </Button>
        </header>
        {props.children}
      </Grid>
    </Grid>
  );
}
