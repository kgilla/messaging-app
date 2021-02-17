import React, { useState, useEffect } from "react";
import { useAuth } from "hooks/useAuth";
import { Grid, Hidden, Drawer, makeStyles } from "@material-ui/core";

import Sidebar from "./Sidebar/Sidebar";
import MessengerMain from "./Main/MessengerMain";

const useStyles = makeStyles(() => ({
  drawerPaper: {
    width: "350px",
  },
}));

export default function MessagerContainer() {
  const [open, setOpen] = useState(false);
  const [currentConvo, setCurrentConvo] = useState(null);
  const [allConvos, setAllConvos] = useState(null);

  const classes = useStyles();
  const auth = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api/convos", {
          method: "get",
        });
        if (response.ok) {
          let data = await response.json();
          setAllConvos(data);
        } else {
          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  // handles sidebar clicking to populate messenger main
  const handleConvoChange = (newConvo) => {
    setCurrentConvo(newConvo);
    open && toggleDrawer();
  };

  // handles clicks for sidebar drawer when page width is small enough to show
  const toggleDrawer = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const createConversation = async (recipient) => {
    const response = await fetch("/api/convos", {
      method: "post",
      body: JSON.stringify({ recipient: recipient._id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const conversation = {
      ...data.conversation,
      users: [auth.user, recipient],
    };
    setAllConvos((oldConvos) => [...oldConvos, conversation]);
    setCurrentConvo(conversation);
  };

  return (
    <Grid container spacing={0}>
      {/* Small screen sidebar menu */}
      <Hidden mdUp>
        <Drawer
          anchor="left"
          open={open}
          onClose={toggleDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Sidebar
            allConvos={allConvos}
            changeConvo={handleConvoChange}
            currentConvo={currentConvo}
            toggleDrawer={toggleDrawer}
            createConversation={createConversation}
          />
        </Drawer>
      </Hidden>
      {/* Regular sized screen sidebar */}
      <Hidden smDown>
        <Grid item md={4}>
          <Sidebar
            allConvos={allConvos}
            changeConvo={handleConvoChange}
            currentConvo={currentConvo}
            toggleDrawer={toggleDrawer}
            createConversation={createConversation}
          />
        </Grid>
      </Hidden>
      <Grid item xs={12} md={8}>
        <MessengerMain
          toggleDrawer={toggleDrawer}
          currentConvo={currentConvo}
        />
      </Grid>{" "}
    </Grid>
  );
}
