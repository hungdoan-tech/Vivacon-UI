import * as React from "react";
import { Typography, InputBase } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import SendIcon from "@mui/icons-material/Send";
import "./style.scss";

const CommentInput = () => {
  return (
    <Typography
      component="div"
      align="left"
      className="draft-comment-container"
    >
      <img
        src={require("../../../fakeData/avatar.png")}
        width="40"
        height="40"
        alt=""
      />
      <Typography className="comment-input" component="div">
        <InputBase
          placeholder="Add a comment"
          fullWidth={true}
          maxRows={10}
          multiline={true}
        />
        <Typography className="different-text-icon" component="div">
          <InsertEmoticonOutlinedIcon />
          <CameraAltOutlinedIcon />
        </Typography>
      </Typography>
      <SendIcon className="send-icon" />
    </Typography>
  );
};
export default CommentInput;
