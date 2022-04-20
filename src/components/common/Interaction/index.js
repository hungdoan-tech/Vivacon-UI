import * as React from "react";
import { Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import "./style.scss";

const Interaction = (props) => {
  const { item } = props;

  return (
    <>
      <Typography
        component="div"
        align="left"
        className="interaction-container"
      >
        <FavoriteIcon className="like-icon" />
        <ChatBubbleOutlineOutlinedIcon className="comment-icon" />
        <ShareOutlinedIcon className="share-icon" />
      </Typography>
      <Typography className="number-of-likes" component="a">
        <a href="/">{item.likeCount} likes</a>
      </Typography>
      <Typography className="number-of-likes" component="a">
        <a href="/">{item.commentCount} likes</a>
      </Typography>
    </>
  );
};

export default Interaction;
