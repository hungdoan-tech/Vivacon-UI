import { useState } from "react";
import { CardContent, Typography, Card } from "@mui/material";
import { AuthUser } from "App";
import { userOption } from "fakeData/fakeData";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { getCurrentUser } from "utils/jwtToken";
import "./style.scss";
import { useTranslation } from "react-i18next";

const UserOption = (props) => {
  const Auth = useContext(AuthUser);
  const history = useHistory();

  const { t: trans } = useTranslation();

  return (
    <Typography
      component="div"
      className="user-option-container"
      style={{ "--optionSize": userOption.length }}
    >
      <Card>
        <CardContent>
          {userOption.map((option) => {
            return (
              <Typography
                component="div"
                className="user-option-item"
                onClick={() => {
                  option.onClickHandle();
                  if (option.name === "settingUI.logOut") {
                    window.location.href = "/login";
                  } else {
                    if (option.name === "settingUI.profile") {
                      history.push(
                        `${option.navigateUrl}/${getCurrentUser().username}`
                      );
                    } else {
                      history.push(`${option.navigateUrl}`);
                    }
                    props.handleClose();
                  }
                }}
              >
                <Typography component="div" className="option-icon">
                  {option.icon}
                </Typography>
                <Typography component="div" className="option-name">
                  {trans(option.name)}
                </Typography>
              </Typography>
            );
          })}
        </CardContent>
      </Card>
    </Typography>
  );
};

export default UserOption;
