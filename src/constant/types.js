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

export const limitPerPage = [5, 10, 20, 30, 50];

export const reportContent = [
  {
    sentitiveType: "NUDITY",
    content: "Ảnh khỏa thân hoặc hoạt động tình dục",
  },
  {
    sentitiveType: "VIOLENCE",
    content: "Bạo lực hoặc tổ chức nguy hiểm",
  },
  {
    sentitiveType: "SUICIDE",
    content: "Tự tử hoặc tự gây thương tích",
  },
  {
    sentitiveType: "TERRORISM",
    content: "Biểu tượng hoặc ngôn từ gây thù ghét",
  },
  {
    sentitiveType: "SPAM",
    content: "Đây là spam",
  },
  {
    sentitiveType: "OTHER",
    content: "Chỉ là tôi không thích nội dung này",
  },
];

// "Bán hàng hóa phi pháp hoặc thuộc diện kiểm soát",
// "Bắt nạt hoặc quấy rối",
// "Vi phạm quyền sở hữu trí tuệ",
// "Rối loạn ăn uống",
// "Lừa đảo hoặc gian lận",
// "Thông tin sai sự thật",
// "",

export const PERIOD = {
  MONTHS: "months",
  QUARTERS: "quarters",
  YEARS: "years",
};
