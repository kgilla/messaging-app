// import React from "react";
// import {
//   Typography,
//   Hidden,
//   Paper,
//   Button,
//   makeStyles,
// } from "@material-ui/core";
// import { MoreHoriz, Menu } from "@material-ui/icons";
// import { useAuth } from "hooks/useAuth";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     height: "15vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 32px",
//     border: "none",
//     boxShadow: "0 2px 4px rgb(0 0 0 / 5%), 0 8px 16px rgb(0 0 0 / 5%)",
//   },

//   flexed: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   button: {
//     marginRight: "16px",
//   },

//   heading: {
//     fontWeight: 600,
//   },

//   moreButton: {
//     color: "#aaa",
//   },
// }));

// export default function MessengerHeader({ currentConvo, toggleDrawer }) {
//   const classes = useStyles();
//   const auth = useAuth();

//   const recipient = () => {
//     const user = currentConvo.users.filter(
//       (user) => user._id !== auth.user._id
//     );
//     return user[0].username;
//   };

//   return (
//     <Paper square variant="outlined" className={classes.root}>
//       <div className={classes.flexed}>
//         <Hidden mdUp>
//           <Button
//             variant="contained"
//             color="primary"
//             className={classes.button}
//             onClick={toggleDrawer}
//           >
//             <Menu />
//           </Button>
//         </Hidden>

//         <Typography variant="h6" className={classes.heading}>
//           {currentConvo && recipient()}
//         </Typography>
//       </div>
//       <Button className={classes.moreButton}>
//         <MoreHoriz />
//       </Button>
//     </Paper>
//   );
// }
