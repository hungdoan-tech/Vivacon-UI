import axiosConfig from "./axiosConfig";
import { API_ENDPOINT_KEYS } from "./constants";

export const uploadImages = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.UPLOAD_IMAGE, data);
};

export const createPost = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.CREATE_POST, data);
};

export const getPostsByUserName = async (data) => {
  const { _sort, limit, _order } = data;
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.GET_PROFILE}/${data.username}/outline-post`,
    {
      params: {
        _sort,
        _order,
        limit,
        page: data.page,
      },
    }
  );
};

export const getNewFeed = async (data) => {
  const { limit, page } = data;
  return await axiosConfig.get(`${API_ENDPOINT_KEYS.NEWFEED}`, {
    params: {
      limit,
      page,
    },
  });
};
