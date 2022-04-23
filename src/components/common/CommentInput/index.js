import * as React from "react";
import { Typography, InputBase, Button } from "@mui/material";
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
      <InsertEmoticonOutlinedIcon className="emotion-icon"/>
      <Typography className="comment-input" component="div">
        <InputBase
          placeholder="Add a comment"
          fullWidth={true}
          maxRows={10}
          multiline={true}
        />{" "}
      </Typography>
      <Typography className="different-text-icon" component="div">
        <Button className="post-button">Post</Button>
      </Typography>
    </Typography>
  );
};
export default CommentInput;
