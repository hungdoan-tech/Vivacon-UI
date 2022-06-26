import moment from "moment/min/moment-with-locales";
import { getCurrentLanguage } from "translation/util";

const offset = new Date().getTimezoneOffset();
export const calculateFromNow = (dateTime) => {
  const locale = getCurrentLanguage();
  moment.locale(locale);
  return moment(new Date(dateTime).getTime()).fromNow();
};

export const convertUTCtoLocalDate = (date, format) => {
  const convertedDate = moment(date)
    .add(-offset, "minutes")
    .format(format || "YYYY-MM-DDTHH:mm:ss.SSSsss");
  return convertedDate;
};

export const convertDateTimeOnNearest = (date) => {
  const locale = getCurrentLanguage();
  moment.locale(locale);
  const convertedDate = moment(date).add(-offset, "minutes").calendar();
  return convertedDate
};
