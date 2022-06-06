import {
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { pushNotificationsFields } from "constant/data";
import { useState, useEffect } from "react";
import "./style.scss";

const PushNotificationsPage = () => {
  return (
    <Typography component="div" className="push-noti-container">
      {pushNotificationsFields.map((item) => (
        <FormControl className="field-checkbox-container">
          <FormLabel id={item.field}>{item.title}</FormLabel>
          <RadioGroup
            aria-labelledby={item.field}
            defaultValue="off"
            name="radio-buttons-group"
          >
            <FormControlLabel value="on" control={<Radio />} label="On" />
            <FormControlLabel value="off" control={<Radio />} label="Off" />
          </RadioGroup>
        </FormControl>
      ))}
    </Typography>
  );
};

export default PushNotificationsPage;
