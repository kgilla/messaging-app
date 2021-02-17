import React, { useState } from "react";
import { Grid, Typography, TextField, makeStyles } from "@material-ui/core";
import Conversation from "./Conversation";
import SidebarHeader from "./SidebarHeader";
import Search from "./Search";
import SearchResult from "./SearchResult";
import { useAuth } from "hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0 16px",
    boxSizing: "border-box",
  },

  header: {
    height: "15vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  main: {
    height: "70vh",
    width: "100%",
    padding: "8px",
    overflowY: "scroll",
  },

  searchContainer: {
    height: "15vh",
    width: "100%",
    padding: "8px",
  },
}));

export default function Sidebar(props) {
  const { allConvos, changeConvo, currentConvo, toggleDrawer } = props;
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const classes = useStyles();
  const auth = useAuth();

  const handleInputChange = (e) => {
    setInput(e.target.value);
    searchResults && setSearchResults(null);
  };

  const createConversation = (recipient) => {
    console.log(recipient);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/users/?user=${input}`, {
      method: "get",
    });
    const data = await response.json();
    const filteredData = data.users.filter(
      (user) => user._id !== auth.user._id
    );
    console.log(filteredData);
    setSearchResults(filteredData);
  };

  const filterConvos = (input) => {
    return allConvos.filter((c) =>
      c.users.some((user) =>
        user.username.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  return (
    <Grid className={classes.root}>
      <Grid item className={classes.header}>
        <SidebarHeader />
      </Grid>
      <Grid container style={{ height: "85vh", width: "100%" }}>
        <Grid item className={classes.searchContainer}>
          <Search
            handleInputChange={handleInputChange}
            input={input}
            handleSubmit={handleSubmit}
          />
        </Grid>
        <Grid item className={classes.main}>
          {searchResults ? (
            <div>
              <Typography variant="h6">
                Search Results ({searchResults.length})
              </Typography>
              {searchResults.length ? (
                searchResults.map((result, i) => (
                  <SearchResult
                    key={result._id}
                    user={result}
                    i={i}
                    createConversation={createConversation}
                  />
                ))
              ) : (
                <Typography>No Results</Typography>
              )}
            </div>
          ) : null}
          <Typography variant="h6">Your Conversations</Typography>
          {allConvos &&
            filterConvos(input).map((convo, i) => (
              <Conversation
                key={convo._id}
                convo={convo}
                changeConvo={changeConvo}
                currentConvo={currentConvo}
                i={i}
              />
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
