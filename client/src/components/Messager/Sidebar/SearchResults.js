import React from "react";
import SearchResult from "./SearchResult";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  subHeading: theme.subHeading,
}));

export default function SearchResults(props) {
  const { searchResults, clearSearchResults, createConversation } = props;
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h6" className={classes.subHeading}>
        Search Results ({searchResults?.length})
      </Typography>
      {searchResults.length ? (
        searchResults.map((result, i) => (
          <SearchResult
            key={result._id}
            user={result}
            i={i}
            createConversation={createConversation}
            clearSearchResults={clearSearchResults}
          />
        ))
      ) : (
        <Typography variant="h6" className={classes.subHeading}>
          No Results
        </Typography>
      )}
    </div>
  );
}
