import { Typography, Card, CardContent, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { calculateFromNow } from "utils/calcDateTime";
import NotificationDetail from "components/common/NotificationDetail";
import { notificationType } from "constant/types";
import "./style.scss";
import classNames from "classnames";
import InfiniteList from "components/common/InfiniteList";
import { getNotificationList } from "api/notificationService";
import useSocket from "hooks/useSocket";

const NotificationList = ({ type, changePosition, closeNotification }) => {
  const [isAll, setAll] = useState(true);
  const [parentDataList, setParentDataList] = useState([]);

  const { handlers, states, setStates } = useSocket();
  const { receivedMessage, newConversation, activeUsers, conversationList, newNotification } =
    states;
  const {
    setReceivedMessage,
    setNewConversation,
    setActiveUsers,
    setConversationList,
  } = setStates;
  const {
    chatInExistedConversation,
    chatInVirtualConversation,
    typing,
    untyping,
  } = handlers;

  useEffect(() => {
    // const initData = initalData(type);
    setAll(true);
  }, [type]);

  useEffect(() => {
    // if (!isAll) {
    //   setData(data.filter((item) => item.seen === false));
    // } else {
    //   setData(initalData(type));
    // }
  }, [isAll]);

  useEffect(() => {
    console.log({newNotification111: newNotification})
  }, [newNotification])

  const handleFilterChange = () => {
    setAll(!isAll);
  };

  const positionClass = classNames({
    right: type === notificationType.NOTIFICATION,
    left: type === notificationType.MESSAGE,
  });

  const changePositionClass = classNames({
    "animation-change": changePosition === true,
  });

  return (
    <Typography
      component="div"
      className={`notification-list-container ${positionClass} ${changePositionClass}`}
    >
      <Card
        sx={{ minWidth: 275 }}
        className={`notification-list-content ${positionClass}`}
      >
        <CardContent>
          <Typography className="title" align="left">
            {type === notificationType.NOTIFICATION
              ? "Notifications"
              : "Messages"}
          </Typography>
          {type === notificationType.NOTIFICATION && (
            <Typography
              className="filter-btn-group"
              align="left"
              component="div"
            >
              <Button
                className={isAll ? "active" : ""}
                onClick={!isAll ? handleFilterChange : null}
              >
                All
              </Button>
              <Button
                className={!isAll ? "active" : ""}
                onClick={isAll ? handleFilterChange : null}
              >
                Unread
              </Button>
            </Typography>
          )}
          {/* <Typography component="div"> */}
          {/* {data.map((item) => {
              return <NotificationDetail item={item} type={type} />;
            })} */}
          {/* </Typography> */}
          <InfiniteList
            container={NotificationListContainer}
            handleGetData={getNotificationList}
            data={{
              limit: 5,
              _sort: "timestamp",
              _order: "desc",
              username: "",
            }}
            component={NotificationDetail}
            handleClickItem={() => null}
            noDataComponent={() => <>No data</>}
            childProps={{ type, closeNotification }}
            parentDataList={parentDataList}
            setParentDataList={setParentDataList}
          />
        </CardContent>
      </Card>
    </Typography>
  );
};

const NotificationListContainer = ({ _renderItem }) => {
  return <Typography component="div">{_renderItem}</Typography>;
};

export default NotificationList;
