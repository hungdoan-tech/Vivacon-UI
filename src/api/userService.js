import axiosConfig from "./axiosConfig";
import { API_ENDPOINT_KEYS } from "./constants";

export const login = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.LOGIN, data);
};

export const renewToken = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.RENEW_TOKEN, data);
};
