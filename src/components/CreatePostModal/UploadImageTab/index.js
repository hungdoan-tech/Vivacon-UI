import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "./style.scss";

const UploadImageTab = () => {
  return (
    <Typography className="upload-image-tab-container" component="div">
      <AddPhotoAlternateIcon className="upload-image-icon" />
      <Typography>Select image from computer</Typography>
    </Typography>
  );
};

export default UploadImageTab;
