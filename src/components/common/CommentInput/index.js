import { useState } from "react";
import { Typography, InputBase, Button } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import SendIcon from "@mui/icons-material/Send";
import "./style.scss";
import { comment } from "api/postService";
import { useTranslation } from "react-i18next";

const CommentInput = ({ postId, setSubmittedComment }) => {
  const [commentContent, setCommentContent] = useState("");

  const { t: trans } = useTranslation();

  const handleCaptionChange = (event) => {
    setCommentContent(event.target.value);
  };

  const submitComment = () => {
    comment({
      content: commentContent,
      parentCommentId: null,
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
          placeholder={trans("newFeed.addComment")}
          fullWidth={true}
          maxRows={4}
          multiline={true}
          onChange={handleCaptionChange}
          value={commentContent}
        />{" "}
      </Typography>
      <Typography className="different-text-icon" component="div">
        <Button className="post-button" onClick={submitComment}>
          {trans("newFeed.post")}
        </Button>
      </Typography>
    </Typography>
  );
};
export default CommentInput;
