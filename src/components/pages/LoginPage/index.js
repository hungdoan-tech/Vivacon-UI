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

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();

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
            content: "Login successfully",
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
              Log in
            </Typography>
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="username">Username</InputLabel>
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
                <InputLabel htmlFor="password">Password</InputLabel>
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
          </Typography>

          <Typography component="div" align="center">
            <Button className="login-btn" onClick={handleLogin}>
              Log In
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
              Don't have an account?
            </Typography>
            <Typography className="register-link"> Register</Typography>{" "}
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
              Did you forgot your password?
            </Typography>
            <Typography className="register-link">
              {" "}
              Forgot your password
            </Typography>{" "}
          </Typography>
        </CardContent>
      </Card>
    </Typography>
  );
};

export default LoginPage;
