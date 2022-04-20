import cookie from "js-cookie";

const cookieConfig = {
  path: "/",
  secure: true,
  sameSite: "strict",
  expires: 7,
};

export const setCookieData = (key, value) => {
  cookie.set(key, value, cookieConfig);
};

export const saveJwtToken = (token) => {
  setCookieData("jwt-token", token);
};

export const saveRefreshToken = (token) => {
  setCookieData("refresh-token", token);
};

export const saveDeviceToken = (token) => {
  setCookieData("device-token", token);
};

export const getJwtToken = () => {
  return cookie.get("jwt-token");
};

export const getRefreshToken = () => {
  return cookie.get("refresh-token");
};

export const getDeviceToken = () => {
  return cookie.get("device-token");
};

export const removeJwtToken = () => {
  return cookie.remove("jwt-token");
};

export const removeRefreshToken = () => {
  return cookie.remove("refresh-token");
};

export const removeDeviceToken = () => {
  return cookie.remove("device-token");
};

export const isExpiredToken = () => !getJwtToken();