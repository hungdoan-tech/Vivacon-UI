import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { getCurrentUser } from "utils/jwtToken";
import { getProfile } from "api/userService";
import ReactLoading from "react-loading";
import "./style.scss";

const SuggestedAccounts = () => {
  const [isLoading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const handleGetProfile = (username) => {
    setLoading(true);
    getProfile(username, { limit: 1 })
      .then((res) => {
        if (res.status === 200) {
          setUserInfo(res.data);
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
    handleGetProfile(getCurrentUser().username);
  }, []);

  return (
    <>
      {userInfo && (
        <Typography component="div" className="suggested-accounts">
          <Typography className="mini-profile">
            <Typography component="div" className="background">
              <img
                width="100%"
                src={require("images/profile-background.jpg")}
              />
            </Typography>
            <Typography component="div" className="avatar">
              <img with="100" height="100" src={userInfo.avatar} />
            </Typography>
            <Typography className="username">{userInfo.username}</Typography>
            <Typography className="fullname">{userInfo.fullName}</Typography>
          </Typography>

          <Typography component="div" className="information">
            <Typography component="div" className="posts">
              <strong>{userInfo.postCount}</strong> POSTS
            </Typography>
            <Typography component="div" className="following">
              <strong>{userInfo.followingCount}</strong> FOLLOWING
            </Typography>
            <Typography component="div" className="followers">
              <strong>{userInfo.followerCount}</strong> FOLLOWERS
            </Typography>
          </Typography>
          <Typography component="div" className="rest"></Typography>
        </Typography>
      )}
      {isLoading && (
        <ReactLoading
          className="loading-icon"
          type="spokes"
          color="#00000"
          height={20}
          width={20}
        />
      )}
    </>
  );
};

export default SuggestedAccounts;
