import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { removeJwtToken, removeRefreshToken } from "utils/cookie";
import { useNavigate } from "react-router-dom";
const notiType = {
  POST: "POST",
  FOLLOWED: "FOLLOWED",
  LIKED: "LIKED",
  COMMENTED: "COMMENTED",
};

export const notificationList = [
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Matt",
    type: notiType.POST,
    numberOfImages: 3,
    url: "/",
    seen: false,
    dateTime: new Date("2022-02-22T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Marry",
    type: notiType.LIKED,
    numberOfImages: null,
    url: "/",
    seen: false,
    dateTime: new Date("2022-01-12T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "John",
    type: notiType.LIKED,
    numberOfImages: null,
    url: "/",
    seen: true,
    dateTime: new Date("2022-01-12T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Marry",
    type: notiType.COMMENTED,
    numberOfImages: null,
    url: "/",
    seen: false,
    dateTime: new Date("2022-01-12T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Williams",
    type: notiType.POST,
    numberOfImages: 5,
    url: "/",
    seen: true,
    dateTime: new Date("2021-12-12T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Robert",
    type: notiType.POST,
    numberOfImages: 1,
    url: "/",
    seen: true,
    dateTime: new Date("2021-08-12T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Robert",
    type: notiType.POST,
    numberOfImages: 1,
    url: "/",
    seen: true,
    dateTime: new Date("2021-06-12T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Robert",
    type: notiType.POST,
    numberOfImages: 1,
    url: "/",
    seen: true,
    dateTime: new Date("2021-04-12T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Robert",
    type: notiType.POST,
    numberOfImages: 1,
    url: "/",
    seen: true,
    dateTime: new Date("2021-03-12T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Robert",
    type: notiType.POST,
    numberOfImages: 1,
    url: "/",
    seen: true,
    dateTime: new Date("2021-02-12T20:17:46.384Z"),
  },
];

export const messageList = [
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Matt",
    newestMessage: "Hello John!",
    isYourNewestMessage: false,
    url: "/",
    seen: false,
    dateTime: new Date("2022-02-22T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Marry",
    newestMessage: "Hello John!",
    isYourNewestMessage: false,
    url: "/",
    seen: false,
    dateTime: new Date("2022-02-22T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Williams",
    newestMessage: "Can you help me, John?",
    isYourNewestMessage: false,
    url: "/",
    seen: false,
    dateTime: new Date("2022-02-22T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Matt",
    newestMessage: "Bye!",
    isYourNewestMessage: true,
    url: "/",
    seen: true,
    dateTime: new Date("2022-02-22T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Matt",
    newestMessage: "Hello Matt!",
    isYourNewestMessage: true,
    url: "/",
    seen: true,
    dateTime: new Date("2022-02-22T20:17:46.384Z"),
  },
  {
    avatar: "images/fr-avatar.png",
    ownerName: "Matt",
    newestMessage: "Hello John!",
    isYourNewestMessage: false,
    url: "/",
    seen: true,
    dateTime: new Date("2022-02-22T20:17:46.384Z"),
  },
];

export const userOption = [
  {
    icon: <AccountCircleIcon />,
    name: "settingUI.profile",
    onClickHandle: () => null,
    navigateUrl: "/profile",
  },
  {
    icon: <DashboardIcon />,
    name: "dashboard.dashboard",
    onClickHandle: () => null,
    navigateUrl: "/dashboard",
  },
  {
    icon: <SettingsIcon />,
    name: "settingUI.setting",
    onClickHandle: () => null,
    navigateUrl: "/",
  },
  {
    icon: <LogoutOutlinedIcon />,
    name: "settingUI.logOut",
    onClickHandle: () => {
      removeJwtToken();
      removeRefreshToken();
    },
    navigateUrl: "/login",
  },
];
