import _ from "lodash";
import { getCurrentUser } from "./jwtToken";

export const substringUsername = (username) => {
  return username.length > 20 ? `${username.substring(0, 19)}...` : username;
};

export const splitUserName = (dataString) => {
  const split = _.split(dataString, ",");
  split.map((name, index) => {
    if (name === getCurrentUser().username) {
      split[index] = "Me";
    }
  });
  if (split.length > 2) {
    return split.reduce((prev, next) => prev + ", " + next);
  } else {
    return split.filter((name) => name !== "Me")[0];
  }
};

export const resolveName = (name, field) => {
  if (name === getCurrentUser()[field]) {
    return "Me";
  } else {
    return name;
  }
};
