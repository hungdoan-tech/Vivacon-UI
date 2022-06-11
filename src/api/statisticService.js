import axiosConfig from "./axiosConfig";
import { API_ENDPOINT_KEYS } from "./constants";

export const getStatisticData = async () => {
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.STATISTIC}/getStatisticData`,
    {}
  );
};

export const getTheTopAccountMostFollowerStatistic = async (data) => {
  const { limit } = data;
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.STATISTIC}/user/most/followers`,
    {
      params: {
        limit,
      },
    }
  );
};

export const getPostQuantityStatisticInMonths = async () => {
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.STATISTIC}/post/in/months`,
    {}
  );
};

export const getPostQuantityStatisticInQuarters = async () => {
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.STATISTIC}/post/in/quarters`,
    {}
  );
};

export const getPostQuantityStatisticInYears = async () => {
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.STATISTIC}/post/in/years`,
    {}
  );
};

export const getTheTopPostInteraction = async (data) => {
  const { limit } = data;
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.STATISTIC}/post/top/interaction`,
    {
      params: {
        limit,
      },
    }
  );
};

export const getPostByNewestCreatedAt = async (data) => {
  const { limit } = data;
  return await axiosConfig.get(
    `${API_ENDPOINT_KEYS.STATISTIC}/post/top/newest`,
    {
      params: {
        limit,
      },
    }
  );
};