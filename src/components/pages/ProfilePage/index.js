import { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { withRouter } from "react-router-dom";
import "./style.scss";
import { getProfile } from "api/userService";
import UserImagesTabs from "components/common/UserImagesTabs";
import useLoading from "hooks/useLoading";
import { getCurrentUser } from "utils/jwtToken";
import CheckIcon from "@mui/icons-material/Check";

const ProfilePage = (props) => {
  const { username } = props.match.params;
  const [userProfile, setUserProfile] = useState({});
  const { setLoading } = useLoading();

  const handleGetProfile = () => {
    setLoading(true);
    getProfile(username)
      .then((res) => {
        if (res.status === 200) {
          setUserProfile(res.data);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    handleGetProfile();
  }, []);

  useEffect(() => {
    handleGetProfile();
  }, [username]);
  return (
    <Typography component="div" align="center" className="profile-container">
      <Typography component="div" align="center" className="info-container">
        <Typography component="div" align="center" className="user-avatar">
          <img src={userProfile.avatar} />
        </Typography>
        <Typography component="div" align="left" className="info-details">
          <Typography
            component="div"
            align="left"
            className="info-detail-line1"
          >
            <Typography className="user-name">
              {userProfile.username}
            </Typography>
            <Typography className="action-btns">
              {getCurrentUser().username === userProfile.username ? (
                <>
                  <Button className="edit-btn">Edit Profile</Button>
                  <SettingsIcon className="edit-icon" />
                </>
              ) : userProfile.following ? (
                <>
                  <Button className="message-btn">Message</Button>
                  <Button className="followed-btn">
                    {" "}
                    <CheckIcon className="followed-icon" />
                  </Button>
                </>
              ) : (
                <>
                  <Button className="message-btn">Message</Button>
                  <Button className="followed-btn"> Follow</Button>
                </>
              )}
            </Typography>
          </Typography>

          <Typography
            component="div"
            align="left"
            className="info-detail-line2"
          >
            <Typography
              component="div"
              align="left"
              className="number-of-container"
            >
              <p className="number">
                <strong className="label">{userProfile.postCount} </strong>posts
              </p>
            </Typography>
            <Typography
              component="div"
              align="left"
              className="number-of-container"
            >
              <p className="number">
                <strong className="label">{userProfile.followerCount} </strong>
                followers
              </p>
            </Typography>
            <Typography
              component="div"
              align="left"
              className="number-of-container"
            >
              <p className="number">
                <strong className="label">{userProfile.followingCount} </strong>
                following
              </p>
            </Typography>
          </Typography>

          <Typography
            component="div"
            align="left"
            className="info-detail-line3"
          >
            <Typography className="full-name">
              {userProfile.fullName}
            </Typography>
          </Typography>
        </Typography>
      </Typography>
      <UserImagesTabs username={username} />
    </Typography>
  );
};

export default withRouter(ProfilePage);
