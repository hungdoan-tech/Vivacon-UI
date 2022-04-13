import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  InputBase,
  AppBar,
  Button,
  Typography,
  ClickAwayListener,
  Box,
} from "@mui/material";
import "./style.scss";
import AppButtonsGroup from "components/common/AppButtonsGroup";
import UserOption from "components/common/UserOption";
import CreatePostModal from "components/common/CreatePostModal";

const Navbar = () => {
  const [openUserOption, setUserOption] = React.useState(false);
  const [openCreatePostModal, setOpenCreatePostModal] = React.useState(false);


  const handleClickAwayUserOption = () => {
    setUserOption(false);
  };
  const handleOpenUserOption = () => {
    setUserOption(!openUserOption);
  };

  const handleOpenCreatePostModal = () => {
    setOpenCreatePostModal(true);
  };

  const handleCloseOpenCreatePostModal = () => {
    setOpenCreatePostModal(false);
  };
  return (
    <AppBar className="nav-container" postion="sticky">
      <Typography className="app-logo" align="center">
        VivaCon
      </Typography>

      <Typography className="app-search" component="div" align="center">
        <SearchIcon className="search-icon" />
        <InputBase className="search-text" placeholder="Search..." />
      </Typography>
      <AppButtonsGroup handleOpenCreatePostModal={handleOpenCreatePostModal} />
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
                  src={require("images/avatar.png")}
                  width="45"
                  height="45"
                  alt=""
                />
              </Typography>
            </Button>
            {openUserOption && <UserOption />}
          </Box>
        </ClickAwayListener>
      </Typography>
      <CreatePostModal
        open={openCreatePostModal}
        handleClose={handleCloseOpenCreatePostModal}
      />
    </AppBar>
  );
};

export default Navbar;
