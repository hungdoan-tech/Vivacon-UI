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
import CustomPopUp from "components/common/CustomPopUp";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FollowButton from "components/common/FollowButton";
import { substringUsername } from "utils/resolveData";
import FollowUserItem from "components/common/FollowUserItem";

import { useTranslation } from "react-i18next";

const ProfilePage = (props) => {
  const { t: trans } = useTranslation();

  const ModalType = {
    FOLLOWER: trans("profile.followerCount"),
    FOLLOWING: trans("profile.followingCount"),
  };

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
  const [updatedItem, setUpdatedItem] = useState({});
  const [isLocalLoading, setLocalLoading] = useState({
    status: false,
    index: -1,
  });

  const history = useHistory();

  //--GET DATA--
  const handleGetProfile = (username) => {
    getProfile(username, {})
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

  //--ACTION--
  const handleUnfollowUser = (id, username, index) => {
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
    if (updatedItem.id) {
      if (userProfile.id === updatedItem.id) {
        setUserProfile({
          ...userProfile,
          following: updatedItem.following,
          followerCount: updatedItem.following
            ? userProfile.followerCount + 1
            : userProfile.followerCount - 1,
        });
      } else {
        setUserProfile({
          ...userProfile,
          followingCount: updatedItem.following
            ? userProfile.followingCount + 1
            : userProfile.followingCount - 1,
        });
      }
      if (showModal.data.content) {
        const { content } = showModal.data;
        const filteredFollowingUser = content.filter(
          (item) => item.id === updatedItem.id
        );
        const index = content.indexOf(filteredFollowingUser[0]);
        content[index].isFollowing = updatedItem.following;

        setShowModal({
          ...showModal,
          data: {
            ...showModal.data,
            content: [...content],
          },
        });
      }
    }
    console.log("resetUpdate");
  }, [updatedItem]);

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

  const renderUnfollowModal = () => {
    const userInfo = unfollowModal.data;
    const { content } = showModal.data;

    return (
      <Typography component="div" className="unfollow-container">
        <Typography component="div" className="unfollow-user-info">
          <img src={userInfo.avatar} width={100} height={100} />
          <Typography className="confirm-question">
            {trans("profile.unfollow")} @{userInfo.username}?
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
            {trans("profile.unfollow")}
          </Button>
          <Button className="cancel-btn" onClick={handleCloseUnfollowModal}>
            {trans("profile.cancel")}
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

  return (
    <Typography component="div" align="center" className="profile-container">
      <Helmet>
        <title>{`${userProfile.fullName} (@${userProfile.username})`} </title>
      </Helmet>
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
                  <Button className="edit-btn">
                    {trans("profile.editInformation")}
                  </Button>
                  <SettingsIcon className="edit-icon" />
                </>
              ) : (
                <>
                  <Button className="message-btn">
                    {trans("profile.message")}
                  </Button>
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
                      trans("profile.follow")
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
                <strong className="label">{userProfile.postCount} </strong>{" "}
                {trans("profile.post")}
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
                {trans("profile.followerCount")}
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
                {trans("profile.followingCount")}
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
      <UserImagesTabs
        username={username}
        setUpdatedItem={setUpdatedItem}
        updatedItem={updatedItem}
      />
      <CustomModal
        isRadius
        open={showModal.open}
        component={() => (
          <Typography component="div" className="follow-container">
            {showModal.data.content.map((user) => {
              return <FollowUserItem user={user} />;
            })}
          </Typography>
        )}
        title={_.startCase(_.toLower(showModal.type))}
        handleCloseModal={handleCloseModal}
        width={400}
        height={400}
      />
      <CustomModal
        isRadius
        width={400}
        height={300}
        open={unfollowModal.open}
        component={() => renderUnfollowModal()}
        handleCloseModal={handleCloseUnfollowModal}
      />
    </Typography>
  );
};

// const FollowUsers = (props) => {

//   return (
//     <>
//       <Typography component="div" className="follow-container">
//         {content.map((user) => {
//           return (
//             <></>
//           );
//         })}
//       </Typography>
//     </>
//   );
// };

export default withRouter(ProfilePage);
