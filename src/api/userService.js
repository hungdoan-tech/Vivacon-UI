import axiosConfig from "./axiosConfig";
import { API_ENDPOINT_KEYS } from "./constants";

export const login = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.LOGIN, data);
};

export const renewToken = async (data) => {
  return await axiosConfig.post(API_ENDPOINT_KEYS.RENEW_TOKEN, data);
};

export const getProfile = async (username, data) => {
  return await axiosConfig.get(`${API_ENDPOINT_KEYS.GET_PROFILE}/${username}`, {
    params: data,
  });
};

export const getFollowingUsersById = async (data) => {
  const { _sort, limit, _order } = data;
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.FOLLOWING}/${data.account}`,
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

export const getFollowersById = async (data) => {
  const { _sort, limit, _order } = data;
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.FOLLOWER}/${data.account}`,
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

export const unfollowUserById = async (account) => {
  return await axiosConfig.delete(`${API_ENDPOINT_KEYS.FOLLOWING}/${account}`);
};

export const followUserById = async (account) => {
  return await axiosConfig.post(`${API_ENDPOINT_KEYS.FOLLOWING}/${account}`);
};
