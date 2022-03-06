import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Button, Typography, ClickAwayListener, Box } from "@mui/material";
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
    active: openNoti,
  });
  const messageBtnClass = classNames({
    active: openMessage,
  });
  const handleClickAwayMessage = () => {
    setOpenMessage(false);
  };
  const handleClickAwayNoti = () => {
    setOpenNoti(false);
  }
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
        <ClickAwayListener onClickAway={handleClickAwayMessage}>
          <Box sx={{ position: "relative" }}>
            <Button onClick={handleOpenMessageList} className={messageBtnClass}>
              <NotificationNumber number={3} />
              <ChatBubbleIcon />
            </Button>
            {openMessage && <NotificationList type="MESSAGE" />}
          </Box>
        </ClickAwayListener>
      </Typography>
      <Typography component="div" className="btn-container">
        <ClickAwayListener onClickAway={handleClickAwayNoti}>
          <Box sx={{ position: "relative" }}>
            <Button
              onClick={handleOpenNotificationList}
              className={notiBtnClass}
            >
              <NotificationNumber number={100} />
              <NotificationsIcon className="notification-icon" />
            </Button>
            {openNoti && <NotificationList type="NOTIFICATION" />}
          </Box>
        </ClickAwayListener>
      </Typography>
    </Typography>
  );
};

export default AppButtonsGroup;
