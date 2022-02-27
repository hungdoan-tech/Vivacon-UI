import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Carousel from "react-material-ui-carousel";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import InputBase from "@mui/material/InputBase";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import SendIcon from "@mui/icons-material/Send";
import "./style.scss";
const items = [
  {
    path: "fakeData/post01.png",
  },
  {
    path: "fakeData/post02.png",
  },
  {
    path: "fakeData/post03.png",
  },
];

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

const Post = () => {
  return (
    <Card sx={{ minWidth: 275 }} className="post-container">
      <CardContent>
        <Typography component="div" align="left" className="owner-container">
          <img
            src={require("../../fakeData/fr-avatar.png")}
            width="40"
            height="40"
            alt=""
          />
          <Typography align="left" component="div" className="right-content">
            <Typography className="owner-name">Matt</Typography>
            <Typography className="post-time">17h ago</Typography>
          </Typography>
        </Typography>
        <Typography component="div" align="left" className="post-caption">
          This is so beautiful!
          <br />
          <a href="/">#abc</a>
        </Typography>
        <Typography component="div" align="center" className="post-images">
          <Carousel autoPlay={false}>
            {items.map((item, i) => (
              <img
                key={i}
                src={require(`../../${item.path}`)}
                width="714"
                height="450"
                alt=""
              />
            ))}
          </Carousel>
        </Typography>
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
        <Typography
          component="div"
          align="left"
          className="draft-comment-container"
        >
          <img
            src={require("../../fakeData/avatar.png")}
            width="40"
            height="40"
            alt=""
          />
          <Typography className="comment-input" component="div">
            <InputBase
              placeholder="Add a comment"
              fullWidth={true}
              maxRows={10}
              multiline={true}
            />
            <Typography className="different-text-icon" component="div">
              <InsertEmoticonOutlinedIcon />
              <CameraAltOutlinedIcon />
            </Typography>
          </Typography>
          <SendIcon className="send-icon" />
        </Typography>
        <Typography className="sended-comments-container">
          {userComments.map((comment, i) => (
            <Typography className="comment-container">
              <img
                src={require(`../../${comment.avatar}`)}
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
      </CardContent>
    </Card>
  );
};

export default Post;
