import * as React from "react";
import { Typography } from "@mui/material";
import "./style.scss";
const userComments = [
  {
    username: "Matt",
    avatar: "fakeData/fr-avatar.png",
    comment: "I love it!",
  },
  {
    username: "Riddle",
    avatar: "fakeData/fr-avatar.png",
    comment: "So beautiful guy!!",
  },
  {
    username: "Marry",
    avatar: "fakeData/fr-avatar.png",
    comment: "Supprise!!!!! Congratulation Bro!!!!!!!",
  },
  {
    username: "John",
    avatar: "fakeData/fr-avatar.png",
    comment: "It is also my dream Bro! :)))",
  },
  {
    username: "Matt",
    avatar: "fakeData/fr-avatar.png",
    comment:
      "Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v Powerful! Guy :v ",
  },
  {
    username: "Harry",
    avatar: "fakeData/fr-avatar.png",
    comment: "Hmm..... :3",
  },
];

const CommentList = () => {
  return (
    <Typography className="sended-comments-container">
      {userComments.map((comment, i) => (
        <Typography className="comment-container">
          <img
            src={require(`../../../${comment.avatar}`)}
            width="40"
            height="40"
            alt=""
          />
          <Typography className="content" component="div">
            {comment.comment}
          </Typography>
        </Typography>
      ))}
      <Typography className="view-more" component="a">
        <a href="/">View more comments </a>
      </Typography>
    </Typography>
  );
};
export default CommentList;
