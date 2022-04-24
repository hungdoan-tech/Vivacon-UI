import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./style.scss";
import { likePost, unlikePost } from "api/postService";

const Interaction = ({ currentPost, setCurrentPost }) => {
  const { isLiked, id: postId } = currentPost;
  console.log({currentPost})
  const [like, setLike] = useState(isLiked);
  const [id, setId] = useState(postId);

  useEffect(() => {
    setLike(isLiked);
  }, [currentPost]);

  useEffect(() => {
    setId(postId);
  }, [currentPost]);

  const handleLikePost = () => {
    likePost(id).then((res) => {
      if (res.status === 200) {
        setLike(true);
      }
    });
  };

  const handleUnlikePost = () => {
    unlikePost(id).then((res) => {
      if (res.status === 200) {
        setLike(false);
      }
    });
  };
  return (
    <>
      <Typography
        component="div"
        align="left"
        className="interaction-container"
      >
        {like ? (
          <FavoriteIcon className="like-icon" onClick={handleUnlikePost} />
        ) : (
          <FavoriteBorderIcon
            className="unlike-icon"
            onClick={handleLikePost}
          />
        )}
        <ChatBubbleOutlineOutlinedIcon className="comment-icon" />
        <ShareOutlinedIcon className="share-icon" />
      </Typography>
      <Typography className="number-of-likes" align="left">
        100 likes
      </Typography>
    </>
  );
};

export default Interaction;
