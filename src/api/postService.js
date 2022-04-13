import axiosConfig from "./axiosConfig";
import { API_ENDPOINT_KEYS } from "./constants";

export const uploadImages = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.UPLOAD_IMAGE, data);
};

export const createPost = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.CREATE_POST, data);
};
