import { resendToken, verify } from "api/userService";
import useLoading from "hooks/useLoading";
import useSnackbar from "hooks/useSnackbar";
import React, { useState } from "react";
import { saveJwtToken, saveRefreshToken } from "utils/cookie";
import { useHistory } from "react-router-dom";

export default function VerifyPage(props) {
  const [firstCode, setFirstCode] = useState("");
  const [secondCode, setSecondCode] = useState("");
  const [thirdCode, setThirdCode] = useState("");
  const [fourthCode, setFourthCode] = useState("");
  const [fifthCode, setFifthCode] = useState("");
  const [sixthCode, setSixthCode] = useState("");

  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();
  const history = useHistory();

  const [isButtonDisabled, setButtonDisabled] = useState(false);

  var token = "";

  const handleSendToken = () => {
    token =
      firstCode + secondCode + thirdCode + fourthCode + fifthCode + sixthCode;

    setLoading(true);
    verify(token)
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

  const handleResendToken = () => {
    console.log("resend");
    setButtonDisabled(true);

    const email = props.location.state.emailForgot;

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
          // setTimeout(() => {
          //   window.location.href = "/";
          // }, 1000);
          setTimeout(() => setButtonDisabled(false), 5000);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleConformForgotPassword = () => {
    token =
      firstCode + secondCode + thirdCode + fourthCode + fifthCode + sixthCode;

    setLoading(true);
    verify(token)
      .then((res) => {
        if (res.status === 200) {
          saveJwtToken(res.data.accessToken);
          saveRefreshToken(res.data.refreshToken);
          setSnackbarState({
            open: true,
            content: "Go to page forgot password successfully",
            type: "SUCCESS",
          });
          setTimeout(() => {
            history.push("/forgot-password", token);
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
    <div>
      <input
        type="text"
        className="form-control"
        value={firstCode}
        onChange={(e) => setFirstCode(e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        value={secondCode}
        onChange={(e) => setSecondCode(e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        value={thirdCode}
        onChange={(e) => setThirdCode(e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        value={fourthCode}
        onChange={(e) => setFourthCode(e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        value={fifthCode}
        onChange={(e) => setFifthCode(e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        value={sixthCode}
        onChange={(e) => setSixthCode(e.target.value)}
      />
      <button onClick={handleSendToken}>Submit</button>
      <button disabled={isButtonDisabled} onClick={handleResendToken}>
        Resend Token
      </button>
      <button onClick={handleConformForgotPassword}>
        Conform forgot password
      </button>
    </div>
  );
}
