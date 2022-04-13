import { CardContent, Typography, Card } from "@mui/material";
import { AuthUser } from "App";
import { userOption } from "fakeData/fakeData";
import { useContext } from "react";
import "./style.scss";

const UserOption = () => {
  const Auth = useContext(AuthUser);
  return (
    <Typography component="div" className="user-option-container">
      <Card>
        <CardContent>
          {userOption.map((option) => {
            return (
              <Typography
                component="div"
                className="user-option-item"
                onClick={() => {
                  option.onClickHandle();
                  if(option.name === "Log out"){
                    window.location.reload();
                  }
                }}
              >
                <Typography component="div" className="option-icon">
                  {option.icon}
                </Typography>
                <Typography component="div" className="option-name">
                  {option.name}
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
