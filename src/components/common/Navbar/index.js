import React, { useState, useEffect, useContext } from "react";
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
import { getCurrentUser } from "utils/jwtToken";
import AppButtonsGroup from "components/common/AppButtonsGroup";
import UserOption from "components/common/UserOption";
import CreatePostModal from "components/common/CreatePostModal";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthUser } from "App";

const Navbar = () => {
  const [openUserOption, setUserOption] = useState(false);
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const history = useHistory();
  const Auth = useContext(AuthUser);

  const { t: trans } = useTranslation();

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
      <Typography
        className="app-logo"
        align="center"
        onClick={() => history.push("/")}
      >
        VivaCon
      </Typography>

      <AppButtonsGroup handleOpenCreatePostModal={handleOpenCreatePostModal} />
      {!Auth.auth.isAdmin && (
        <>
          <Typography className="app-search" component="div" align="center">
            <SearchIcon className="search-icon" />
            <InputBase
              className="search-text"
              placeholder={`${trans("navbar.search")}...`}
            />
          </Typography>
          <AppButtonsGroup
            handleOpenCreatePostModal={handleOpenCreatePostModal}
          />
        </>
      )}
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
                  src={getCurrentUser().avatar}
                  width="45"
                  height="45"
                  alt=""
                />
              </Typography>
            </Button>
            {openUserOption && (
              <UserOption handleClose={() => setUserOption(false)} />
            )}
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
