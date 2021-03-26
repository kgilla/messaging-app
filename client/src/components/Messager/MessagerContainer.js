import React, { useState } from "react";
import { Grid, Hidden, Drawer, makeStyles } from "@material-ui/core";

import { useSnack } from "hooks/useSnack";

import Snack from "./Snack";
import SidebarContainer from "./Sidebar/SidebarContainer";
import MainContainer from "./Main/MainContainer";

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
  const { snack } = useSnack();

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
          <SidebarContainer toggleDrawer={toggleDrawer} />
        </Drawer>
      </Hidden>

      {/* Regular sized screen sidebar */}
      <Hidden smDown>
        <Grid item md={4}>
          <SidebarContainer toggleDrawer={toggleDrawer} />
        </Grid>
      </Hidden>

      <Grid item xs={12} md={8}>
        <MainContainer toggleDrawer={toggleDrawer} />
      </Grid>

      {snack && <Snack snack={snack} />}
    </Grid>
  );
}
