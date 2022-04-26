import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import { resendToken, getUserInformation } from "api/userService";
import useLoading from "hooks/useLoading";
import useSnackbar from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CustomModal from "components/common/CustomModal";
import _ from "lodash";

export default function ForgotInputEmailPage() {
  const [email, setEmail] = useState("");

  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();

  const [showConfirmModal, setShowConfirmModal] = useState({
    open: false,
    data: {},
  });

  const history = useHistory();

  console.log(showConfirmModal);

  const handleConform = () => {
    setLoading(true);
    resendToken(email)
      .then((res) => {
        if (res.status === 200) {
          // saveJwtToken(res.data.accessToken);
          // saveRefreshToken(res.data.refreshToken);
          setSnackbarState({
            open: true,
            content: "Please enter again code was sent in your email",
            type: "SUCCESS",
          });
          setTimeout(() => {
            history.push("/verify", { emailForgot: email });
          }, 1000);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetProfile = (email) => {
    setLoading(true);
    getUserInformation(email)
      .then((res) => {
        if (res.status === 200) {
          //setUserProfile(res.data);
          console.log(res.data);
          setShowConfirmModal({
            open: true,
            data: { username: res.data.username, avatar: res.data.avatar },
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

  const handleOpenModal = () => {
    handleGetProfile(email);
  };

  const handleCloseModal = () => {
    setShowConfirmModal({ open: false, data: {} });
  };

  const ImageList = (props) => {
    return (
      <div>
        <p>{props.username}</p>
        {/* <img src={props.avatar} /> */}
        <button onClick={handleConform}>Send</button>
      </div>
    );
  };

  return (
    <div>
      <Typography component="div" align="center" className="text-input">
        <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>{" "}
        <Typography component="div" align="center">
          <Button className="login-btn" onClick={handleOpenModal}>
            Confirm
          </Button>
        </Typography>
      </Typography>
      <CustomModal
        open={showConfirmModal.open}
        component={() => (
          <ImageList
            username={showConfirmModal.data.username}
            avatar={showConfirmModal.data.avatar}
          />
        )}
        title={_.startCase(_.toLower("confirm"))}
        handleCloseModal={handleCloseModal}
        width={400}
        height={400}
      />
    </div>
  );
}
