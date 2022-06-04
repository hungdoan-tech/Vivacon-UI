import axiosConfig from "./axiosConfig";
import { API_ENDPOINT_KEYS } from "./constants";

export const getNotificationList = async (data) => {
  const { limit, page, _sort, _order } = data;
  return await axiosConfig.get(`${API_ENDPOINT_KEYS.NOTIFICATION}`, {
    params: {
      limit,
      page,
      _sort,
      _order,
    },
  });
};
