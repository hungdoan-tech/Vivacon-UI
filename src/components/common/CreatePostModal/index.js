import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  AppBar,
  Button,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import "./style.scss";
import StepperChange from "components/common/CreatePostModal/StepperChange";
import UploadImageTab from "components/common/CreatePostModal/UploadImageTab";
import classNames from "classnames";
import EditImagesTab from "components/common/CreatePostModal/EditImagesTab";
import ConfirmDialog from "components/common/ConfirmDialog";
import WriteCaptionTab from "components/common/CreatePostModal/WriteCaptionTab";
import { uploadImages } from "api/postService";
import { Loading, Snackbar } from "App";
import { privacyPostType } from "constant/types";
import { createPost } from "api/postService";

const TabPanel = (props) => {
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
};

const CreatePostModal = (props) => {
  const { open, handleClose } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [pictures, setPictures] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [privacy, setPrivacy] = useState(privacyPostType[0].value);
  const [caption, setCaption] = useState("");

  const { setLoading } = useContext(Loading);
  const { setSnackbarState } = useContext(Snackbar);

  const steps = ["Upload image(s)", "Edit", "Write caption"];

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      const data = new FormData();
      pictures.map((item) => {
        data.append("files", item.file);
      });
      const { data: attachments } = await uploadImages(data);
      handlePost({
        privacy,
        caption,
        attachments,
      });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleSaveImages = (pictureFiles) => {
    pictureFiles.map((pic) => {
      setPictures((prev) => [
        ...prev,
        { src: URL.createObjectURL(pic), file: pic },
      ]);
    });
    if (activeStep === 0) {
      handleNext();
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      return null;
    }
    if (activeStep === 1) {
      setIsBack(true);
      setOpenConfirmDialog(true);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCloseModal = () => {
    if (activeStep > 0) {
      setOpenConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  const handleRemoveImage = (image) => {
    setPictures(pictures.filter((item) => item !== image));
  };

  const handleEditedUpdateImage = (newImageSrc, newImageFile, index) => {
    pictures[index].src = newImageSrc;
    pictures[index].file = newImageFile;
    setPictures([...pictures]);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmDialog = () => {
    if (isBack) {
      setActiveStep(0);
      setIsBack(false);
    } else {
      handleClose();
      setActiveStep(0);
    }
    setPictures([]);
    setOpenConfirmDialog(false);
  };

  const handlePrivacySelectChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handlePost = (data) => {
    createPost(data)
      .then((res) => {
        handleClose();
        setActiveStep(0);
        setPictures([]);

        setTimeout(() => {
          setSnackbarState({
            open: true,
            content: "Create a post successfully",
          });
        }, 1000);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (pictures.length === 0) {
      setActiveStep(0);
    }
  }, [pictures]);

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
              <Button
                className={`btn-container ${hideButtonClass}`}
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? (
                  "Post"
                ) : (
                  <>
                    Next <ChevronRightOutlinedIcon />
                  </>
                )}
              </Button>
            </AppBar>
            <StepperChange steps={steps} activeStep={activeStep} />
            <TabPanel value={activeStep} index={0} className="tab-container">
              <UploadImageTab
                handleNextTab={handleNext}
                handleSaveImages={handleSaveImages}
              />
            </TabPanel>
            <TabPanel value={activeStep} index={1} className="tab-container">
              <EditImagesTab
                pictures={pictures}
                handleRemoveImage={handleRemoveImage}
                handleSaveImages={handleSaveImages}
                handleEditedUpdateImage={handleEditedUpdateImage}
              />
            </TabPanel>
            <TabPanel value={activeStep} index={2} className="tab-container">
              <WriteCaptionTab
                pictures={pictures}
                privacy={privacy}
                caption={caption}
                handleRemoveImage={handleRemoveImage}
                handleSaveImages={handleSaveImages}
                handleSelectChange={handlePrivacySelectChange}
                handleCaptionChange={handleCaptionChange}
              />
            </TabPanel>
          </Box>
          <ConfirmDialog
            handleClose={handleCloseConfirmDialog}
            handleConfirm={handleConfirmDialog}
            open={openConfirmDialog}
            title={"Confirm"}
            description={
              "This action can delete all images on draft. Are you sure?"
            }
          />
        </CardContent>
      </Card>
    </Modal>
  );
};

export default CreatePostModal;
