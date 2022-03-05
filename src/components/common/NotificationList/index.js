import { Typography, Card, CardContent, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { calculateFromNow } from "../../../utils/calcDateTime";
import NotificationDetail from "../NotificationDetail";
import { notificationList, messageList } from "../../../fakeData/fakeData";
import { notificationType } from "../../../constant/types";
import "./style.scss";

const NotificationList = ({ type }) => {
  const [isAll, setAll] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    const initData = initalData(type);
    setData(initData);
  }, []);

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

  return (
    <Typography component="div" className="notification-list-container">
      <Card sx={{ minWidth: 275 }} className="notification-list-content">
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
