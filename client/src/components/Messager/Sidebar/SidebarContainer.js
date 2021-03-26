import React, { useState, useRef } from "react";
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { useAuth } from "hooks/useAuth";
import { useMessenger } from "hooks/useMessenger";
import { useSnack } from "hooks/useSnack";

import Conversation from "./Conversation";
import SidebarHeader from "./SidebarHeader";
import SearchResult from "./SearchResult";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    maxHeight: "100vh",
    padding: "0 16px",
    boxSizing: "border-box",
  },

  sidebarHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  sidebarMain: { height: "85vh", width: "100%", boxSizing: "border-box" },

  main: {
    height: "70vh",
    maxHeight: "70vh",
    width: "100%",
    padding: "0 8px",
    boxSizing: "border-box",
    overflowY: "scroll",
  },

  searchContainer: {
    width: "100%",
    padding: "8px",
  },

  subHeading: theme.subHeading,

  input: {
    background: "#F4F6F6",
    border: "none",
    outline: "none",
  },

  icon: {
    color: "#888",
  },
}));

export default function SidebarContainer({ toggleDrawer }) {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const classes = useStyles();
  const mainRef = useRef();
  const auth = useAuth();
  const { allConvos } = useMessenger();
  const { createSnack } = useSnack();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/?user=${input}`, {
        method: "get",
      });
      if (response.ok) {
        const data = await response.json();
        const filteredData = filterSearchResults(data.users);
        setSearchResults(filteredData);
        scrollToTop();
      } else {
        createSnack({
          message: "Something went wrong on our end",
          severity: "error",
        });
      }
    } catch (err) {}
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    searchResults && setSearchResults(null);
  };

  const scrollToTop = () => {
    mainRef.current.scrollTop = 0;
  };

  const filterConvos = (input) => {
    return allConvos.filter((c) =>
      c.users.some((user) => {
        return user?.username?.toLowerCase().includes(input.toLowerCase());
      })
    );
  };

  const filterSearchResults = (searchResults) => {
    const users = allConvos.reduce((a, b) => a.concat(b.users), []);
    return searchResults.filter(
      (user) =>
        !users.some((u) => u._id === user._id) && user._id !== auth.user._id
    );
  };

  const clearSearchResults = () => {
    setSearchResults(null);
    setInput("");
  };

  return (
    <Grid className={classes.root}>
      <Grid item className={classes.header}>
        <SidebarHeader />
      </Grid>

      <Grid container className={classes.sidebarMain}>
        {/* Search Form */}
        <form onSubmit={handleSubmit} className={classes.searchContainer}>
          <Typography variant="h6" className={classes.subHeading}>
            Chats
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search"
            fullWidth
            className={classes.input}
            onChange={handleInputChange}
            value={input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className={classes.icon} />
                </InputAdornment>
              ),
            }}
          />
        </form>

        <Grid item className={classes.main} ref={mainRef}>
          {/* Scrolling list of conversations and search Results */}
          {searchResults && (
            <>
              <Typography variant="h6" className={classes.subHeading}>
                Search Results ({searchResults?.length})
              </Typography>
              {searchResults.length ? (
                searchResults.map((user, i) => (
                  <SearchResult
                    key={user._id}
                    user={user}
                    i={i}
                    clearSearchResults={clearSearchResults}
                    toggleDrawer={toggleDrawer}
                  />
                ))
              ) : (
                <Typography variant="h6" className={classes.subHeading}>
                  No Results
                </Typography>
              )}
            </>
          )}

          {/* All conversations a user is a part of */}
          <Typography variant="h6" className={classes.subHeading}>
            Your Conversations ({allConvos?.length || 0})
          </Typography>
          {allConvos &&
            filterConvos(input).map((convo) => (
              <Conversation
                key={convo._id}
                convo={convo}
                toggleDrawer={toggleDrawer}
                clearResults={clearSearchResults}
              />
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
