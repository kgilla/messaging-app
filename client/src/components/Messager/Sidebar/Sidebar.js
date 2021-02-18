import React, { useState } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import Conversation from "./Conversation";
import SidebarHeader from "./SidebarHeader";
import Search from "./Search";
import SearchResults from "./SearchResults";
import { useAuth } from "hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0 16px",
    boxSizing: "border-box",
  },

  sidebarHeader: {
    height: "15vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  sidebarMain: { height: "85vh", width: "100%" },

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

  subHeading: theme.subHeading,
}));

export default function Sidebar(props) {
  const { allConvos, changeConvo, currentConvo, createConversation } = props;

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const classes = useStyles();
  const auth = useAuth();

  const handleInputChange = (e) => {
    setInput(e.target.value);
    searchResults && setSearchResults(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/?user=${input}`, {
        method: "get",
      });
      if (response.ok) {
        const data = await response.json();
        const filteredData = data.users.filter(
          (user) => user._id !== auth.user._id
        );
        setSearchResults(filteredData);
      }
    } catch (err) {}
  };

  const filterConvos = (input) => {
    return allConvos.filter((c) =>
      c.users.some((user) =>
        user.username.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const clearSearchResults = () => {
    setSearchResults(null);
  };

  return (
    <Grid className={classes.root}>
      <Grid item className={classes.header}>
        <SidebarHeader />
      </Grid>

      <Grid container className={classes.sidebarMain}>
        <Grid item className={classes.searchContainer}>
          <Search
            handleInputChange={handleInputChange}
            input={input}
            handleSubmit={handleSubmit}
          />
        </Grid>

        <Grid item className={classes.main}>
          {searchResults && (
            <SearchResults
              searchResults={searchResults}
              clearSearchResults={clearSearchResults}
              createConversation={createConversation}
            />
          )}

          <Typography variant="h6" className={classes.subHeading}>
            Your Conversations ({allConvos?.length})
          </Typography>
          {allConvos &&
            filterConvos(input).map((convo) => (
              <Conversation
                key={convo._id}
                convo={convo}
                changeConvo={changeConvo}
                currentConvo={currentConvo}
              />
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
