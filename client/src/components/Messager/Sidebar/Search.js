import React from "react";
import { Grid, Typography, TextField, makeStyles } from "@material-ui/core";

export default function Search({ input, handleInputChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <Typography
        variant="h6"
        style={{ margin: "0", padding: "0", fontWeight: 600 }}
      >
        Chats
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search"
        fullWidth
        style={{ background: "#ddd", border: "none", outline: "none" }}
        onChange={handleInputChange}
        value={input}
      />
    </form>
  );
}
