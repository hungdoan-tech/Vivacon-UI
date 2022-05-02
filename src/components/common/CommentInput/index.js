import { useState, useEffect } from "react";
import { Typography, InputBase, Button } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import SendIcon from "@mui/icons-material/Send";
import "./style.scss";
import { comment } from "api/postService";

const CommentInput = ({
  postId,
  setSubmittedComment,
  hastag,
  parentCommentId = null,
}) => {
  const [commentContent, setCommentContent] = useState("");

  const handleCaptionChange = (event) => {
    setCommentContent(event.target.value);
  };

  const submitComment = () => {
    comment({
      content: commentContent,
      parentCommentId,
      postId,
    }).then((res) => {
      if (res.status === 200) {
        setSubmittedComment(res.data);
        setCommentContent("");
      }
    });
  };

  return (
    <Typography
      component="div"
      align="left"
      className="draft-comment-container"
    >
      <InsertEmoticonOutlinedIcon className="emotion-icon" />
      <Typography className="comment-input" component="div">
        <InputBase
          placeholder="Add a comment"
          fullWidth={true}
          maxRows={4}
          multiline={true}
          onChange={handleCaptionChange}
          value={commentContent}
        />{" "}
      </Typography>
      <Typography className="different-text-icon" component="div">
        <Button className="post-button" onClick={submitComment}>
          Post
        </Button>
      </Typography>
    </Typography>
  );
};
export default CommentInput;
