import { verify } from "api/userService";
import useLoading from "hooks/useLoading";
import useSnackbar from "hooks/useSnackbar";
import React, { useState } from "react";
import { saveJwtToken, saveRefreshToken } from "utils/cookie";

export default function VerifyPage() {
  const [firstCode, setFirstCode] = useState("");
  const [secondCode, setSecondCode] = useState("");
  const [thirdCode, setThirdCode] = useState("");
  const [fourthCode, setFourthCode] = useState("");
  const [fifthCode, setFifthCode] = useState("");
  const [sixthCode, setSixthCode] = useState("");

  const { setLoading } = useLoading();
  const { setSnackbarState, snackbarState } = useSnackbar();

  const handleSendToken = () => {
    var token =
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
      <button onClick={handleSendToken}>Send Token</button>
    </div>
  );
}
