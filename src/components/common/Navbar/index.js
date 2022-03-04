import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { InputBase, AppBar, Button, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import "./style.scss";

const Navbar = () => {
  return (
    <AppBar className="nav-container" postion="sticky">
      <Typography className="app-logo" align="center">
        VivaCon
      </Typography>

      <Typography className="app-search" component="div" align="center">
        <SearchIcon className="search-icon" />
        <InputBase className="search-text" placeholder="Search..." />
      </Typography>

      <Typography
        className="app-buttons-container"
        component="div"
        align="center"
      >
        <Button>
          <AddIcon />
        </Button>
        <Button>
          <HomeIcon />
        </Button>
        <Button>
          <ChatBubbleIcon />
        </Button>
        <Button>
          <NotificationsIcon className="notification-icon" />
        </Button>
      </Typography>

      <Typography className="app-user" component="div" align="center">
        <Button>
          <Typography className="user-avatar" component="div" align="center">
            <img
              src={require("../../../fakeData/avatar.png")}
              width="50"
              height="50"
              alt=""
            />
          </Typography>
          <Typography className="user-name">John</Typography>
        </Button>
      </Typography>
    </AppBar>
  );
};

export default Navbar;
