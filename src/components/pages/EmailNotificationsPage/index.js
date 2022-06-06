import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
  FormLabel,
} from "@mui/material";
import { emailNotificationFields } from "constant/data";
import { useState, useEffect } from "react";
import "./style.scss";

const EmailNotificationsPage = () => {
  return (
    <Typography component="div" className="email-noti-container">
      <Typography component="div" className="email-noti-title">
        Subsribe to:
      </Typography>
      {emailNotificationFields.map((item) => (
        <FormControl className="field-checkbox-container">
          <FormControlLabel
            control={<Checkbox />}
            label={item.title}
            className="checkbox-title"
          />
          <Typography className="checkbox-text">{item.checkBoxText}</Typography>
        </FormControl>
      ))}
    </Typography>
  );
};

export default EmailNotificationsPage;
