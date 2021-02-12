import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { baseUrl } from "../../config/const";
import { Grid, Hidden, Drawer, makeStyles } from "@material-ui/core";

import Sidebar from "./Sidebar";
import MessengerMain from "./MessengerMain";

const useStyles = makeStyles((theme) => ({
  root: {},

  drawerPaper: {
    width: "350px",
  },

  fullHeight: {
    height: "100vh",
  },
}));

export default function MessagerContainer() {
  const [open, setOpen] = useState(false);
  const [currentConvo, setCurrentConvo] = useState(null);
  const [allConvos, setAllConvos] = useState(null);

  const auth = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${baseUrl}/conversations`, {
          method: "get",
        });
        if (response.ok) {
          let data = response.json();
          console.log(data);
        } else {
          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const classes = useStyles();

  // handles sidebar clicking to populate messenger main
  const handleConvoChange = (newConvo) => {
    setCurrentConvo(newConvo);
  };

  // handles clicks for sidebar drawer when page width is small enough to show
  const toggleDrawer = (e) => {
    open ? setOpen(false) : setOpen(true);
  };

  return (
    <Grid container spacing={2}>
      <Hidden mdUp>
        <Drawer
          anchor="left"
          open={open}
          onClose={toggleDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Sidebar />
        </Drawer>
      </Hidden>
      <Hidden smDown>
        {" "}
        <Grid item md={4} className={classes.fullHeight}>
          <Sidebar />
        </Grid>
      </Hidden>
      <Grid item xs={12} md={8} className={classes.fullHeight} style={{}}>
        <MessengerMain toggleDrawer={toggleDrawer} />
      </Grid>{" "}
    </Grid>
  );
}
