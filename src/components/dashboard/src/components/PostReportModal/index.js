import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./style.scss";
import { getPostDetail } from "api/postService";
import Carousel from "react-material-ui-carousel";

import CommentInput from "../../../../common/CommentInput";

import Interaction from "../../../../common/Interaction";
import { calculateFromNow, convertUTCtoLocalDate } from "utils/calcDateTime";
import CommentList from "../../../../common/CommentList";
import { substringUsername } from "utils/resolveData";
import { useHistory } from "react-router-dom";

import CustomModal from "../../../../common/CustomModal";
import { reportContent } from "../../../../../constant/types";
import InfoIcon from "@mui/icons-material/Info";
import {
  createPostReport,
  getDetailCommentReport,
} from "../../../../../api/reportService";
import useSnackbar from "../../../../../hooks/useSnackbar";
import { AuthUser } from "App";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const PostReportModal = ({ index, dataList, title, reportId }) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [currentPost, setCurrentPost] = useState({});
  const [showPopUp, setShowPopUp] = useState({
    open: false,
    id: -1,
    showInImage: false,
  });

  const [unfollowModal, setUnfollowModal] = useState({
    open: false,
    data: {},
  });

  const [toolTipContent, setToolTipContent] = useState(title);

  const [currentReportID, setCurrentReportID] = useState(reportId);

  const Auth = useContext(AuthUser);

  const [stepValue, setStepValue] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const { setSnackbarState } = useSnackbar();

  const [submittedComment, setSubmittedComment] = useState({});

  const [commentReport, setCommentReport] = useState({});

  const history = useHistory();
  const handleGetPostDetail = () => {
    getPostDetail({
      id: dataList[currentIndex]?.id,
      _sort: "createdAt",
      _order: "desc",
    }).then((res) => {
      console.log(
        convertUTCtoLocalDate(res.data.lastModifiedAt),
        res.data.lastModifiedAt
      );
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

  useEffect(() => {
    setToolTipContent(title);
  }, [title]);

  useEffect(() => {
    setCurrentReportID(reportId);
  }, [reportId]);

  useEffect(() => {
    getDetailCommentReport(currentReportID).then((res) =>
      setCommentReport(res.data)
    );
  }, [currentReportID]);

  const handleIncreaseIndex = () => {
    setCurrentIndex(currentIndex + 1);
    setCurrentReportID(dataList[currentIndex + 1].id);
    setToolTipContent(title);
  };

  const handleDecreaseIndex = () => {
    setCurrentIndex(currentIndex - 1);
    setCurrentReportID(dataList[currentIndex - 1].id);
    setToolTipContent(title);
  };

  const handleOpenUnfollowModal = (userInfo) => {
    setIsShow(true);
    setUnfollowModal({
      open: true,
      data: userInfo,
    });
  };

  const handleCloseUnfollowModal = () => {
    setIsShow(false);
    setUnfollowModal({ ...unfollowModal, open: false });
    setStepValue(0);
  };

  const handleCreateReport = (id, item) => {
    const reportData = {
      content: item.content,
      sentitiveType: item.sentitiveType,
      commentId: id,
    };
    handleNextStep();
    // createPostReport(reportData)
    //   .then((res) => {
    //     if (res.status === 200) {
    //       setSnackbarState({
    //         open: true,
    //         content: "You have reported successfully",
    //         type: "SUCCESS",
    //       });
    //       handleNextStep();
    //     }
    //   })
    //   .catch((err) => {
    //     throw err;
    //   })
    //   .finally(() => {
    //     // setLocalLoading(false);
    //   });
  };

  const handleNextStep = () => {
    setStepValue(stepValue + 1);
  };
  const handlePrevStep = () => {
    setStepValue(stepValue - 1);
  };

  const StepOne = () => {
    return (
      <CustomModal
        isRadius
        width={400}
        height={300}
        title="Why do you report this port?"
        open={unfollowModal.open}
        handleCloseModal={handleCloseUnfollowModal}
      >
        {reportContent.map((item, index) => (
          <p onClick={() => handleCreateReport(currentPost?.id, item)}>
            {item.content}
          </p>
        ))}
      </CustomModal>
    );
  };

  const StepTwo = (post) => {
    return (
      <CustomModal
        isRadius
        width={400}
        height={300}
        title="Cảm ơn bạn đã cho chúng tôi biết"
        open={unfollowModal.open}
        handleCloseModal={handleCloseUnfollowModal}
      >
        <>
          <IconButton>
            <InfoIcon />
          </IconButton>
          <div>Block</div>
          {post && post?.createdBy?.isFollowing ? <div>Unfollow</div> : null}

          <div>View More</div>
          <div onClick={handleCloseUnfollowModal}>Close</div>
        </>
      </CustomModal>
    );
  };

  return (
    <>
      <Tooltip
        title={commentReport.content + " " + commentReport.sentitiveType}
      >
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>
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
                  commentReport={commentReport}
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

          {isShow && isShow ? (
            <>
              <TabPanel value={stepValue} index={0}>
                {StepOne()}
              </TabPanel>
              <TabPanel value={stepValue} index={1}>
                {StepTwo(currentPost)}
              </TabPanel>
            </>
          ) : null}
        </Typography>
      ) : (
        <></>
      )}
    </>
  );
};

export default PostReportModal;
