import React, { useState, useEffect } from "react";
import { Grid, Hidden, Drawer, makeStyles } from "@material-ui/core";

import { useAuth } from "hooks/useAuth";
import { useSocket } from "hooks/useSocket";

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
  const [currentConvo, setCurrentConvo] = useState(null);
  const [allConvos, setAllConvos] = useState(null);
  const [snack, setSnack] = useState(null);

  const classes = useStyles();
  const auth = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api/convos", {
          method: "get",
        });
        if (response.ok) {
          let conversations = await response.json();
          conversations = conversations.map((c) => assignRandomImage(c));
          setAllConvos(conversations);
          setCurrentConvo(conversations[0]);
          setSnack({
            message: `Welcome back ${auth.user.username}!`,
            severity: "success",
          });
        } else {
          setSnack({
            message: "Something went wrong on our end",
            severity: "error",
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  // Creates conversations with users after search
  const createConversation = async (recipient) => {
    try {
      const response = await fetch("/api/convos", {
        method: "post",
        body: JSON.stringify({ recipient: recipient._id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        let conversation = {
          ...data.conversation,
          users: [auth.user, recipient],
          image: Math.floor(Math.random() * 7),
        };
        setAllConvos((oldConvos) => [...oldConvos, conversation]);
        setCurrentConvo(conversation);
        setSnack({
          message: "Conversation created successfully!",
          severity: "success",
        });
      } else {
        setSnack({
          message: "Something went wrong on our end",
          severity: "error",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const assignRandomImage = (conversation) => {
    return {
      ...conversation,
      image: Math.floor(Math.random() * 7),
    };
  };

  // Updates conversation lastMessage
  const updateConversation = (newMessage) => {
    const newConvos = allConvos.map((c) =>
      c._id === currentConvo._id ? { ...c, latestMessage: newMessage } : c
    );
    setAllConvos(newConvos);
  };

  // handles sidebar clicking to populate messenger main
  const handleConvoChange = (newConvo) => {
    setCurrentConvo(newConvo);
    isSideOpen && toggleDrawer();
  };

  // handles clicks for sidebar drawer when page width is small enough to show
  const toggleDrawer = () => {
    setIsSideOpen((oldState) => (oldState ? false : true));
  };

  const createSnack = (data) => {
    const { message, severity } = data;
    setSnack({ message, severity });
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
          <SidebarContainer
            allConvos={allConvos}
            currentConvo={currentConvo}
            changeConvo={handleConvoChange}
            toggleDrawer={toggleDrawer}
            createConversation={createConversation}
            createSnack={createSnack}
          />
        </Drawer>
      </Hidden>
      {/* Regular sized screen sidebar */}
      <Hidden smDown>
        <Grid item md={4}>
          <SidebarContainer
            allConvos={allConvos}
            currentConvo={currentConvo}
            changeConvo={handleConvoChange}
            toggleDrawer={toggleDrawer}
            createConversation={createConversation}
            createSnack={createSnack}
          />
        </Grid>
      </Hidden>
      <Grid item xs={12} md={8}>
        <MainContainer
          currentConvo={currentConvo}
          toggleDrawer={toggleDrawer}
          updateConversation={updateConversation}
          createSnack={createSnack}
        />
      </Grid>
      {snack && <Snack snack={snack} />}
    </Grid>
  );
}
