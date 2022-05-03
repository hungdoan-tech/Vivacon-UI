import { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import "./style.scss";
import {
  deleteComment,
  getChildCommentListByPostId,
  getFirstLevelCommentListByPostId,
} from "api/postService";
import { convertUTCtoLocalDate, calculateFromNow } from "utils/calcDateTime";
import { substringUsername } from "utils/resolveData";
import CommentInput from "components/common/CommentInput";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import _ from "lodash";
import { getCurrentUser } from "utils/jwtToken";
import CustomModal from "../CustomModal";
import useLoading from "hooks/useLoading";

const CommentList = ({
  currentPost,
  submittedComment,
  setSubmittedComment,
}) => {
  const [commentList, setCommentList] = useState([]);
  const [fetchInfo, setFetchInfo] = useState({});
  const [pageNumber, setPageNumber] = useState(0);

  const handleGetFirstLevelCommentList = (page, postId) => {
    console.log("new fetch");
    getFirstLevelCommentListByPostId({
      id: postId,
      _sort: "createdAt",
      _order: "desc",
      limit: 15,
      page,
    })
      .then((res) => {
        setFetchInfo(res.data);
        if (page !== 0) {
          if (commentList.length % 15 > 0) {
            const start = commentList.length - page * 15;
            setCommentList([
              ...commentList,
              ..._.slice(res.data.content, start, res.data.content.length),
            ]);
          } else {
            setCommentList([...commentList, ...res.data.content]);
          }
        } else {
          setCommentList(res.data.content);
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    if (submittedComment.id) {
      setCommentList([submittedComment, ...commentList]);
      setSubmittedComment({});
    }
  }, [submittedComment]);

  useEffect(() => {
    handleGetFirstLevelCommentList(pageNumber, currentPost.id);
  }, [pageNumber]);

  useEffect(() => {
    setPageNumber(0);
    handleGetFirstLevelCommentList(0, currentPost.id);
  }, [currentPost]);

  const handleViewMore = () => {
    setPageNumber(pageNumber + 1);
  };

  const handleFilterComment = (commentId) => {
    setCommentList(commentList.filter((cmt) => cmt.id !== commentId));
  };

  return (
    <>
      {commentList.length > 0 ? (
        <Typography className="sended-comments-container">
          {commentList.map((comment, i) => (
            <CommentItem
              comment={comment}
              postId={currentPost.id}
              handleFilterComment={handleFilterComment}
            />
          ))}
          {!fetchInfo.last && (
            <Typography className="view-more" onClick={handleViewMore}>
              View more comments
            </Typography>
          )}
        </Typography>
      ) : (
        <></>
      )}
    </>
  );
};

const CommentItem = ({ comment, postId, handleFilterComment }) => {
  const [createdTime, setCreatedTime] = useState(
    calculateFromNow(convertUTCtoLocalDate(comment.createdAt))
  );
  const [commentChildList, setCommentChildList] = useState({
    open: false,
    data: [],
  });
  const [total, setTotal] = useState(comment.totalChildComments);
  const [isReply, setReply] = useState({ open: false, hastag: "" });
  const [submittedComment, setSubmittedComment] = useState({});
  const [showCommentOption, setShowCommentOption] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);

  useEffect(() => {
    setCreatedTime(calculateFromNow(convertUTCtoLocalDate(comment.createdAt)));
  }, [comment.createdAt]);

  const handleGetChildCommentList = (page, limit) => {
    console.log("data in fetch: ", { page, limit });
    getChildCommentListByPostId({
      postId,
      parentCommentId: comment.id,
      _sort: "createdAt",
      _order: "desc",
      limit,
      page,
    })
      .then((res) => {
        if (res.status === 200) {
          // if(childPageNumber !== 0 ){
          let result;
          if (page > 0) {
            result = [..._.reverse(res.data.content), ...commentChildList.data];
            console.log({ result });
          } else {
            result = _.reverse(res.data.content);
          }
          console.log({ result });
          setCommentChildList({
            open: true,
            data: result.map((item) => {
              return {
                ...item,
                fromNow: calculateFromNow(
                  convertUTCtoLocalDate(item.createdAt)
                ),
              };
            }),
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleToggleCommentChild = () => {
    //Hide child list
    if (total === 0 && commentChildList.open) {
      setCommentChildList({
        ...commentChildList,
        open: false,
      });
      setTotal(commentChildList.data.length);
    } else {
      // Show all if the child list is shown before
      if (total === commentChildList.data.length && !commentChildList.open) {
        setCommentChildList({ ...commentChildList, open: true });
        setTotal(0);
      }
      // Show list child by using the page number += 1
      else {
        const tempLimit = 3 - (commentChildList.data.length % 3);
        const newPageNumber = Math.floor(commentChildList.data.length / 3);
        handleGetChildCommentList(newPageNumber, tempLimit);
        // const newTotal = (childPageNumber + 1) % 3 - length

        setTotal(total - 3 < 0 ? 0 : total - 3);
      }
    }
  };

  const handleOpenReplyCmt = (username) => {
    setReply({ open: true, hastag: `@${username}` });
  };

  useEffect(() => {
    console.log("call submit");
    if (submittedComment.id) {
      setCommentChildList({
        open: true,
        data: [
          ...commentChildList.data,
          {
            ...submittedComment,
            fromNow: calculateFromNow(
              convertUTCtoLocalDate(submittedComment.createdAt)
            ),
          },
        ],
      });
    }
  }, [submittedComment]);

  // setInterval(() => {
  //   setCreatedTime(calculateFromNow(convertUTCtoLocalDate(comment.createdAt)));
  // if (commentChildList.data.length > 0 && commentChildList.open) {
  //   setCommentChildList({
  //     ...commentChildList,
  //     data: commentChildList.data.map((item) => {
  //       return {
  //         ...item,
  //         fromNow: calculateFromNow(convertUTCtoLocalDate(item.createdAt)),
  //       };
  //     }),
  //   });
  // }
  // }, 60000);
  return (
    <Typography className="comment-container">
      <Typography
        className="comment-content"
        onMouseEnter={() => setShowCommentOption(true)}
        onMouseLeave={() => setShowCommentOption(false)}
      >
        <img
          src={
            comment.createdBy?.avatar
              ? comment.createdBy?.avatar
              : require("images/no-avatar.png")
          }
          width="35"
          height="35"
          alt=""
        />

        <Typography className="content" component="div">
          <Typography className="content-line1" component="div">
            <strong>{substringUsername(comment.createdBy?.username)}</strong>
            {"    "}
            {comment.content}
          </Typography>
          <Typography className="content-line2" component="div">
            <Typography className="date-time" component="div">
              {createdTime}
            </Typography>
            <Typography
              className="reply"
              component="div"
              onClick={() =>
                handleOpenReplyCmt(
                  substringUsername(comment.createdBy?.username)
                )
              }
            >
              Reply
            </Typography>
            {showCommentOption &&
              getCurrentUser().accountId === comment.createdBy?.id && (
                <Typography className="option" component="div">
                  <MoreHorizIcon onClick={() => setShowOptionModal(true)} />
                </Typography>
              )}
          </Typography>
        </Typography>
      </Typography>
      {(comment.totalChildComments > 0 || commentChildList.data.length > 0) && (
        <Typography
          className="view-child"
          align="left"
          onClick={handleToggleCommentChild}
        >
          {total === 0
            ? "_____Hide all replies"
            : `_____View replies (${total})`}
        </Typography>
      )}
      {commentChildList.open &&
        commentChildList.data.map((childCmt) => {
          return (
            <CommentChildItem
              childCmt={childCmt}
              handleOpenReplyCmt={handleOpenReplyCmt}
            />
          );
        })}
      {isReply.open && (
        <Typography
          className="comment-input-reply"
          component="div"
          align="left"
        >
          <CommentInput
            postId={postId}
            setSubmittedComment={setSubmittedComment}
            hastag={isReply.hastag}
            parentCommentId={comment.id}
          />
        </Typography>
      )}
      <CustomModal
        isRadius
        width={400}
        height={150}
        open={showOptionModal}
        handleCloseModal={() => setShowOptionModal(false)}
      >
        <CommentOptionModal
          commentId={comment.id}
          handleFilterComment={handleFilterComment}
          handleCloseModal={() => setShowOptionModal(false)}
        />
      </CustomModal>
    </Typography>
  );
};

const CommentChildItem = ({ childCmt, handleOpenReplyCmt }) => {
  const [showCommentOption, setShowCommentOption] = useState(false);
  return (
    <Typography
      className="comment-content child"
      onMouseEnter={() => setShowCommentOption(true)}
      onMouseLeave={() => setShowCommentOption(false)}
    >
      <img
        src={
          childCmt.createdBy?.avatar
            ? childCmt.createdBy?.avatar
            : require("images/no-avatar.png")
        }
        width="35"
        height="35"
        alt=""
      />
      <Typography className="content" component="div">
        <Typography className="content-line1" component="div">
          <strong>{substringUsername(childCmt.createdBy?.username)}</strong>
          {"    "}
          {childCmt.content}
        </Typography>
        <Typography className="content-line2" component="div">
          <Typography className="date-time" component="div">
            {childCmt.fromNow}
          </Typography>
          <Typography
            className="reply"
            component="div"
            onClick={() =>
              handleOpenReplyCmt(
                substringUsername(childCmt.createdBy?.username)
              )
            }
          >
            Reply
          </Typography>
          {showCommentOption &&
            getCurrentUser().accountId === childCmt.createdBy?.id && (
              <Typography className="option" component="div">
                <MoreHorizIcon />
              </Typography>
            )}
        </Typography>
      </Typography>
    </Typography>
  );
};

const CommentOptionModal = ({
  commentId,
  handleCloseModal,
  handleFilterComment,
}) => {
  const { setLoading } = useLoading();
  const handleDeleteComment = () => {
    deleteComment(commentId)
      .then((res) => {
        if (res.status === 200) {
          handleCloseModal();
          handleFilterComment(commentId);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {});
  };

  return (
    <Typography component="div" className="comment-option-container">
      <Typography component="div" className="action-btns">
        <Button className="report-btn" onClick={() => null}>
          Report
        </Button>
        <Button className="delete-btn" onClick={handleDeleteComment}>
          Delete
        </Button>
        <Button className="cancel-btn" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Typography>
    </Typography>
  );
};

export default CommentList;
