import React, { useState, useEffect } from "react";
import { useAuth } from "hooks/useAuth";
import { Grid, Hidden, Drawer, makeStyles } from "@material-ui/core";

import Sidebar from "./Sidebar/Sidebar";
import MessengerMain from "./Main/MessengerMain";
import Snack from "./Snack";

const useStyles = makeStyles(() => ({
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
          const conversations = await response.json();
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
        const conversation = {
          ...data.conversation,
          users: [auth.user, recipient],
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

  // Updates conversation lastMessage
  const updateConversation = (newMessage) => {
    let newConvos = allConvos.slice();
    newConvos = newConvos.map((c) =>
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
    isSideOpen ? setIsSideOpen(false) : setIsSideOpen(true);
  };

  const createSnack = (data) => {
    const { message, severity } = data;
    setSnack({ message, severity });
  };

  return (
    <Grid container spacing={0}>
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
          <Sidebar
            allConvos={allConvos}
            changeConvo={handleConvoChange}
            currentConvo={currentConvo}
            toggleDrawer={toggleDrawer}
            createConversation={createConversation}
            createSnack={createSnack}
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
          updateConversation={updateConversation}
        />
      </Grid>
      {snack && <Snack snack={snack} />}
    </Grid>
  );
}
