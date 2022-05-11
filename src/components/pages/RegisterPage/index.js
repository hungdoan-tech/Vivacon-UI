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
import { register } from "api/userService";
import useLoading from "hooks/useLoading";
import useSnackbar from "hooks/useSnackbar";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.scss";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matchingPassword, setMatchingPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMatchingPassword, setShowMatchingPassword] = useState(false);

  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();
  const history = useHistory();
  const { t: trans } = useTranslation();

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeFullName = (event) => {
    setFullName(event.target.value);
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangeMatchingPassword = (event) => {
    setMatchingPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowMatchingPassword = () => {
    setShowMatchingPassword(!showMatchingPassword);
  };

  const handleRegister = () => {
    setLoading(true);
    register({ username, fullName, email, password, matchingPassword })
      .then((res) => {
        if (res.status === 200) {
          setSnackbarState({
            open: true,
            content: "Please verify code to use this web",
            type: "SUCCESS",
          });
          setTimeout(() => {
            history.push("/verify", { email, type: "Register" });
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
    <Typography component="div" className="register-page">
      <Typography component="div" className="intro-image">
        <img src={require("images/introduce3.png")} width="700" height="400" />
      </Typography>
      <Card className="register-container">
        <CardContent>
          <Typography component="div" align="center" className="logo">
            <img src={require("images/LOGO4.png")} width="200" />
          </Typography>

          <Typography className="form-container">
            <Typography align="left" className="title">
              {trans("register.register")}
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChangeEmail}
                />
              </FormControl>{" "}
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="fullname">{trans('register.fullName')}</InputLabel>
                <Input
                  id="fullname"
                  type="text"
                  value={fullName}
                  onChange={handleChangeFullName}
                />
              </FormControl>{" "}
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="username">{trans('register.username')}</InputLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleChangeUsername}
                />
              </FormControl>{" "}
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="password">{trans('register.password')}</InputLabel>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleChangePassword}
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
                <InputLabel htmlFor="matchingpassword">
                  {trans('register.confirmPassword')}
                </InputLabel>
                <Input
                  id="matchingpassword"
                  type={showMatchingPassword ? "text" : "password"}
                  value={matchingPassword}
                  onChange={handleChangeMatchingPassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowMatchingPassword}
                      >
                        {showMatchingPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Typography>
          </Typography>

          <Typography component="div" align="center">
            <Button className="register-btn" onClick={handleRegister}>
              {trans('register.register')}
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Typography>
  );
};

export default RegisterPage;
