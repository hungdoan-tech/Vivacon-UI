import * as React from "react";
import { LinearProgress, Typography } from "@mui/material";
import "./style.scss";

const Loading = () => {
  return (
    <Typography className="loading-container" component="div">
      <Typography className="progress" component="div">
        <Typography className="logo" component="div">
          <img
            src={require("../../../fakeData/LOGO_Frag01.png")}
            width="250"
            className="frag01"
            alt=""
          />
          <img
            src={require("../../../fakeData/LOGO_Frag02.png")}
            width="50"
            height="50"
            className="frag02"
            alt=""
          />
          <Typography className="shadow"></Typography>
        </Typography>
        <LinearProgress color="primary" />
      </Typography>
    </Typography>
  );
};

export default Loading;
