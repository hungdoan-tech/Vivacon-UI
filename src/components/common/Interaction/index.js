import * as React from "react";
import { Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import "./style.scss";

const Interaction = () => {
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
        <a href="/">100 likes</a>
      </Typography>
    </>
  );
};

export default Interaction;
