import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 16,
    h1: {
      fontSize: 28,
      fontWeight: 600,
    },
  },
  palette: {
    primary: { main: "#3A8DFF" },
  },
});
