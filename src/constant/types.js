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
    label: "privacy.public",
    icon: <PublicIcon />,
  },
  {
    value: "ONLY_ME",
    label: "privacy.onlyMe",
    icon: <LockIcon />,
  },
  {
    value: "FOLLOWER",
    label: "privacy.follower",
    icon: <PermContactCalendarIcon />,
  },
];

export const chattingType = {
  TYPING: "TYPING",
  USUAL_TEXT: "USUAL_TEXT",
  NEW_PARTICIPANT: "NEW_PARTICIPANT",
};
