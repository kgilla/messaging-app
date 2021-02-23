import React, { useState } from "react";
import { Grid, Hidden, Drawer, makeStyles } from "@material-ui/core";

import { useMessenger } from "hooks/useMessenger";

import SidebarContainer from "./Sidebar/SidebarContainer";
import MainContainer from "./Main/MainContainer";
import Snack from "./Snack";

const useStyles = makeStyles(() => ({
  root: {
    maxHeight: "100vh",
    maxWidth: "100vw",
    overflow: "hidden",
  },

  drawerPaper: {
    width: "350px",
  },
}));

export default function MessagerContainer() {
  const [isSideOpen, setIsSideOpen] = useState(false);

  const classes = useStyles();
  const { snack } = useMessenger();

  // handles clicks for sidebar drawer when page width is small enough to show
  const toggleDrawer = () => {
    setIsSideOpen((oldState) => !oldState);
  };

  return (
    <Grid container spacing={0} className={classes.root}>
      {/* Small screen sidebar menu */}
      <Hidden mdUp>
        <Drawer
          anchor="left"
          open={isSideOpen}
          onClose={toggleDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <SidebarContainer />
        </Drawer>
      </Hidden>

      {/* Regular sized screen sidebar */}
      <Hidden smDown>
        <Grid item md={4}>
          <SidebarContainer />
        </Grid>
      </Hidden>

      <Grid item xs={12} md={8}>
        <MainContainer toggleDrawer={toggleDrawer} />
      </Grid>

      {snack && <Snack snack={snack} />}
    </Grid>
  );
}
