import { Typography } from "@mui/material";
import classNames from "classnames";
import * as React from "react";
import { notificationType } from "constant/types";
import "./style.scss";

const NotificationDetail = ({ item, type }) => {
  const renderNotificationContent = (item) => {
    let activityText;
    if (item.type === "POST") {
      activityText = ` posted ${item.numberOfImages} ${
        item.numberOfImages > 1 ? " new images" : " new image"
      }`;
    }

    if (item.type === "LIKED") {
      activityText = " liked your post";
    }
    if (item.type === "COMMENTED") {
      activityText = " commented your post";
    }
    if (item.type === "FOLLOWED") {
      activityText = " followed you";
    }
    return (
      <Typography component="div">
        <Typography component="div" className="notification-activity">
          <p><strong>{item.ownerName}</strong> {activityText}</p>
        </Typography>
        <Typography className={fromNowClassName}>
          {item.fromNow}
        </Typography>
      </Typography>
    );
  };

  const renderMessageContent = (item) => {
    return (
      <Typography component="div">
        <strong>{item.ownerName}</strong>
        <Typography component="div" className="message-activity">
          <Typography className="message-content">
            {item.isYourNewestMessage ? "You: " : `${item.ownerName}: `}{" "}
            {item.newestMessage}
          </Typography>
          <Typography
            className={fromNowClassName}
          >
            {item.fromNow}
          </Typography>
        </Typography>
      </Typography>
    );
  };
  const fromNowClassName = classNames("date-time", {
    "notification-from-now": type === notificationType.NOTIFICATION,
    "messages-from-now": type === notificationType.MESSAGE,
  });
  return (
    <Typography component="div" className="notification-container">
      <Typography component="div" className="present-image">
        <img src={require(`../../../${item.avatar}`)} width="50" height="50" />
      </Typography>
      <Typography component="div" className="notification-content" align="left">
        <Typography component="div" className="owner-activity">
          {type === notificationType.NOTIFICATION
            ? renderNotificationContent(item)
            : renderMessageContent(item)}
        </Typography>
      </Typography>
      {!item.seen && (
        <Typography component="div" className="seen-dot"></Typography>
      )}
    </Typography>
  );
};
export default NotificationDetail;
