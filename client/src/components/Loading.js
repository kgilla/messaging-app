import React from "react";
import { CircularProgress, Backdrop } from "@material-ui/core";

export default function Loading() {
  return (
    <Backdrop open>
      <CircularProgress style={{ color: "#fff" }} size={100} />
    </Backdrop>
  );
}
