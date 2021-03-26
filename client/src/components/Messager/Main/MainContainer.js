import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import {
  Grid,
  Typography,
  Hidden,
  Badge,
  Paper,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { MoreHoriz, Menu } from "@material-ui/icons";
import clsx from "clsx";

import { useMessenger } from "hooks/useMessenger";

import MessengerForm from "./MessengerForm";
import Message from "./Message";

const useStyles = makeStyles((theme) => ({
  header: {
    height: "15vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    border: "none",
    boxShadow: "0 2px 4px rgb(0 0 0 / 5%), 0 8px 16px rgb(0 0 0 / 5%)",
  },

  flexed: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  button: {
    marginRight: "16px",
  },

  heading: {
    fontWeight: 600,
    marginRight: "32px",
  },

  moreButton: {
    color: "#aaa",
  },

  main: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "70vh",
    width: "100%",
    padding: "32px",
    boxSizing: "border-box",
    overflowY: "scroll",
  },

  centered: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },

  online: {
    background: theme.palette.online.main,
  },

  offline: {
    background: "#aaa",
  },

  status: {
    width: "15px",
    height: "15px",
    border: "2px solid #fff",
    borderRadius: "100%",
    margin: "1px 8px",
  },

  statusText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#ccc",
    marginTop: "2px",
  },
}));

export default function MainContainer({ toggleDrawer }) {
  const classes = useStyles();
  const messagesRef = useRef();

  const { allConvos, currentConvo } = useMessenger();

  const scrollIntoView = () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  useLayoutEffect(() => {
    scrollIntoView();
  });

  const renderMessages = () => {
    return !allConvos[currentConvo] ? (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress />
      </div>
    ) : allConvos[currentConvo]?.messages ? (
      allConvos[currentConvo].messages.map((m) => (
        <Message
          key={m._id || m.dateCreated + m.author._id}
          message={m}
          image={allConvos[currentConvo].image}
        />
      ))
    ) : (
      <Typography variant="h5" className={classes.centered}>
        Don't be afraid to make the first move!
      </Typography>
    );
  };

  return (
    <>
      <Paper square variant="outlined" className={classes.header}>
        <div className={classes.flexed}>
          <Hidden mdUp>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={toggleDrawer}
            >
              <Menu />
            </Button>
          </Hidden>
          <>
            <Typography variant="h6" className={classes.heading}>
              {allConvos[currentConvo]?.users[0].username}
            </Typography>
            <Badge
              variant="dot"
              overlap="circle"
              classes={{
                badge: clsx(classes.status, {
                  [classes.online]: allConvos[currentConvo]?.isOnline,
                  [classes.offline]: !allConvos[currentConvo]?.isOnline,
                }),
              }}
            ></Badge>
            <Typography variant="h6" className={classes.statusText}>
              {allConvos[currentConvo]?.isOnline ? "Online" : "Offline"}
            </Typography>
          </>
        </div>
        <Button className={classes.moreButton}>
          <MoreHoriz />
        </Button>
      </Paper>

      <Grid className={classes.main} ref={messagesRef}>
        {renderMessages()}
      </Grid>
      <MessengerForm />
    </>
  );
}
