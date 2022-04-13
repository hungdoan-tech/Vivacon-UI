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
    value: "ONLY_ME",
    label: "Only me",
    icon: <LockIcon />,
  },
  {
    value: "FOLLOWER",
    label: "Follower",
    icon: <PermContactCalendarIcon />,
  },
];
