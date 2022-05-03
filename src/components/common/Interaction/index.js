import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./style.scss";
import { getLikeListByPostId, likePost, unlikePost } from "api/postService";
import _ from "lodash";
import CustomModal from "../CustomModal";
import FollowUserItem from "../FollowUserItem";

const Interaction = ({ currentPost }) => {
  const { isLiked, id: postId } = currentPost;
  const [like, setLike] = useState(isLiked);
  const [id, setId] = useState(postId);
  const [likeCount, setLikeCount] = useState(currentPost.likeCount);
  const [pageNumber, setPageNumber] = useState(0);
  const [showLikeList, setShowLikeList] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [fetchInfo, setFetchInfo] = useState({});

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
        setLikeCount(likeCount + 1);
      }
    });
  };

  const handleUnlikePost = () => {
    unlikePost(id).then((res) => {
      if (res.status === 200) {
        setLike(false);
        setLikeCount(likeCount - 1);
      }
    });
  };

  const handleGetLikeList = () => {
    getLikeListByPostId({
      postId,
      // _sort: "username",
      _order: "desc",
      limit: 15,
      page: pageNumber,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("like list: ", res.data);
          if (!showLikeList) {
            setShowLikeList(true);
          }
          if (pageNumber > 0) {
            setLikeList([...likeList, ...res.data.content]);
            // likeList.push(res.data.content)
          } else {
            setLikeList([...res.data.content]);
          }
          setFetchInfo(res.data);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (pageNumber > 0) {
      handleGetLikeList();
    }
  }, [pageNumber]);

  const handleCloseLikeListModal = () => {
    setShowLikeList(false);
    setLikeList([]);
    setPageNumber(0);
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
      <Typography
        className="number-of-likes"
        align="left"
        onClick={handleGetLikeList}
      >
        {likeCount} {likeCount > 1 ? " likes" : "like"}
      </Typography>
      <Typography className="post-caption" align="left">
        <strong>{currentPost.createdBy?.username}</strong> {currentPost.caption}
      </Typography>
      <CustomModal
        isRadius
        open={showLikeList}
        title={_.startCase(_.toLower("LIKES"))}
        handleCloseModal={handleCloseLikeListModal}
        width={400}
        height={400}
      >
         <Typography component="div" className="follow-container">
            <Typography className="follow-list">
              {likeList.length > 0 &&
                likeList.map((user) => {
                  return (
                    <FollowUserItem
                      user={user}
                      handleCloseModal={handleCloseLikeListModal}
                    />
                  );
                })}
              {!fetchInfo.last && (
                <Typography
                  className="view-more"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  View more
                </Typography>
              )}
            </Typography>
          </Typography>
      </CustomModal>
    </>
  );
};

export default Interaction;
