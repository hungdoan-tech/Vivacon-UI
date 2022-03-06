import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, AppBar, Button, Typography, ClickAwayListener, Box } from "@mui/material";
import "./style.scss";
import AppButtonsGroup from "../AppButtonsGroup";
import UserOption from "../UserOption"

const Navbar = () => {
  const [openUserOption, setUserOption] = React.useState(false);

  const handleClickAwayUserOption = () => {
    setUserOption(false);
  }
  const handleOpenUserOption = () => {
    setUserOption(!openUserOption);
  }
  return (
    <AppBar className="nav-container" postion="sticky">
      <Typography className="app-logo" align="center">
        VivaCon
      </Typography>

      <Typography className="app-search" component="div" align="center">
        <SearchIcon className="search-icon" />
        <InputBase className="search-text" placeholder="Search..." />
      </Typography>
      <AppButtonsGroup />
      <Typography className="app-user" component="div" align="center">
        <ClickAwayListener onClickAway={handleClickAwayUserOption}>
          <Box sx={{ position: "relative" }}>
            <Button onClick={handleOpenUserOption}>
              <Typography
                className="user-avatar"
                component="div"
                align="center"
              >
                <img
                  src={require("../../../fakeData/avatar.png")}
                  width="50"
                  height="50"
                  alt=""
                />
              </Typography>
              <Typography className="user-name">John</Typography>
            </Button>
            {openUserOption && <UserOption />}
          </Box>
        </ClickAwayListener>
      </Typography>
    </AppBar>
  );
};

export default Navbar;
