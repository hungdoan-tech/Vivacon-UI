import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  AppBar,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import "./style.scss";
import StepperChange from "./StepperChange";
import UploadImageTab from "./UploadImageTab";
import classNames from "classnames";

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const CreatePostModal = (props) => {
  const { open, handleClose } = props;
  const [value, setValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Upload image(s)", "Crop", "Edit", "Write caption"];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleCloseModal();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      return null;
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setActiveStep(0);
  };

  const hideButtonClass = classNames({
    hidden: activeStep === 0 || activeStep > steps.length - 1,
  });

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-container"
    >
      <Card className="create-post-container">
        <CardContent>
          <Box sx={{ width: "100%", height: "100%" }}>
            <AppBar className="create-post-header">
              <Button
                className={`btn-container ${hideButtonClass}`}
                onClick={handleBack}
              >
                <ChevronLeftOutlinedIcon />
                Back
              </Button>
              <Typography className="title">Create new post</Typography>
              <Button className="btn-container" onClick={handleNext}>
                {activeStep === steps.length - 1 ? (
                  "Finish"
                ) : (
                  <>
                    Next <ChevronRightOutlinedIcon />
                  </>
                )}
              </Button>
            </AppBar>
            <StepperChange steps={steps} activeStep={activeStep} />
            <TabPanel value={activeStep} index={0} className="tab-container">
              <UploadImageTab />
            </TabPanel>
            <TabPanel value={activeStep} index={1} className="tab-container">
              Item Two
            </TabPanel>
            <TabPanel value={activeStep} index={2} className="tab-container">
              Item Three
            </TabPanel>
            <TabPanel value={activeStep} index={3} className="tab-container">
              Item Four
            </TabPanel>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default CreatePostModal;
