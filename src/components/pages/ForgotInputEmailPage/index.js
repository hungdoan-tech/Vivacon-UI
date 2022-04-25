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

export default function ForgotInputEmailPage() {
  const [email, setEmail] = useState("");

  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();

  const history = useHistory();

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
    handleGetProfile(email);

    // return () => {
    //   second
    // }
  }, [email]);

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
          <Button className="login-btn" onClick={handleConform}>
            Register
          </Button>
        </Typography>
      </Typography>
    </div>
  );
}
