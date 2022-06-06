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
import { editProfileTextFields } from "constant/data";
import { useState, useEffect } from "react";
import { getCurrentUser } from "utils/jwtToken";
import "./style.scss";

const EditProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  return (
    <Typography
      component="div"
      align="center"
      className="edit-profile-container"
    >
      <Typography component="div" align="center" className="user-mini-info">
        <Typography className="avatar">
          {" "}
          <img src={currentUser.avatar} />
        </Typography>
        <Typography className="right-action">
          <Typography className="username">{currentUser.username}</Typography>
          <Typography className="change-profile-photo">
            Change Profile Photo
          </Typography>
        </Typography>
      </Typography>

      {editProfileTextFields.map((item) => {
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
              {item.field === "email" && (
                <Button className="confirm-btn">Confirm Email</Button>
              )}
              {item.field === "phoneNumber" && (
                <Button className="confirm-btn">Confirm Phone Number</Button>
              )}
              <Typography component="div" className="below-text">
                {item.belowText}
              </Typography>
            </Typography>
          </Typography>
        );
      })}
      <Button className="submit-btn">Submit</Button>
    </Typography>
  );
};

export default EditProfilePage;
