import { useContext, useState } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login } from "api/userService";
import "./style.scss";
import { saveJwtToken, saveRefreshToken } from "utils/cookie";
import useLoading from "hooks/useLoading";
import useSnackbar from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();

  const history = useHistory();

  const { t: trans } = useTranslation();

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    setLoading(true);
    login({ username, password })
      .then((res) => {
        if (res.status === 200) {
          saveJwtToken(res.data.accessToken);
          saveRefreshToken(res.data.refreshToken);
          setSnackbarState({
            open: true,
            content: trans("signIn.loginSuccessful"),
            type: "SUCCESS",
          });
          setTimeout(() => {
            window.location.href = "/";
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
              {trans("signIn.login")}
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="username">
                  {trans("signIn.userName")}
                </InputLabel>
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
                <InputLabel htmlFor="password">
                  {trans("signIn.password")}
                </InputLabel>
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
            <Typography
              className="forgot-password-link"
              onClick={() =>
                history.push("/find-account", { type: "FindAccount" })
              }
            >
              {trans("signIn.forgotPassword")}
            </Typography>{" "}
          </Typography>

          <Typography component="div" align="center">
            <Button className="login-btn" onClick={handleLogin}>
              {trans("signIn.login")}
            </Button>
          </Typography>

          <Typography
            component="div"
            align="center"
            className="or"
          ></Typography>

          <Typography
            component="div"
            align="center"
            className="register-link-container"
          >
            <Typography className="dont-have-account">
              {trans("signIn.haveNoAccount")}
            </Typography>
            <Typography className="register-link" onClick={() => history.push('/register')}>
              {trans("signIn.register")}
            </Typography>{" "}
          </Typography>
        </CardContent>
      </Card>
    </Typography>
  );
};

export default LoginPage;
