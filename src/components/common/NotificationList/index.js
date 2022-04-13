import { Typography, Card, CardContent, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { calculateFromNow } from "utils/calcDateTime";
import NotificationDetail from "components/common/NotificationDetail";
import { notificationList, messageList } from "fakeData/fakeData";
import { notificationType } from "constant/types";
import "./style.scss";
import classNames from "classnames";

const NotificationList = ({ type, changePosition }) => {
  const [isAll, setAll] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const initData = initalData(type);
    setAll(true);
    setData(initData);
  }, [type]);

  const initalData = (type) => {
    let initData;
    if (type === notificationType.NOTIFICATION) {
      initData = [...notificationList];
    } else {
      initData = [...messageList];
    }
    initData.map((item, index) => {
      initData[index] = { ...item, fromNow: calculateFromNow(item.dateTime) };
      return initData[index];
    });
    return initData;
  };

  useEffect(() => {
    if (!isAll) {
      setData(data.filter((item) => item.seen === false));
    } else {
      setData(initalData(type));
    }
  }, [isAll]);

  const handleFilterChange = () => {
    setAll(!isAll);
  };

  const positionClass = classNames({
    "right": type === notificationType.NOTIFICATION,
    "left": type === notificationType.MESSAGE
  })

  const changePositionClass = classNames({
    "animation-change": changePosition === true 
  })

  return (
    <Typography component="div" className={`notification-list-container ${positionClass} ${changePositionClass}`}>
      <Card sx={{ minWidth: 275 }} className={`notification-list-content ${positionClass}`}>
        <CardContent>
          <Typography className="title" align="left">
            {type === notificationType.NOTIFICATION ? "Notifications" : "Messages"}
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
          <Typography component="div">
            {data.map((item) => {
              return <NotificationDetail item={item} type={type} />;
            })}
          </Typography>
        </CardContent>
      </Card>
    </Typography>
  );
};
export default NotificationList;
