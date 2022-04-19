import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import { Typography } from "@mui/material";

import "./style.scss";

const CustomPopUp = (props) => {
  const { component: Component, width, height } = props;

  return (
    <Typography
      component="div"
      className="pop-up-container"
      style={{
        "--popUpWidth": `${width || 300}px`,
        "--popUpHeight": `${height || 300}px`,
      }}
    >
      <Component />
    </Typography>
  );
};

export default CustomPopUp;
