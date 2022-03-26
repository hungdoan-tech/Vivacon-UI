import {
  InputBase,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import "./style.scss";
import ImagesCarousel from "../ImagesCarousel";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import "./style.scss";
import { privacyPostType } from "../../../constant/types";

const WriteCaptionTab = (props) => {
  const { handleSaveImages, pictures, handleRemoveImageAtIndex } = props;
  const [privacy, setPrivacy] = useState(privacyPostType[0].value);

  const handleSelectChange = (event) => {
    setPrivacy(event.target.value);
  };

  useEffect(() => {
    console.log({ privacy });
  }, [privacy]);

  return (
    <>
      <Typography
        component="div"
        align="left"
        className="write-caption-container"
      >
        <Typography component="div" align="left" className="owner-container">
          <img
            src={require("../../../fakeData/avatar.png")}
            width="50"
            height="50"
            alt=""
          />
          <Typography align="left" className="right-container">
            <Typography align="left" className="owner-name">
              John
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
          />
          <Typography className="different-text-icon" component="div">
            <InsertEmoticonOutlinedIcon />
          </Typography>
        </Typography>
      </Typography>
      <ImagesCarousel
        pictures={pictures}
        handleRemoveImage={handleRemoveImageAtIndex}
        handleSaveImages={handleSaveImages}
      />
    </>
  );
};

export default WriteCaptionTab;
