import { useState, useEffect, useContext } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
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
import CustomPopUp from "components/common/CustomPopUp";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FollowButton from "components/common/FollowButton";
import { substringUsername } from "utils/resolveData";
import FollowUserItem from "components/common/FollowUserItem";
import { AuthUser } from "App";
import InfoIcon from "@mui/icons-material/Info";

import { useTranslation } from "react-i18next";
import { reportContent } from "constant/types";
import { createAccountReport } from "api/reportService";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ProfilePage = (props) => {
  const { t: trans } = useTranslation();

  const ModalType = {
    FOLLOWER: trans("profile.followerCount"),
    FOLLOWING: trans("profile.followingCount"),
  };

  const Auth = useContext(AuthUser);
  const [stepValue, setStepValue] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [reportModal, setReportModal] = useState({
    open: false,
  });
  const [globalState, setGlobalState] = useState({});

  const [username, setUsername] = useState(props.match.params.username);
  const [userProfile, setUserProfile] = useState({});
  const { setLoading } = useLoading();
  const { setSnackbarState } = useSnackbar();
  const [showModal, setShowModal] = useState({
    open: false,
    type: ModalType.FOLLOWER,
    data: [],
  });
  const [unfollowModal, setUnfollowModal] = useState({
    open: false,
    data: {},
  });
  const [isLocalLoading, setLocalLoading] = useState({
    status: false,
    index: -1,
  });

  const [changeAvatarLoading, setChangeAvatarLoading] = useState(false);

  const [img, setImg] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [currentModalType, setCurrentModalType] = useState(null);
  const [fetchInfo, setFetchInfo] = useState({});

  //--GET DATA--
  const handleGetProfile = (username) => {
    getProfile(username, {})
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
    getFollowingUsersById({
      account: id,
      // _order: "desc",
      limit: 15,
      page: pageNumber,
    })
      .then((res) => {
        if (res.status === 200) {
          if (pageNumber > 0) {
            setShowModal({
              open: true,
              type: ModalType.FOLLOWING,
              data: [...showModal.data, ...res.data.content],
            });
          } else {
            setShowModal({
              open: true,
              type: ModalType.FOLLOWING,
              data: [...res.data.content],
            });
          }
          setFetchInfo(res.data);
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
    getFollowersById({
      account: id,
      // _order: "desc",
      limit: 15,
      page: pageNumber,
    })
      .then((res) => {
        if (res.status === 200) {
          if (pageNumber > 0) {
            setShowModal({
              open: true,
              type: ModalType.FOLLOWER,
              data: [...showModal.data, ...res.data.content],
            });
          } else {
            setShowModal({
              open: true,
              type: ModalType.FOLLOWER,
              data: [...res.data.content],
            });
          }
          setFetchInfo(res.data);
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
            content: `${trans("follow.followed")} @${username}`,
            type: "SUCCESS",
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
    setLocalLoading({ status: true, index });
    followUserById(id)
      .then((res) => {
        if (res.status === 200) {
          setSnackbarState({
            open: true,
            content: `${trans("follow.unfollowed")} @${username}`,
            type: "SUCCESS",
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
      const content = showModal.data;
      const { type } = showModal;
      if (content.length === 0 && type === ModalType.FOLLOWING) {
        handleCloseModal(true);
      }
    }
  }, [showModal]);

  useEffect(() => {
    handleGetProfile(props.match.params.username);
  }, [props.match.params.username]);

  useEffect(() => {
    if (currentModalType === ModalType.FOLLOWER) {
      handleGetFollowers(userProfile.id);
    }
    if (currentModalType === ModalType.FOLLOWING) {
      handleGetFollowingUsers(userProfile.id);
    }
  }, [pageNumber, currentModalType]);

  const handleOpenModal = (type) => {
    setCurrentModalType(type);
  };

  const handleCloseModal = (isUpdate) => {
    setShowModal({ ...showModal, data: [], open: false });
    setPageNumber(0);
    setCurrentModalType(null);
    if (isUpdate) {
      handleUpdateProfile();
    }
  };

  const handleUpdateProfile = () => {
    handleGetProfile(props.match.params.username);
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

  const handleViewMore = () => {
    setPageNumber(pageNumber + 1);
  };

  const renderUnfollowModal = () => {
    const userInfo = unfollowModal.data;
    const content = showModal.data;

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

  const handleCreateReport = (item) => {
    setGlobalState(item);
    handleNextStep();
  };

  const handleSubmitReport = () => {
    const reportData = {
      content: globalState.content,
      sentitiveType: globalState.sentitiveType,
      accountId: userProfile.id,
    };

    createAccountReport(reportData)
      .then((res) => {
        if (res.status === 200) {
          setSnackbarState({
            open: true,
            content: "You have reported successfully",
            type: "SUCCESS",
          });
          handleNextStep();
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        // setLocalLoading(false);
      });
  };

  const handleNextStep = () => {
    setStepValue(stepValue + 1);
  };
  const handlePrevStep = () => {
    setStepValue(stepValue - 1);
  };

  const StepOne = () => {
    return (
      <CustomModal
        isRadius
        width={400}
        height={300}
        title="Why do you report this account?"
        open={reportModal.open}
        handleCloseModal={handleCloseReportModal}
      >
        {reportContent.map((item, index) => (
          <p onClick={() => handleCreateReport(item)}>{item.content}</p>
        ))}
      </CustomModal>
    );
  };

  const StepTwo = () => {
    return (
      <CustomModal
        isRadius
        width={400}
        height={800}
        title="Báo cáo"
        open={reportModal.open}
        handleCloseModal={handleCloseReportModal}
      >
        <button onClick={handlePrevStep}>Back</button>
        <h2>Tại sao bạn báo cáo bài viết này?</h2>
        {globalState.detailContent
          ? globalState?.detailContent.map((item, index) => (
              <>
                <p key={item.id}>{item}</p>
              </>
            ))
          : null}
        <button onClick={handleSubmitReport}>Gửi báo cáo</button>
      </CustomModal>
    );
  };

  const StepThree = (post) => {
    return (
      <CustomModal
        isRadius
        width={400}
        height={300}
        title="Cảm ơn bạn đã cho chúng tôi biết"
        open={reportModal.open}
        handleCloseModal={handleCloseReportModal}
      >
        <>
          <IconButton>
            <InfoIcon />
          </IconButton>
          <div>Block</div>
          {post && post?.createdBy?.isFollowing ? <div>Unfollow</div> : null}

          <div>View More</div>
          <div onClick={handleCloseReportModal}>Close</div>
        </>
      </CustomModal>
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
    setChangeAvatarLoading(true);
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
                content: trans("profile.changeAvatarSuccessfully"),
                type: "SUCCESS",
              });
              setImg(res.data.url);
            }
          });
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setChangeAvatarLoading(false);
      });
  };

  const handleOpenReportModal = () => {
    setIsShow(true);
    setReportModal({
      ...reportModal,
      open: true,
    });
  };

  const handleCloseReportModal = () => {
    setIsShow(false);
    setReportModal({ ...reportModal, open: false });
    setStepValue(0);
  };

  return (
    <Typography component="div" align="center" className="profile-container">
      <Helmet>
        <title>{`${userProfile.fullName} (@${userProfile.username})`} </title>
      </Helmet>
      <Typography component="div" align="center" className="info-container">
        <Typography
          component="div"
          align="center"
          className="user-avatar-container"
        >
          <Typography component="div" align="center" className="user-avatar">
            {getCurrentUser().accountId === userProfile.id && (
              <>
                {" "}
                <input
                  className="change-user-avatar"
                  type="file"
                  id="change-avatar"
                  name="comment"
                  required
                  onChange={(e) => handleChangeImg(e.target.files[0])}
                />
                <label for="change-avatar" className="change-user-avatar-btn">
                  Change
                </label>
              </>
            )}
            <img src={img} />
            {changeAvatarLoading && (
              <ReactLoading
                className="change-avatar-loading"
                type="spokes"
                color="#00000"
                height={20}
                width={20}
              />
            )}
          </Typography>
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

          {!Auth.auth.isAdmin && (
            <button onClick={handleOpenReportModal}>Report</button>
          )}

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
        handleUpdateProfile={handleUpdateProfile}
      />
      <CustomModal
        isRadius
        open={showModal.open}
        title={_.startCase(_.toLower(showModal.type))}
        handleCloseModal={handleCloseModal}
        width={400}
        height={400}
      >
        <Typography component="div" className="follow-container">
          {showModal.data?.map((user) => {
            return (
              <FollowUserItem
                user={user}
                handleCloseModal={handleCloseModal}
                key={user.id}
              />
            );
          })}
          {!fetchInfo.last && (
            <Typography className="view-more" onClick={handleViewMore}>
              View more
            </Typography>
          )}
        </Typography>
      </CustomModal>
      <CustomModal
        isRadius
        width={400}
        height={300}
        open={unfollowModal.open}
        handleCloseModal={handleCloseUnfollowModal}
      >
        {renderUnfollowModal()}
      </CustomModal>

      {isShow && isShow ? (
        <>
          <TabPanel value={stepValue} index={0}>
            {StepOne()}
          </TabPanel>
          <TabPanel value={stepValue} index={1}>
            {StepTwo()}
          </TabPanel>
          <TabPanel value={stepValue} index={2}>
            {StepThree(userProfile)}
          </TabPanel>
        </>
      ) : null}
    </Typography>
  );
};

export default withRouter(ProfilePage);
