import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import GroupIcon from "@mui/icons-material/Group";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

export const notificationType = {
  NOTIFICATION: "NOTIFICATION",
  MESSAGE: "MESSAGE",
};

export const privacyPostType = [
  {
    value: "PUBLIC",
    label: "Public",
    icon: <PublicIcon />,
  },
  {
    value: "ONLY_YOU",
    label: "Only you",
    icon: <LockIcon />,
  },
  {
    value: "FRIENDS",
    label: "Your friends",
    icon: <PermContactCalendarIcon />,
  },
  {
    value: "FRIENDS_OF_FRIENDS",
    label: "Friends of your friends",
    icon: <GroupIcon />,
  },
];
