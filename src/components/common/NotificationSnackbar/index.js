import { useState } from "react";
import { Snackbar } from "@mui/material";
import "./style.scss";

const NotificationSnackbar = (props) => {
  const { open, content } = props.snackbarState;
  const vertical = "top";
  const horizontal = "center";
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message={content}
        key={vertical + horizontal}
      />
    </div>
  );
};

export default NotificationSnackbar;
