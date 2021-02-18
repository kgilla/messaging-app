import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 16,
    h1: {
      marginBottom: "16px",
      fontSize: 28,
      fontWeight: 600,
    },
  },
  palette: {
    primary: { main: "#3A8DFF" },
  },
  input: {
    margin: "12px 0",
  },

  formButton: {
    width: "100%",
    maxWidth: "150px",
    margin: "16px auto",
    padding: "16px",
    fontWeight: "700",
    textTransform: "none",
  },
});
