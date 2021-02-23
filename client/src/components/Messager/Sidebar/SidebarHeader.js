import React from "react";
import {
  Typography,
  Grid,
  Avatar,
  Badge,
  Button,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { image3 } from "images/conversationImages";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "15vh",
    margin: "4px 0",
    padding: "16px",
  },

  circle: theme.circleImage,

  username: {
    fontSize: "16px",
    fontWeight: 600,
  },

  moreButton: {
    color: "#bbb",
  },

  status: {
    width: "15px",
    height: "15px",
    border: "2px solid #fff",
    borderRadius: "100%",
    background: theme.palette.online.main,
  },
}));

export default function SidebarHeader() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.logout();
    history.push("/");
  };

  return (
    <Grid
      className={classes.root}
      container
      alignItems="center"
      justify="space-between"
    >
      <Grid item xs={10}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={3}>
            {" "}
            <Badge
              variant="dot"
              overlap="circle"
              classes={{
                badge: classes.status,
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar src={image3} className={classes.circle} />
            </Badge>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h6" className={classes.username}>
              {auth.user.username}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        {" "}
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.moreButton}
        >
          <MoreHorizIcon />
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
}
