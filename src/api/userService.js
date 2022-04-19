import axiosConfig from "./axiosConfig";
import { API_ENDPOINT_KEYS } from "./constants";

export const login = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.LOGIN, data);
};

export const renewToken = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.RENEW_TOKEN, data);
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
  return await axiosConfig.delete(`${API_ENDPOINT_KEYS.FOLLOWING}/${account}`)
}

export const followUserById = async (account) => {
  return await axiosConfig.post(`${API_ENDPOINT_KEYS.FOLLOWING}/${account}`)
}