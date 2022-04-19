import {
  InputBase,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import "./style.scss";
import ImagesCarousel from "components/common/CreatePostModal/ImagesCarousel";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import "./style.scss";
import { privacyPostType } from "constant/types";
import Emoji from "react-emoji-render";
import { getCurrentUser } from "utils/jwtToken";

const WriteCaptionTab = (props) => {
  const {
    handleSaveImages,
    pictures,
    handleRemoveImageAtIndex,
    handleCaptionChange,
    handleSelectChange,
    caption,
    privacy,
  } = props;
  return (
    <>
      <Typography
        component="div"
        align="left"
        className="write-caption-container"
      >
        <Typography component="div" align="left" className="owner-container">
          <img
            src={getCurrentUser().avatar}
            width="50"
            height="50"
            alt=""
          />
          <Typography align="left" className="right-container">
            <Typography align="left" className="owner-name">
              {getCurrentUser().username}
            </Typography>
            <Typography
              component="div"
              align="left"
              className="select-privacy-container"
            >
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={privacy}
                  onChange={handleSelectChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {privacyPostType.map((item) => {
                    return (
                      <MenuItem value={item.value} className="item-select">
                        <Typography className="item-icon">
                          {item.icon}
                        </Typography>
                        <Typography className="item-label">
                          {item.label}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Typography>
          </Typography>
        </Typography>
        <Typography className="caption-input" component="div">
          <InputBase
            placeholder="Write a caption..."
            fullWidth={true}
            maxRows={8}
            multiline={true}
            onChange={handleCaptionChange}
            value={caption}
          />
          <Typography className="different-text-icon" component="div">
            <InsertEmoticonOutlinedIcon />
          </Typography>
        </Typography>
      </Typography>
      {/* <Emoji text="This <3 :( sentence includes :+1: (y) a variety of emoji types :)" /> */}
      <ImagesCarousel
        pictures={pictures}
        handleRemoveImage={handleRemoveImageAtIndex}
        handleSaveImages={handleSaveImages}
      />
    </>
  );
};

export default WriteCaptionTab;
