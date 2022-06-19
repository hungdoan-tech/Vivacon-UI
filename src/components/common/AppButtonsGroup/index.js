import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Button, Typography, ClickAwayListener, Box } from "@mui/material";
import NotificationNumber from "components/common/NotificationNumber";
import "./style.scss";
import NotificationList from "components/common/NotificationList";
import classNames from "classnames";
import { notificationType } from "constant/types";
import useSocket from "hooks/useSocket";
import _ from "lodash";

const AppButtonsGroup = (props) => {
  const [openNoti, setOpenNoti] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [changePosition, setChangePosition] = React.useState(false);
  const [numberOfNotification, setNumberOfNotification] = React.useState(0);

  const { handleOpenCreatePostModal } = props;

  const { handlers, states, setStates } = useSocket();
  const {
    receivedMessage,
    newConversation,
    activeUsers,
    conversationList,
    newNotification,
  } = states;

  const handleOpenNotificationList = () => {
    setOpenNoti(!openNoti);
    if (!openNoti) {
      setNumberOfNotification(0);
    }
    if (openMessage) {
      setChangePosition(true);
      setOpenMessage(false);
    } else {
      setChangePosition(false);
    }
  };
  const handleOpenMessageList = () => {
    setOpenMessage(!openMessage);
    if (openNoti) {
      setChangePosition(true);
      setOpenNoti(false);
    } else {
      setChangePosition(false);
    }
  };
  const notiBtnClass = classNames({
    active: openNoti,
  });
  const messageBtnClass = classNames({
    active: openMessage,
  });

  const closeNotification = () => {
    setOpenMessage(false);
    setOpenNoti(false);
  };

  React.useEffect(() => {
    if (!_.isEmpty(newNotification)) {
      setNumberOfNotification((prev) => prev + 1);
    }
  }, [newNotification]);

  const renderNotificationList = () => {
    if (openMessage) {
      return (
        <NotificationList
          type={notificationType.MESSAGE}
          changePosition={changePosition}
          closeNotification={closeNotification}
        />
      );
    }
    if (openNoti) {
      return (
        <NotificationList
          type={notificationType.NOTIFICATION}
          changePosition={changePosition}
          closeNotification={closeNotification}
        />
      );
    }
  };

  return (
    <Typography className="app-btns-container" component="div" align="center">
      <Typography component="div" className="btn-container">
        <Button onClick={handleOpenCreatePostModal}>
          <AddIcon />
        </Button>
      </Typography>
      <Typography component="div" className="btn-container">
        <Button>
          <HomeIcon />
        </Button>
      </Typography>
      <ClickAwayListener onClickAway={closeNotification}>
        <Typography component="div" className="notification-btns">
          <Typography component="div" className="btn-container">
            <Button onClick={() => null} className={messageBtnClass}>
              <NotificationNumber number={3} />
              <ChatBubbleIcon />
            </Button>
          </Typography>
          <Typography component="div" className="btn-container">
            <Button
              onClick={handleOpenNotificationList}
              className={notiBtnClass}
            >
              <NotificationNumber number={numberOfNotification} />
              <NotificationsIcon className="notification-icon" />
            </Button>
          </Typography>
          {renderNotificationList()}
        </Typography>
      </ClickAwayListener>
    </Typography>
  );
};

export default AppButtonsGroup;
