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

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matchingPassword, setMatchingPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();

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

  const handleRegister = () => {
    var obj = {
      username,
      fullName,
      email,
      password,
      matchingPassword,
    };
    console.log(obj);

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
            window.location.href = "/verify";
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
              Register
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
                <InputLabel htmlFor="fullname">Full Name</InputLabel>
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
            <Typography component="div" align="center" className="text-input">
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <InputLabel htmlFor="matchingpassword">
                  Matching Password
                </InputLabel>
                <Input
                  id="matchingpassword"
                  type={showPassword ? "text" : "password"}
                  value={matchingPassword}
                  onChange={handleChangeMatchingPassword}
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
            <Button className="login-btn" onClick={handleRegister}>
              Register
            </Button>
          </Typography>

          {/* <Typography
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
            <Typography className="register-link"> Register</Typography>
          </Typography> */}
        </CardContent>
      </Card>
    </Typography>
  );
};

export default RegisterPage;
