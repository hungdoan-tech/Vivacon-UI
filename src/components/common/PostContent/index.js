import * as React from "react";
import { Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import "./style.scss";
import { calculateFromNow } from "utils/calcDateTime";

const PostContent = (props) => {
  const { item, handleClick, index, dataList } = props;

  return (
    <>
      <Typography component="div" align="left" className="owner-container">
        <img src={item.createdBy?.avatar} width="40" height="40" alt="" />
        <Typography align="left" component="div" className="right-content">
          <Typography className="owner-name">
            {item.createdBy?.username}
          </Typography>
          <Typography className="post-time">
            {calculateFromNow(item.createdAt)}
          </Typography>
        </Typography>
      </Typography>
      <Typography
        component="div"
        align="center"
        className="post-images"
        onClick={() => handleClick(index, item, dataList)}
      >
        <Carousel autoPlay={false} className="details-carousel">
          {item.attachments.map((item, i) => (
            <img key={i} src={item.url} alt="" />
          ))}
        </Carousel>
      </Typography>
    </>
  );
};
export default PostContent;
