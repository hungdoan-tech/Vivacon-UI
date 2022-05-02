import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import "./style.scss";
import {
  getChildCommentListByPostId,
  getFirstLevelCommentListByPostId,
} from "api/postService";
import { convertUTCtoLocalDate, calculateFromNow } from "utils/calcDateTime";
import { substringUsername } from "utils/resolveData";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const CommentList = ({
  currentPost,
  submittedComment,
  setSubmittedComment,
}) => {
  const [commentList, setCommentList] = useState([]);
  const [fetchInfo, setFetchInfo] = useState({});
  const [pageNumber, setPageNumber] = useState(0);

  const { t: trans } = useTranslation();

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

  return (
    <>
      {commentList.length > 0 ? (
        <Typography className="sended-comments-container">
          {commentList.map((comment, i) => (
            <CommentItem comment={comment} postId={currentPost.id} />
          ))}
          {!fetchInfo.last && (
            <Typography className="view-more" onClick={handleViewMore}>
              {trans("newFeed.viewMoreComment")}
            </Typography>
          )}
        </Typography>
      ) : (
        <></>
      )}
    </>
  );
};

const CommentItem = ({ comment, postId }) => {
  const [createdTime, setCreatedTime] = useState(
    calculateFromNow(convertUTCtoLocalDate(comment.createdAt))
  );
  const [commentChildList, setCommentChildList] = useState({
    open: false,
    data: [],
  });
  const [childPageNumber, setChildPageNumber] = useState(0);
  const [total, setTotal] = useState(comment.totalChildComments);

  const { t: trans } = useTranslation();

  const handleGetChildCommentList = (page) => {
    getChildCommentListByPostId({
      postId,
      parentCommentId: comment.id,
      _sort: "createdAt",
      _order: "desc",
      limit: 3,
      page,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log({ page });
          let result;
          if (page > 0) {
            console.log("page > 0");
            result = [..._.reverse(res.data.content), ...commentChildList.data];
            console.log({ result });
          } else {
            result = _.reverse(res.data.content);
          }
          console.log({ result });
          setCommentChildList({
            open: true,
            data: result,
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleToggleCommentChild = () => {
    if (total === 0) {
      setCommentChildList({
        ...commentChildList,
        open: false,
      });
      setTotal(comment.totalChildComments);
      setChildPageNumber(0);
    } else {
      if (
        total === comment.totalChildComments &&
        commentChildList.data.length > 0
      ) {
        setCommentChildList({ ...commentChildList, open: true });
        setTotal(0);
      } else {
        handleGetChildCommentList(childPageNumber);
        setTotal(total - 3 < 0 ? 0 : total - 3);
        setChildPageNumber(childPageNumber + 1);
      }
    }
  };

  setInterval(() => {
    setCreatedTime(calculateFromNow(convertUTCtoLocalDate(comment.createdAt)));
  }, 60000);
  return (
    <Typography className="comment-container">
      <Typography className="comment-content">
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
            <Typography className="reply" component="div">
              {trans("newFeed.reply")}
            </Typography>
          </Typography>
        </Typography>
      </Typography>
      {comment.totalChildComments > 0 && (
        <Typography
          className="view-child"
          align="left"
          onClick={handleToggleCommentChild}
        >
          {total === 0
            ? "_____" + trans("newFeed.hideReply")
            : `_____${trans("newFeed.viewReply")} (${total})`}
        </Typography>
      )}
      {commentChildList.open &&
        commentChildList.data.map((childCmt) => {
          return (
            <Typography className="comment-content child">
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
                  <strong>
                    {substringUsername(childCmt.createdBy?.username)}
                  </strong>
                  {"    "}
                  {childCmt.content}
                </Typography>
                <Typography className="content-line2" component="div">
                  <Typography className="date-time" component="div">
                    {createdTime}
                  </Typography>
                  <Typography className="reply" component="div">
                    {trans("newFeed.reply")}
                  </Typography>
                </Typography>
              </Typography>
            </Typography>
          );
        })}
    </Typography>
  );
};
export default CommentList;
