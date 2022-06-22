import * as React from "react";
import { Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import "./style.scss";
import { calculateFromNow, convertUTCtoLocalDate } from "utils/calcDateTime";
import { useHistory } from "react-router-dom";
import OutlineProfile from "../OulineProfile";
import { getProfile } from "api/userService";
import CustomPopUp from "../CustomPopUp";
import { substringUsername } from "utils/resolveData";

const PostContent = (props) => {
  const { item, handleClick, index, dataList } = props;
  const history = useHistory();
  const [showPopUp, setShowPopUp] = React.useState(false);
  const [localLoading, setLocalLoading] = React.useState(false);
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({});
  const [isFollowing, setFollowing] = React.useState(false);

  const positionRef = React.useRef();

  const handleOpenPopUp = () => {
    if (!userInfo.id) {
      handleGetProfile(item.createdBy?.username);
    }
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
    if (isUpdated) {
      handleGetProfile(item.createdBy?.username);
    }
  };

  const handleGetProfile = (username) => {
    setLocalLoading(true);
    getProfile(username, { limit: 3 })
      .then((res) => {
        if (res.status === 200) {
          setUserInfo(res.data);
          setFollowing(res.data.following);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLocalLoading(false);
      });
  };

  React.useEffect(() => {
    setUserInfo({ ...userInfo, following: isFollowing });
  }, [isFollowing]);

  return (
    <>
      <Typography component="div" align="left" className="owner-container">
        <img
          className="avatar"
          src={item.createdBy?.avatar}
          width="40"
          height="40"
          alt=""
        />
        <Typography align="left" component="div" className="right-content">
          <Typography
            className="username-container"
            component="div"
            onMouseEnter={handleOpenPopUp}
            onMouseLeave={handleClosePopUp}
          >
            <Typography
              className="owner-name"
              onClick={() =>
                history.push(`/profile/${item.createdBy?.username}`)
              }
              ref={positionRef}
            >
              {substringUsername(item.createdBy?.username)}
            </Typography>
            {showPopUp && (
              <CustomPopUp
                width={390}
                height={350}
                positionRef={{ left: 0, bottom: 0, top: 0, right: 0 }}
                hightZIndex={false}
              >
                <OutlineProfile
                  userInfo={userInfo}
                  isFollowing={userInfo.following}
                  setFollowing={setFollowing}
                  localLoading={localLoading}
                  setIsUpdated={setIsUpdated}
                />
              </CustomPopUp>
            )}
          </Typography>
          <Typography className="post-time">
            {calculateFromNow(convertUTCtoLocalDate(item.createdAt))}
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
