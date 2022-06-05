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
import Interaction from "../Interaction";
import { calculateFromNow, convertUTCtoLocalDate } from "utils/calcDateTime";
import CommentList from "../CommentList";
import { substringUsername } from "utils/resolveData";
import { useHistory } from "react-router-dom";
import CustomPopUp from "../CustomPopUp";
import { PopUpContent } from "components/pages/ProfilePage";

const PostDetailsModal = ({ index, dataList }) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [currentPost, setCurrentPost] = useState({});
  const [showPopUp, setShowPopUp] = useState({
    open: false,
    id: -1,
    showInImage: false,
  });
  const [submittedComment, setSubmittedComment] = useState({});

  const history = useHistory();
  const handleGetPostDetail = () => {
    getPostDetail({
      id: dataList[currentIndex]?.id,
      _sort: "createdAt",
      _order: "desc",
    }).then((res) => {
      setCurrentPost({
        ...res.data,
        lastModifiedAt: convertUTCtoLocalDate(res.data.lastModifiedAt),
      });
    });
  };

  const navigateToUser = (username) => {
    history.push(`/profile/${username}`);
  };
  const handleOpenPopUp = (id, showInImage) => {
    setShowPopUp({
      open: true,
      id,
      showInImage,
    });
  };

  const handleClosePopUp = () => {
    setShowPopUp({
      open: false,
      id: -1,
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
    <>
      {currentPost.id ? (
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
            <Typography component="div" className="details-top-content">
              <Typography component="div" className="interaction-line1">
                <img
                  src={currentPost.createdBy?.avatar}
                  width={35}
                  height={35}
                />
                <Typography
                  className="owner-name"
                  component="div"
                  onMouseEnter={() =>
                    handleOpenPopUp(currentPost.createdBy?.id, false)
                  }
                  onMouseLeave={handleClosePopUp}
                >
                  <Typography
                    className="username"
                    onClick={() =>
                      navigateToUser(currentPost.createdBy?.username)
                    }
                  >
                    {substringUsername(currentPost.createdBy?.username)}
                  </Typography>
                  {/* {showPopUp.open &&
                    showPopUp.id === currentPost.createdBy?.id &&
                    !showPopUp.showInImage && (
                      <CustomPopUp
                        width={390}
                        height={350}
                        component={() => (
                          <PopUpContent
                            username={currentPost.createdBy?.username}
                            setUpdatedItem={setUpdatedItem}
                          />
                        )}
                      />
                    )} */}
                </Typography>
                {/* {getCurrentUser().username !==
                  currentPost.createdBy?.username && (
                  <Typography className="owner-follow">
                    <FollowButton
                      userProfile={currentPost.createdBy}
                      follow={currentPost.createdBy?.isFollowing}
                      setUpdatedItem={setUpdatedItem}
                    />
                  </Typography>
                )} */}
              </Typography>
              <Typography component="div" className="interaction-line2">
                <CommentList
                  currentPost={currentPost}
                  submittedComment={submittedComment}
                  setSubmittedComment={setSubmittedComment}

                />
              </Typography>
            </Typography>
            <Typography component="div" className="details-bottom-content">
              <Typography component="div" className="interaction-line3">
                <Interaction
                  currentPost={currentPost}
                  setCurrentPost={setCurrentPost}
                />
                <Typography className="post-time-fromnow" align="left">
                  {calculateFromNow(currentPost.lastModifiedAt)}
                </Typography>
              </Typography>
              <Typography component="div" className="interaction-line4">
                <CommentInput
                  postId={currentPost.id}
                  setSubmittedComment={setSubmittedComment}
                />
              </Typography>
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
      ) : (
        <></>
      )}
    </>
  );
};

export default PostDetailsModal;
