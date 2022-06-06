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
    id: 1,
    sentitiveType: "NUDITY",
    content: "Ảnh khỏa thân hoặc hoạt động tình dục",
    detailContent: [
      "Ảnh, video và một số nội dung kỹ thuật số hiển thị cảnh quan hệ tình dục, bộ phận sinh dục và ảnh cận cảnh mông trần.",
      "Hình ảnh thân mật nhạy cảm của người khác, bị chia sẻ khi chưa được phép.",
      "Một số ảnh có xuất hiện núm vú của phụ nữ. Tuy nhiên, chúng tôi cho phép đăng video về những vết sẹo sau phẫu thuật cắt bỏ ngực và cảnh phụ nữ đang chủ động cho con bú.",
      "Cảnh khỏa thân trong ảnh chụp tranh vẽ và tác phẩm điêu khắc được chấp nhận.",
      "Đôi khi, chúng tôi có thể gỡ video có cảnh trẻ em khỏa thân hoặc bán khỏa thân.",
    ],
  },
  {
    id: 2,
    sentitiveType: "VIOLENCE",
    content: "Bạo lực hoặc tổ chức nguy hiểm",
    detailContent: [
      "Ảnh hoặc video quá bạo lực.",
      "Bài viết xúi giục hành vi bạo lực hoặc tấn công bất kỳ ai dựa trên tôn giáo, dân tộc hoặc giới tính của họ.",
      "Mối đe dọa cụ thể về gây tổn thương thân thể, trộm cắp, phá hoại hoặc thiệt hại tài chính.",
    ],
  },
  {
    id: 3,
    sentitiveType: "SUICIDE",
    content: "Tự tử hoặc tự gây thương tích",
    detailContent: [
      "Bài viết cổ xúy hoặc khuyến khích hành vi tự gây thương tích, bao gồm tự tử và cắt rạch cơ thể.",
      "Bình luận nêu tên nạn nhân của hành vi tự gây thương tích với ý đồ công kích hoặc chế nhạo họ.",
    ],
  },
  {
    id: 4,
    sentitiveType: "TERRORISM",
    content: "Biểu tượng hoặc ngôn từ gây thù ghét",
    detailContent: [
      "Ảnh/video về biểu tượng hoặc ngôn từ gây thù ghét.",
      "Bài viết có chú thích khuyến khích bạo lực hoặc tấn công bất kỳ ai dựa trên đặc điểm của họ.",
      "Mối đe dọa cụ thể về tổn thương thân thể, trộm cắp hoặc phá hoại.",
    ],
  },
  {
    id: 5,
    sentitiveType: "SPAM",
    content: "Đây là spam",
    detailContent: [
      "Ảnh/video về liên quan đến spam",
      "Bài viết có những liên quan đến spam",
    ],
  },
  {
    id: 6,
    sentitiveType: "OTHER",
    content: "Nội dung này không phù hợp",
    detailContent: [
      "Nội dung này không nằm trong sở thích",
      "Nội dung này gây phiền toái",
    ],
  },
];

export const PERIOD = {
  MONTHS: "months",
  QUARTERS: "quarters",
  YEARS: "years",
};

export const chattingType = {
  TYPING: "TYPING",
  USUAL_TEXT: "USUAL_TEXT",
  NEW_PARTICIPANT: "NEW_PARTICIPANT",
};
