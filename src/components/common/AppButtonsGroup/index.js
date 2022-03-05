import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Button, Typography } from "@mui/material";
import NotificationNumber from "../NotificationNumber";
import "./style.scss";
import NotificationList from "../NotificationList";
import classNames from "classnames";

const AppButtonsGroup = () => {
  const [openNoti, setOpenNoti] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const handleOpenNotificationList = () => {
    setOpenNoti(!openNoti);
    if (openMessage) {
      setOpenMessage(false);
    }
  };
  const handleOpenMessageList = () => {
    setOpenMessage(!openMessage);
    if (openNoti) {
      setOpenNoti(false);
    }
  };
  const notiBtnClass = classNames({
    'active': openNoti,
  });
  const messageBtnClass = classNames({
    'active': openMessage,
  });
  return (
    <Typography className="app-btns-container" component="div" align="center">
      <Typography component="div" className="btn-container">
        <Button>
          <AddIcon />
        </Button>
      </Typography>
      <Typography component="div" className="btn-container">
        <Button>
          <HomeIcon />
        </Button>
      </Typography>
      <Typography component="div" className="btn-container">
        <Button onClick={handleOpenMessageList} className={messageBtnClass}>
          <NotificationNumber number={3} />
          <ChatBubbleIcon />
        </Button>
        {openMessage && <NotificationList type="MESSAGE" />}
      </Typography>
      <Typography component="div" className="btn-container">
        <Button onClick={handleOpenNotificationList} className={notiBtnClass}>
          <NotificationNumber number={100} />
          <NotificationsIcon className="notification-icon" />
        </Button>
        {openNoti && <NotificationList type="NOTIFICATION" />}
      </Typography>
    </Typography>
  );
};

export default AppButtonsGroup;
