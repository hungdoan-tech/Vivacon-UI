import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./style.scss";
import { getPostDetail } from "api/postService";
import Carousel from "react-material-ui-carousel";
import { getCurrentUser } from "utils/jwtToken";
import CommentInput from "../CommentInput";
import FollowButton from "../FollowButton";

const PostDetailsModal = ({
  index,
  item,
  dataList,
  setUpdatedItem,
  updatedItem,
}) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [currentPost, setCurrentPost] = useState({});
  const handleGetPostDetail = () => {
    getPostDetail({
      id: dataList[currentIndex]?.id,
      _sort: "createdAt",
      _order: "desc",
    }).then((res) => {
      setCurrentPost(res.data);
    });
  };
  useEffect(() => {
    handleGetPostDetail();
  }, [currentIndex]);

  const handleIncreaseIndex = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleDecreaseIndex = () => {
    setCurrentIndex(currentIndex - 1);
  };

  return (
    <Typography component="div" className="post-details-container">
      {currentIndex > 0 && (
        <div className="minus-post-index">
          <Button onClick={handleDecreaseIndex}>
            <ChevronLeftIcon className="icon" />
          </Button>
        </div>
      )}
      <Typography component="div" className="post-details-carousel">
        <Carousel autoPlay={false} className="details-carousel">
          {currentPost.attachments?.map((item, i) => (
            <img key={i} src={item.url} alt="" />
          ))}
        </Carousel>
      </Typography>

      <Typography component="div" className="post-details-interation">
        <Typography component="div" className="interaction-line1">
          <img src={currentPost.createdBy?.avatar} width={35} height={35} />
          <Typography className="owner-name">
            {currentPost.createdBy?.username}
          </Typography>
          {getCurrentUser().username !== currentPost.createdBy?.username && (
            <Typography className="owner-follow">
              <FollowButton
                userProfile={currentPost.createdBy}
                follow={currentPost.createdBy?.isFollowing}
                setUpdatedItem={setUpdatedItem}
              />
            </Typography>
          )}
        </Typography>
        <Typography component="div" className="interaction-line2"></Typography>
        <Typography component="div" className="interaction-line3"></Typography>
        <Typography component="div" className="interaction-line4">
          <CommentInput />
        </Typography>
      </Typography>

      {currentIndex < dataList.length - 1 && (
        <div className="plus-post-index">
          <Button onClick={handleIncreaseIndex}>
            <ChevronRightIcon className="icon" />
          </Button>
        </div>
      )}
    </Typography>
  );
};

export default PostDetailsModal;
