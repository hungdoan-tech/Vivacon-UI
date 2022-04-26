import axios from "axios";
import axiosConfig from "./axiosConfig";
import { API_ENDPOINT_KEYS } from "./constants";

export const login = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.LOGIN, data);
};

export const register = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.REGISTER, data);
};

export const verify = async (data) => {
  var config = {
    method: "post",
    url: "http://localhost:8080/api/v1" + API_ENDPOINT_KEYS.VERIFY,
    headers: {
      accept: "*/*",
      "Content-Type": "text/plain",
    },
    data,
  };

  return await axios(config);
};

export const resendToken = async (data) => {
  var config = {
    method: "post",
    url: "http://localhost:8080/api/v1" + API_ENDPOINT_KEYS.RESEND,
    headers: {
      accept: "*/*",
      "Content-Type": "text/plain",
    },
    data,
  };

  return await axios(config);
};

export const forgotPassword = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.FORGOT, data);
};

export const changePassword = async (data) => {
  return await axiosConfig.put(API_ENDPOINT_KEYS.FORGOT, data);
};

export const getUserInformation = async (email) => {
  return await axiosConfig.get(`${API_ENDPOINT_KEYS.CHECK}`, {
    params: { email },
  });
};

export const uploadImage = async (data) => {
  return await axiosConfig.post(`${API_ENDPOINT_KEYS.ATTACTMENT}`, data);
};

export const changeProfileAvatar = async (data) => {
  return await axiosConfig.post(`${API_ENDPOINT_KEYS.CHANGE_AVATAR}`, data);
};

export const getProfile = async (username) => {
  return await axiosConfig.get(`${API_ENDPOINT_KEYS.GET_PROFILE}/${username}`);
};

export const getFollowingUsersById = async (account) => {
  return await axiosConfig.get(`${API_ENDPOINT_KEYS.FOLLOWING}/${account}`);
};

export const getFollowersById = async (account) => {
  return await axiosConfig.get(`${API_ENDPOINT_KEYS.FOLLOWER}/${account}`);
};

export const unfollowUserById = async (account) => {
  return await axiosConfig.delete(`${API_ENDPOINT_KEYS.FOLLOWING}/${account}`);
};

export const followUserById = async (account) => {
  return await axiosConfig.post(`${API_ENDPOINT_KEYS.FOLLOWING}/${account}`);
};

export const renewToken = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.RENEW_TOKEN, data);
};
