import React, { useState } from "react";
import "./style.scss";
import Logo from "../imgs/logo.png";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import MainDash from "./OverallDashboard";

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

const Sidebar = ({ setSelected, selected }) => {
  const [expanded, setExpaned] = useState(true);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };
  console.log(window.innerWidth);
  return (
    <div className="sidebar-container">
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpaned(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        <div className="menu">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              {SidebarData.map((item, index) => {
                return (
                  <div
                    className={
                      selected === index ? "menuItem active" : "menuItem"
                    }
                    key={index}
                    onClick={() => setSelected(index)}
                  >
                    <item.icon />
                    <span>{item.heading}</span>
                  </div>
                );
              })}
            </Box>
            {/* <TabPanel value={selected} index={0}>
              <MainDash />
            </TabPanel>
            <TabPanel value={selected} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={selected} index={2}>
              Item Three
            </TabPanel> */}
          </Box>

          {/* signoutIcon */}
          {/* <div className="menuItem">
            <UilSignOutAlt />
          </div> */}
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
