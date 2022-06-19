import { Typography } from "@mui/material";
import "./style.scss";

const hashtagList = [
  {
    title: "#GOGO",
    share: "85k",
  },
  {
    title: "#Football",
    share: "200k",
  },
  {
    title: "#Pizza",
    share: "100k",
  },
  {
    title: "#SuperStar",
    share: "40k",
  },
  {
    title: "#Dog",
    share: "79k",
  },
  {
    title: "#Hamburger",
    share: "185k",
  },
  {
    title: "#Hamburger",
    share: "185k",
  },
  {
    title: "#Hamburger",
    share: "185k",
  },
  {
    title: "#Hamburger",
    share: "185k",
  },
  {
    title: "#Hamburger",
    share: "185k",
  },
  {
    title: "#Hamburger",
    share: "185k",
  },
];

const SuggestedHashtag = () => {
  return (
    <Typography component="div" className="suggested-hashtag">
      <Typography className="title">Trends for you</Typography>
      <Typography className="hashtag-list">
        {hashtagList.map((item) => {
          return (
            <Typography className="hashtag-item">
              <Typography className="hashtag-title">{item.title}</Typography>
              <Typography className="hashtag-share">
                {item.share} share
              </Typography>
            </Typography>
          );
        })}
      </Typography>
    </Typography>
  );
};

export default SuggestedHashtag;
