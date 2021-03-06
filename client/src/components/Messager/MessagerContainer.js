import React, { useState, useEffect } from "react";
import { useAuth } from "hooks/useAuth";
import { Grid, Hidden, Drawer, makeStyles } from "@material-ui/core";

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

  // Fetches relevant authed user data to display for all components
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api/convos", {
          method: "get",
        });
        if (response.ok) {
          let conversations = await response.json();
          conversations = conversations.map((c) => changeConversation(c));
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
          users: [recipient],
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

  // Assigns a random image to all users for demo purposes
  const changeConversation = (conversation) => {
    let convo = {
      ...conversation,
      users: conversation.users.filter((u) => u._id !== auth.user._id),
      image: Math.floor(Math.random() * 7),
    };
    return convo;
  };

  // Updates conversation lastMessage
  const updateConversation = (newMessage) => {
    const newConvos = allConvos.map((c) =>
      c._id === currentConvo._id ? { ...c, latestMessage: newMessage } : c
    );
    setAllConvos(newConvos);
  };

  // handles sidebar conversation clicking to populate Main Container
  const handleConvoChange = (newConvo) => {
    setCurrentConvo(newConvo);
    isSideOpen && toggleDrawer();
  };

  // handles clicks for sidebar drawer when page width is small enough to show
  const toggleDrawer = () => {
    setIsSideOpen((oldState) => !oldState);
  };

  // Creates a Snack component for errors or success messages
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
