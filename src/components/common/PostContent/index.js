import * as React from "react";
import { Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import "./style.scss";

const items = [
  {
    path: "images/post01.png",
  },
  {
    path: "images/post02.png",
  },
  {
    path: "images/post03.png",
  },
];

const PostContent = (props) => {
  const { item } = props;

  return (
    <>
      <Typography component="div" align="left" className="owner-container">
        <img
          src={require("images/fr-avatar.png")}
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
        {item.caption}
        <br />
        <a href="/">#abc</a>
      </Typography>
      <Typography component="div" align="center" className="post-images">
        <Carousel autoPlay={false}>
          {item.attachments.map((item, i) => (
            <img key={i} src={item.url} width="714" height="450" alt="" />
          ))}
        </Carousel>
      </Typography>
    </>
  );
};
export default PostContent;
