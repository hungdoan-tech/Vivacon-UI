import _ from "lodash";
import { getCurrentUser } from "./jwtToken";

export const substringUsername = (username) => {
  return username.length > 20 ? `${username.substring(0, 19)}...` : username;
};

export const splitUserName = (participants) => {
  console.log({participants})
  participants.map((user, index) => {
    if (user.username === getCurrentUser().username) {
      participants[index].fullName = "Me";
    }
  });
  if (participants.length > 2) {
    return participants.reduce(
      (prev, next) => prev.fullName + ", " + next.fullName
    );
  } else {
    return participants.filter((user) => user.fullName !== "Me")[0].fullName;
  }
};

export const resolveName = (name, field) => {
  if (name === getCurrentUser()[field]) {
    return "Me";
  } else {
    return name;
  }
};
