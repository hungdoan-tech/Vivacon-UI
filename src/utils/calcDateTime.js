import moment from 'moment';
export const calculateFromNow = (dateTime) => {
    return moment(dateTime.getTime()).fromNow();
}