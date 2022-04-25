import { Typography, Button } from "@mui/material";
import { getProfile } from "api/userService";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getCurrentUser } from "utils/jwtToken";
import { substringUsername } from "utils/resolveData";
import CustomPopUp from "../CustomPopUp";
import FollowButton from "../FollowButton";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import "./style.scss"

const FollowUserItem = (props) => {
  const { handleCloseModal, user } = props;
  const [showPopUp, setShowPopUp] = useState({
    open: false,
    id: -1,
    showInImage: false,
  });
  const [isFollowing, setFollowing] = useState(user.isFollowing);
  const [userInfo, setUserInfo] = useState({});
  const [localLoading, setLocalLoading] = useState(true);

  const history = useHistory();
  const navigateToUser = (username) => {
    handleCloseModal();
    history.push(`/profile/${username}`);
  };
  const handleOpenPopUp = (user, showInImage) => {
    if (showPopUp.open === true && showPopUp.id !== user.id) {
      handleClosePopUp();
    }
    setShowPopUp({
      open: true,
      id: user.id,
      showInImage,
    });
    handleGetProfile(user.username);
  };

  const handleClosePopUp = () => {
    setShowPopUp({
      open: false,
      id: -1,
    });
  };

  const handleGetProfile = (username) => {
    setLocalLoading(true);
    getProfile(user.username, { limit: 3 })
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
  useEffect(() => {
    handleGetProfile(user.username);
  }, []);

  return (
    <Typography component="div" className="follow-item-container">
      <Typography component="div" className="follow-item">
        <Typography component="div" className="follow-avatar">
          <Typography
            component="div"
            onMouseEnter={() => handleOpenPopUp(user, true)}
            onMouseLeave={handleClosePopUp}
            className="avatar-container"
          >
            <img src={user.avatar} width={35} height={35} />
          </Typography>
        </Typography>
        <Typography component="div" className="follow-name">
          <Typography
            className="username-container"
            component="div"
            onMouseEnter={() => handleOpenPopUp(user, false)}
            // onMouseLeave={handleClosePopUp}
          >
            <Typography
              className="username"
              onClick={() => navigateToUser(user.username)}
            >
              {substringUsername(user.username)}
            </Typography>
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
      {showPopUp.open && showPopUp.id && !showPopUp.showInImage && (
        <CustomPopUp
          width={390}
          height={350}
          component={() => (
            <PopUpContent
              userInfo={userInfo}
              isFollowing={isFollowing}
              setFollowing={setFollowing}
              localLoading={localLoading}
            />
          )}
        />
      )}
    </Typography>
  );
};

export const PopUpContent = ({
  userInfo,
  isFollowing,
  setFollowing,
  localLoading,
}) => {
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
              <div className="label">posts</div>
            </p>
          </Typography>
          <Typography
            component="div"
            align="center"
            className="number-of-container"
          >
            <p className="number">
              <strong>{userInfo.followerCount || 0} </strong>
              <div className="label">followers</div>
            </p>
          </Typography>
          <Typography
            component="div"
            align="center"
            className="number-of-container"
          >
            <p className="number">
              <strong>{userInfo.followingCount || 0} </strong>
              <div className="label">following</div>
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
              <Typography className="no-data-label">No Posts Yet</Typography>
            </Typography>
          )}
        </Typography>

        <Typography component="div" className="popup-line4">
          {getCurrentUser().accountId !== userInfo.id && (
            <>
              {" "}
              <Button className="message-btn">Message</Button>
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
