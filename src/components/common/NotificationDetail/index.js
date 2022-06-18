import { Typography } from "@mui/material";
import classNames from "classnames";
import * as React from "react";
import { notificationStatus, notificationsType } from "constant/types";
import { calculateFromNow } from "utils/calcDateTime";
import "./style.scss";
import { useHistory } from "react-router-dom";

const NotificationDetail = ({ item, type, childProps }) => {
  const { closeNotification } = childProps;
  const history = useHistory();
  const handleClickNotificationItem = () => {
    if (item.type !== notificationsType.FOLLOWING_ON_ME) {
      history.push(`/post/${item.presentationId}`);
    } else {
      history.push(`/profile/${item.actionAuthor.username}`);
    }
    closeNotification();
  };

  const renderNotificationContent = (item) => {
    const actionAuthor = item?.actionAuthor.fullName;
    return (
      <>
        <Typography component="div" className="present-image">
          <img src={item.actionAuthor.avatar} width="50" height="50" />
        </Typography>
        <Typography
          component="div"
          className="notification-content"
          align="left"
        >
          <Typography component="div" className="owner-activity">
            <Typography component="div" className="notification-activity">
              <p>
                <strong>{actionAuthor}</strong>{" "}
                {item.content.split(actionAuthor)[1]}
              </p>
            </Typography>
            <Typography className="notification-from-now">
              {calculateFromNow(new Date(item.timestamp))}
            </Typography>
          </Typography>
        </Typography>
        <Typography component="div" className="noti-in-post">
          {item.type !== notificationsType.FOLLOWING_ON_ME && (
            <img src={item.domainImage} width="50" height="50" />
          )}
        </Typography>
        {item.status !== notificationStatus.SEEN && (
          <Typography component="div" className="seen-dot"></Typography>
        )}
      </>
    );
  };

  const renderMessageContent = (item) => {
    return (
      <Typography component="div">
        {/* <strong>{item.ownerName}</strong>
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
        </Typography> */}
      </Typography>
    );
  };
  // const fromNowClassName = classNames("date-time", {
  //   "notification-from-now": type === notificationType.NOTIFICATION,
  //   "messages-from-now": type === notificationType.MESSAGE,
  // });
  return (
    <Typography
      component="div"
      className="notification-container"
      onClick={handleClickNotificationItem}
    >
      {renderNotificationContent(item)}
    </Typography>
  );
};
export default NotificationDetail;
