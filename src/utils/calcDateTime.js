import moment from "moment";

const offset = new Date().getTimezoneOffset();
export const calculateFromNow = (dateTime) => {
  return moment(new Date(dateTime).getTime()).fromNow();
};

export const convertUTCtoLocalDate = (date) => {
  const convertedDate = moment(date)
    .add(-offset, "minutes")
    .format("YYYY-MM-DDTHH:mm:ss.SSSsss");
  return convertedDate;
};
