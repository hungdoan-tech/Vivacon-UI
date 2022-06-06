import {
  InputBase,
  Typography,
  FormControl,
  InputLabel,
  Input,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { changePasswordFields, editProfileTextFields } from "constant/data";
import { useState, useEffect } from "react";
import { getCurrentUser } from "utils/jwtToken";
import "./style.scss";

const ChangePasswordPage = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  return (
    <Typography
      component="div"
      align="center"
      className="change-password-container"
    >
      <Typography component="div" align="center" className="user-mini-info">
        <Typography className="avatar">
          {" "}
          <img src={currentUser.avatar} />
        </Typography>
        <Typography className="right-action">
          <Typography className="username">{currentUser.username}</Typography>
        </Typography>
      </Typography>

      {changePasswordFields.map((item) => {
        return (
          <Typography component="div" className="field-container">
            <Typography className="field-title">{item.title}</Typography>

            <Typography component="div" className="field-content">
              {item.type === "textField" ? (
                <TextField
                  id={item.field}
                  type="text"
                  variant="outlined"
                  className="field-input-text"
                  maxRows={item.maxRow}
                  multiline={true}
                  // value={username}
                  // onChange={handleChangeUsername}
                />
              ) : (
                <FormControlLabel
                  control={<Checkbox className="field-input-checkbox" />}
                  label={item.checkBoxText}
                />
              )}
            </Typography>
          </Typography>
        );
      })}
      <Button className="submit-btn">Change password</Button>
      <Typography className="forgot-password-link">Forgot password</Typography>
    </Typography>
  );
};

export default ChangePasswordPage;
