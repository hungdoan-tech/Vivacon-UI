import { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { withRouter } from "react-router-dom";
import "./style.scss";
import {
  followUserById,
  getFollowersById,
  getFollowingUsersById,
  getProfile,
  unfollowUserById,
  uploadImage,
  changeProfileAvatar,
} from "api/userService";
import UserImagesTabs from "components/common/UserImagesTabs";
import useLoading from "hooks/useLoading";
import { getCurrentUser } from "utils/jwtToken";
import CheckIcon from "@mui/icons-material/Check";
import { Helmet } from "react-helmet";
import CustomModal from "components/common/CustomModal";
import _ from "lodash";
import useSnackbar from "hooks/useSnackbar";
import ReactLoading from "react-loading";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import ImageUploader from "react-images-upload";
// import UserInfoPopUp from "components/common/UserInfoPopUp";

const ModalType = {
  FOLLOWER: "FOLLOWERS",
  FOLLOWING: "FOLLOWING",
};

const ProfilePage = (props) => {
  const [username, setUsername] = useState(props.match.params.username);
  const [userProfile, setUserProfile] = useState({});
  const { setLoading } = useLoading();
  const { setSnackbarState } = useSnackbar();
  const [showModal, setShowModal] = useState({
    open: false,
    type: ModalType.FOLLOWER,
    data: {},
  });
  const [unfollowModal, setUnfollowModal] = useState({
    open: false,
    data: {},
  });
  const [isUpdated, setUpdated] = useState(false);
  const [isLocalLoading, setLocalLoading] = useState({
    status: false,
    index: -1,
  });
  //Pop up
  const [openPopUp, setOpenPopUp] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);

  const handleOpenPopUp = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopUp((previousOpen) => !previousOpen);
  };

  const history = useHistory();

  const handleGetProfile = (username) => {
    getProfile(username)
      .then((res) => {
        if (res.status === 200) {
          setUserProfile(res.data);
          setImg(res.data.avatar);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
        setLocalLoading({ status: false, index: -1 });
      });
  };

  const handleGetFollowingUsers = (id) => {
    setLoading(true);
    getFollowingUsersById(id)
      .then((res) => {
        if (res.status === 200) {
          setShowModal({
            open: true,
            type: ModalType.FOLLOWING,
            data: res.data,
          });
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetFollowers = (id) => {
    setLoading(true);
    getFollowersById(id)
      .then((res) => {
        if (res.status === 200) {
          setShowModal({
            open: true,
            type: ModalType.FOLLOWER,
            data: res.data,
          });
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUnfollowUser = (id, username, index) => {
    const { content } = showModal.data;
    handleCloseUnfollowModal();
    setLocalLoading({ status: true, index });
    unfollowUserById(id)
      .then((res) => {
        if (res.status === 200) {
          setSnackbarState({
            open: true,
            content: `Unfollowed @${username}`,
            type: "SUCCESS",
          });
          setUpdated(true);
          const filteredFollowingUser = content.filter(
            (item) => item.id === id
          );
          const index = content.indexOf(filteredFollowingUser[0]);
          content[index].isFollowing = false;

          setShowModal({
            ...showModal,
            data: {
              ...showModal.data,
              content: [...content],
            },
          });
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        // setLocalLoading(false);
      });
  };

  const handleFollowUser = (id, username, index) => {
    const { content } = showModal.data;
    setLocalLoading({ status: true, index });
    followUserById(id)
      .then((res) => {
        if (res.status === 200) {
          setSnackbarState({
            open: true,
            content: `Followed @${username}`,
            type: "SUCCESS",
          });
          setUpdated(true);
          const filteredFollowingUser = content.filter(
            (item) => item.id === id
          );
          const index = content.indexOf(filteredFollowingUser[0]);
          content[index].isFollowing = true;

          setShowModal({
            ...showModal,
            data: {
              ...showModal.data,
              content: [...content],
            },
          });
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        // setLocalLoading(false);
      });
  };

  useEffect(() => {
    if (isUpdated) {
      handleGetProfile(username);
      setUpdated(false);
    }
  }, [isUpdated]);

  useEffect(() => {
    setUsername(props.match.params.username);
  }, [props.match.params.username]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (isLocalLoading.status) {
      setLoading(false);
    }
  }, [isLocalLoading.status]);

  useEffect(() => {
    if (showModal.open) {
      const { content } = showModal.data;
      const { type } = showModal;
      if (content.length === 0 && type === ModalType.FOLLOWING) {
        handleCloseModal();
      }
    }
  }, [showModal]);

  useEffect(() => {
    handleGetProfile(props.match.params.username);
  }, [props.match.params.username]);

  const handleOpenModal = (type) => {
    if (type === ModalType.FOLLOWER) {
      handleGetFollowers(userProfile.id);
    }
    if (type === ModalType.FOLLOWING) {
      handleGetFollowingUsers(userProfile.id);
    }
  };

  const handleCloseModal = () => {
    setShowModal({ ...showModal, open: false });
  };

  const handleOpenUnfollowModal = (userInfo) => {
    setUnfollowModal({
      open: true,
      data: userInfo,
    });
  };

  const handleCloseUnfollowModal = () => {
    setUnfollowModal({ ...unfollowModal, open: false });
  };

  const navigateToUser = (username) => {
    handleCloseModal();
    history.push(`/profile/${username}`);
  };

  const renderFollowModal = () => {
    const { content } = showModal.data;

    return (
      <Typography component="div" className="follow-container">
        {content.map((user, index) => {
          console.log("compare", getCurrentUser(), user.id);
          return (
            <Typography component="div" className="follow-item">
              <Typography
                component="div"
                className="follow-avatar"
                onMouseMove={handleOpenPopUp}
              >
                <img src={user.avatar} width={35} height={35} />
              </Typography>
              <Typography
                component="div"
                className="follow-name"
                onClick={() => navigateToUser(user.username)}
              >
                <Typography className="username">{user.username}</Typography>
                <Typography className="fullName">{user.fullName}</Typography>
              </Typography>
              {getCurrentUser().accountId !== user.id && (
                <Button
                  className={`${changeFormatByCondition(user.isFollowing)}`}
                  onClick={() =>
                    user.isFollowing
                      ? handleOpenUnfollowModal(user)
                      : handleFollowUser(user.id, user.username, index)
                  }
                >
                  {isLocalLoading.index === index && isLocalLoading.status ? (
                    <ReactLoading
                      type="spokes"
                      color="#00000"
                      height={18}
                      width={18}
                    />
                  ) : user.isFollowing ? (
                    <CheckIcon className="followed-icon" />
                  ) : (
                    " Follow"
                  )}
                </Button>
              )}
              <div className="pops-up-container">
                {/* <UserInfoPopUp open={openPopUp} anchorEl={anchorEl} /> */}
              </div>
            </Typography>
          );
        })}
      </Typography>
    );
  };

  const renderUnfollowModal = () => {
    const userInfo = unfollowModal.data;
    const { content } = showModal.data;
    console.log(content, userInfo);

    return (
      <Typography component="div" className="unfollow-container">
        <Typography component="div" className="unfollow-user-info">
          <img src={userInfo.avatar} width={100} height={100} />
          <Typography className="confirm-question">
            Unfollow @{userInfo.username}?
          </Typography>
        </Typography>
        <Typography component="div" className="action-btns">
          <Button
            className="unfollow-btn"
            onClick={() =>
              handleUnfollowUser(
                userInfo.id,
                userInfo.username,
                content ? content.indexOf(userInfo) : -1
              )
            }
          >
            Unfollow
          </Button>
          <Button className="cancel-btn" onClick={handleCloseUnfollowModal}>
            Cancel
          </Button>
        </Typography>
      </Typography>
    );
  };

  const changeFormatByCondition = (condition) => {
    const followedButtonColor = classNames("followed-btn", {
      unfollowed: !condition,
      followed: condition,
    });
    return followedButtonColor;
  };

  const handleChangeImg = (img) => {
    console.log(img);
    const data = new FormData();
    data.append("file", img);
    uploadImage(data)
      .then((res) => {
        if (res.status === 200) {
          changeProfileAvatar({
            actualName: res.data.actualName,
            uniqueName: res.data.uniqueName,
            url: res.data.url,
          }).then((res) => {
            if (res.status === 200) {
              setSnackbarState({
                open: true,
                content: "You have changed your profile avatar successfully!",
                type: "SUCCESS",
              });
              setImg(res.data.url);
            }
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <Typography component="div" align="center" className="profile-container">
      <Helmet>
        <title>{userProfile.fullName}</title>
      </Helmet>
      <Typography component="div" align="center" className="info-container">
        <Typography component="div" align="center" className="user-avatar">
          <input
            className="form-control "
            type="file"
            id="ccomment"
            name="comment"
            required
            onChange={(e) => handleChangeImg(e.target.files[0])}
          />
          <img src={img} />
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
              ) : (
                <>
                  <Button className="message-btn">Message</Button>
                  <Button
                    className={`${changeFormatByCondition(
                      userProfile.following
                    )}`}
                    onClick={() =>
                      userProfile.following
                        ? handleOpenUnfollowModal(userProfile)
                        : handleFollowUser(
                            userProfile.id,
                            userProfile.username,
                            -1
                          )
                    }
                  >
                    {isLocalLoading.index === -1 && isLocalLoading.status ? (
                      <ReactLoading
                        type="spokes"
                        color="#00000"
                        height={18}
                        width={18}
                      />
                    ) : userProfile.following ? (
                      <CheckIcon className="followed-icon" />
                    ) : (
                      "Follow"
                    )}
                  </Button>
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
              onClick={() =>
                userProfile.followerCount
                  ? handleOpenModal(ModalType.FOLLOWER)
                  : null
              }
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
              onClick={() =>
                userProfile.followingCount
                  ? handleOpenModal(ModalType.FOLLOWING)
                  : null
              }
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
      <CustomModal
        open={showModal.open}
        component={() => renderFollowModal()}
        title={_.startCase(_.toLower(showModal.type))}
        handleCloseModal={handleCloseModal}
        width={400}
        height={400}
      />
      <CustomModal
        width={400}
        height={300}
        open={unfollowModal.open}
        component={() => renderUnfollowModal()}
        handleCloseModal={handleCloseUnfollowModal}
      />
    </Typography>
  );
};

export default withRouter(ProfilePage);
