import { CardContent, Typography, Card } from "@mui/material";
import { userOption } from "../../../fakeData/fakeData";
import "./style.scss";

const UserOption = () => {
  return (
    <Typography component="div" className="user-option-container">
      <Card>
        <CardContent>
          {userOption.map((option) => {
            return (
              <Typography component="div" className="user-option-item">
                <Typography
                  component="div"
                  className="option-icon"
                >{option.icon}</Typography>
                <Typography
                  component="div"
                  className="option-name"
                >{option.name}</Typography>
              </Typography>
            );
          })}
        </CardContent>
      </Card>
    </Typography>
  );
};

export default UserOption;
