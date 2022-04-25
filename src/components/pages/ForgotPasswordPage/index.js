import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import { changePassword, forgotPassword } from "api/userService";
import useLoading from "hooks/useLoading";
import useSnackbar from "hooks/useSnackbar";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function ForgotPasswordPage(props) {
  const [verificationToken, setVerificationToken] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [matchingNewPassword, setMatchingNewPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();
  const history = useHistory();

  const handleChangeVerificationToken = (event) => {
    setVerificationToken(event.target.value);
  };

  const handleChangeOldPassword = (event) => {
    setOldPassword(event.target.value);
  };

  const handleChangeMatchingNewPassword = (event) => {
    setMatchingNewPassword(event.target.value);
  };

  const handleChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setLoading(true);
    changePassword({
      oldPassword,
      newPassword,
      matchingNewPassword,
    })
      .then((res) => {
        if (res.status === 200) {
          setSnackbarState({
            open: true,
            content:
              "You have changed password successfully. Please login to use this web",
            type: "SUCCESS",
          });
          setTimeout(() => {
            window.location.href = "/login";
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

  return (
    <Typography component="div" className="login-page">
      <Typography component="div" className="intro-image">
        <img src={require("images/introduce3.png")} width="700" height="400" />
      </Typography>
      <Card className="login-container">
        <CardContent>
          <Typography component="div" align="center" className="logo">
            <img src={require("images/LOGO4.png")} width="200" />
          </Typography>

          <Typography className="form-container">
            <Typography align="left" className="title">
              Forgot password
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="verificationtoken">
                  Verification Token
                </InputLabel>
                <Input
                  id="verificationtoken"
                  type="text"
                  value={props.location.state.token}
                  //onChange={handleChangeVerificationToken}
                  disabled
                />
              </FormControl>{" "}
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="oldpassword">Old Password</InputLabel>
                <Input
                  id="oldpassword"
                  type={showPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={handleChangeOldPassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="newpassword">New Password</InputLabel>
                <Input
                  id="newpassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleChangeNewPassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="matchingnewpassword">
                  Matching New Password
                </InputLabel>
                <Input
                  id="matchingnewpassword"
                  type={showPassword ? "text" : "password"}
                  value={matchingNewPassword}
                  onChange={handleChangeMatchingNewPassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Typography>
          </Typography>

          <Typography component="div" align="center">
            <Button className="login-btn" onClick={handleForgotPassword}>
              Forgot password
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Typography>
  );
}
