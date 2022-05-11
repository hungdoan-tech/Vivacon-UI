import { Typography, Button } from "@mui/material";
import { getProfile } from "api/userService";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { getCurrentUser } from "utils/jwtToken";
import { substringUsername } from "utils/resolveData";
import CustomPopUp from "../CustomPopUp";
import FollowButton from "../FollowButton";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import "./style.scss";
import { useTranslation } from "react-i18next";

const FollowUserItem = (props) => {
  const { handleCloseModal, user } = props;
  const [showPopUp, setShowPopUp] = useState(false);
  const [isFollowing, setFollowing] = useState(
    user.isFollowing || user.following
  );
  const [userInfo, setUserInfo] = useState({});
  const [localLoading, setLocalLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const positionRef = useRef();

  const history = useHistory();
  const navigateToUser = (username) => {
    handleCloseModal(false);
    history.push(`/profile/${username}`);
  };
  const handleOpenPopUp = () => {
    if (!userInfo.id) {
      handleGetProfile(user.username);
    }
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
    if (isUpdated) {
      handleUpdateMiniProfile();
    }
  };

  const handleGetProfile = (username) => {
    setLocalLoading(true);
    getProfile(username, { limit: 3 })
      .then((res) => {
        if (res.status === 200) {
          setUserInfo(res.data);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLocalLoading(false);
      });
  };

  const handleUpdateMiniProfile = () => {
    handleGetProfile(user.username);
  };

  return (
    <Typography component="div" className="follow-item-container">
      <Typography component="div" className="follow-item">
        <Typography component="div" className="follow-avatar">
          <Typography component="div" className="avatar-container">
            <img src={user.avatar} width={35} height={35} />
          </Typography>
        </Typography>
        <Typography component="div" className="follow-name">
          <Typography
            className="username-container"
            component="div"
            onMouseEnter={handleOpenPopUp}
            onMouseLeave={handleClosePopUp}
          >
            <Typography
              className="username"
              onClick={() => navigateToUser(user.username)}
              ref={positionRef}
            >
              {substringUsername(user.username)}
            </Typography>

            {showPopUp && (
              <CustomPopUp
                width={390}
                height={350}
                positionRef={positionRef.current?.getBoundingClientRect()}
              >
                <PopUpContent
                  userInfo={userInfo}
                  isFollowing={isFollowing}
                  setFollowing={setFollowing}
                  localLoading={localLoading}
                  setIsUpdated={setIsUpdated}
                />
              </CustomPopUp>
            )}
          </Typography>
          <Typography className="fullName">{user.fullName}</Typography>
        </Typography>
        {getCurrentUser().accountId !== user.id && (
          <FollowButton
            userProfile={user}
            isFollowing={isFollowing}
            setFollowing={setFollowing}
          />
        )}
      </Typography>
    </Typography>
  );
};

export const PopUpContent = ({
  userInfo,
  isFollowing,
  setFollowing,
  localLoading,
  setIsUpdated,
}) => {
  const { t: trans } = useTranslation();
  const [followerCount, setFollowerCount] = useState(userInfo.followerCount);
  const [initialFollowerState, setInitialFollowerState] = useState(isFollowing);

  useEffect(() => {
    setFollowerCount(userInfo.followerCount);
    setInitialFollowerState(isFollowing);
  }, [userInfo]);

  useEffect(() => {
    if (initialFollowerState !== isFollowing) {
      if (isFollowing) {
        setFollowerCount(followerCount + 1);
      } else {
        setFollowerCount(followerCount - 1);
      }
      setIsUpdated(true);
    } else {
      setFollowerCount(userInfo.followerCount);
      setIsUpdated(false);
    }
  }, [isFollowing]);

  return (
    !localLoading && (
      <Typography component="div" className="user-info-popup">
        <Typography component="div" className="popup-line1">
          <img src={userInfo.avatar} width={60} height={60} />
          <Typography className="user-info-details">
            <Typography className="user-info-username">
              {userInfo.username}
            </Typography>
            <Typography className="user-info-fullname">
              {userInfo.fullName}
            </Typography>
          </Typography>
        </Typography>
        <Typography component="div" className="popup-line2">
          <Typography
            component="div"
            align="center"
            className="number-of-container"
          >
            <p className="number">
              <strong>{userInfo.postCount || 0} </strong>
              <div className="label">{trans("profile.posts")}</div>
            </p>
          </Typography>
          <Typography
            component="div"
            align="center"
            className="number-of-container"
          >
            <p className="number">
              <strong>{followerCount || 0} </strong>
              <div className="label">{trans("profile.followers")}</div>
            </p>
          </Typography>
          <Typography
            component="div"
            align="center"
            className="number-of-container"
          >
            <p className="number">
              <strong>{userInfo.followingCount || 0} </strong>
              <div className="label">{trans("profile.following")}</div>
            </p>
          </Typography>
        </Typography>
        <Typography component="div" className="popup-line3">
          {userInfo.pagePost?.content.length > 0 ? (
            userInfo.pagePost?.content.map((item) => {
              return <img src={item.firstImage} width={130} height={130} />;
            })
          ) : (
            <Typography component="div" align="center" className="no-data">
              <CameraAltOutlinedIcon className="no-data-icon" />
              <Typography className="no-data-label">
                {trans("profile.haveNoPost")}
              </Typography>
            </Typography>
          )}
        </Typography>

        <Typography component="div" className="popup-line4">
          {getCurrentUser().accountId !== userInfo.id && (
            <>
              {" "}
              <Button className="message-btn">
                {trans("profile.message")}
              </Button>
              <FollowButton
                userProfile={userInfo}
                isFollowing={isFollowing}
                setFollowing={setFollowing}
                inPopUp={true}
              />
            </>
          )}
        </Typography>
      </Typography>
    )
  );
};

export default FollowUserItem;
