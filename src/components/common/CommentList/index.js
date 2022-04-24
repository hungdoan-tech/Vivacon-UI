import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import "./style.scss";
import { getFirstLevelCommentListByPostId } from "api/postService";
import { convertUTCtoLocalDate } from "utils/calcDateTime";
const userComments = [
  {
    username: "Matt",
    avatar: "images/fr-avatar.png",
    comment: "I love it!",
  },
  {
    username: "Riddle",
    avatar: "images/fr-avatar.png",
    comment: "So beautiful guy!!",
  },
  {
    username: "Marry",
    avatar: "images/fr-avatar.png",
    comment: "Supprise!!!!! Congratulation Bro!!!!!!!",
  },
  {
    username: "John",
    avatar: "images/fr-avatar.png",
    comment: "It is also my dream Bro! :)))",
  },
  {
    username: "Matt",
    avatar: "images/fr-avatar.png",
    comment:
      "Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v ",
  },
  {
    username: "Harry",
    avatar: "images/fr-avatar.png",
    comment: "Hmm..... :3",
  },
];

const CommentList = ({ currentPost }) => {
  const [commentList, setCommentList] = useState(userComments);
  const [pageNumber, setPageNumber] = useState(0);

  const handleGetFirstLevelCommentList = () => {
    getFirstLevelCommentListByPostId({
      id: currentPost.id,
      _sort: "createdAt",
      _order: "desc",
      limit: 15,
      page: pageNumber,
    })
      .then((res) => {
        setCommentList({
          ...res.data,
          createdAt: convertUTCtoLocalDate(res.data.createdAt),
        });
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    handleGetFirstLevelCommentList();
  }, [pageNumber]);

  const handleViewMore = () => {
    setPageNumber(pageNumber + 1);
  };

  return (
    <>
      {commentList.data?.content.length > 0 ? (
        <Typography className="sended-comments-container">
          {commentList.data.content.map((comment, i) => (
            <Typography className="comment-container">
              <img
                src={require(`../../../${comment.createdBy?.avatar}`)}
                width="35"
                height="35"
                alt=""
              />
              <Typography className="content" component="div">
                <strong>{comment.createdBy?.username}</strong>
                {"    "}
                {comment.content}
              </Typography>
            </Typography>
          ))}
          <Typography className="view-more" onClick={handleViewMore}>
            View more comments
          </Typography>
        </Typography>
      ) : (
        <></>
      )}
    </>
  );
};
export default CommentList;
