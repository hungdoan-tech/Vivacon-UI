import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { settingOption } from "constant/data";
import EditProfilePage from "components/pages/EditProfilePage";
import "./style.scss";
import PushNotificationsPage from "../PushNotificationsPage";
import EmailNotificationsPage from "../EmailNotificationsPage";
import ChangePasswordPage from "../ChangePasswordPage";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SettingPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }} className="user-setting-container">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
          className="tabs-option-container"
        >
          {settingOption.map((item, index) => {
            return <Tab label={item.label} {...a11yProps(index)} />;
          })}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} className="setting-content">
        <EditProfilePage />
      </TabPanel>
      <TabPanel value={value} index={1} className="setting-content">
        <ChangePasswordPage />
      </TabPanel>
      <TabPanel value={value} index={2} className="setting-content">
        <EmailNotificationsPage />
      </TabPanel>
      <TabPanel value={value} index={3} className="setting-content">
        <PushNotificationsPage />
      </TabPanel>
    </Box>
  );
}
