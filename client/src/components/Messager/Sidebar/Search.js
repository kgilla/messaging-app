import React from "react";
import {
  Typography,
  TextField,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {},

  input: {
    background: "#F4F6F6",
    border: "none",
    outline: "none",
  },

  heading: {
    margin: 0,
    padding: 0,
    fontWeight: 600,
  },

  icon: {
    color: "#888",
  },
}));

export default function Search({ input, handleInputChange, handleSubmit }) {
  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" className={classes.heading}>
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
  );
}
