import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography, ImageList, ImageListItem } from "@mui/material";
import Box from "@mui/material/Box";
import AppsIcon from "@mui/icons-material/Apps";
import { withRouter } from "react-router-dom";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import FilterNoneRoundedIcon from "@mui/icons-material/FilterNoneRounded";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import "./style.scss";
import { getPostsByUserName } from "api/postService";
import InfiniteList from "../InfiniteList";

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserImagesTabs = (props) => {
  const [value, setValue] = useState(0);
  const [username, setUsername] = useState(props.match.params.username);
  // const { username } = props.match.params;

  useEffect(() => {
    // handleGetPostsByUserName(0);
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setUsername(props.match.params.username);
  }, [props.match.params.username]);

  const renderTabLabel = ({ icon: IconComponent, label }) => {
    return (
      <p className="tab-container">
        <IconComponent className="tab-icon" />{" "}
        <p className="tab-label">{label}</p>
      </p>
    );
  };

  return (
    <Box sx={{ width: "100%" }} className="images-list-container">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label={renderTabLabel({ icon: AppsIcon, label: "POSTS" })}
            {...a11yProps(0)}
          />
          <Tab
            label={renderTabLabel({ icon: RecentActorsIcon, label: "AVATAR" })}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <InfiniteList
          container={ImagesListContainer}
          handleGetData={getPostsByUserName}
          data={{
            username,
            _sort: "createdAt",
            _order: "desc",
            limit: 9,
          }}
          component={ImageItem}
          noDataComponent={noDataComponent}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </Box>
  );
};

const ImageItem = ({ item, key }) => {
  return (
    <ImageListItem key={key} className="image-item">
      <img
        src={`${item.firstImage}`}
        srcSet={`${item.firstImage}`}
        alt={item.id}
        loading="lazy"
      />
      {item.multipleImages && (
        <PhotoLibraryIcon className="multi-images-icon" />
      )}
      <Typography className="post-action-btns">
        <Typography className="number-of-action">
          <FavoriteRoundedIcon className="action-icon" />{" "}
          <p>{item.likeCount}</p>
        </Typography>
        <Typography className="number-of-action">
          <ChatBubbleRoundedIcon className="action-icon" />{" "}
          <p>{item.commentCount}</p>
        </Typography>
      </Typography>
    </ImageListItem>
  );
};

const ImagesListContainer = ({ _renderItem }) => {
  return (
    <ImageList
      sx={{ width: "100%",}}
      cols={3}
      gap={30}
      style={{ position: "relative", overflow: 'hidden' }}
      rowHeight={280}
    >
      {_renderItem}
    </ImageList>
  );
};

const noDataComponent = () => {
  return (
    <Typography component="div" className="no-data-container">
      <ImageList
        sx={{ width: 360, height: 366 }}
        cols={3}
        gap={3}
        rowHeight={120}
      >
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Typography className="start-post-text">
        Start capturing and sharing your moments with us.
      </Typography>
    </Typography>
  );
};

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
];

export default withRouter(UserImagesTabs);