import _ from "lodash";
import { getCurrentUser } from "./jwtToken";

export const substringUsername = (username) => {
  return username.length > 20 ? `${username.substring(0, 19)}...` : username;
};

export const splitUserName = (participants) => {
  participants.map((user, index) => {
    if (user.username === getCurrentUser().username) {
      participants[index].fullName = "Me";
    }
  });
  if (participants.length > 2) {
    return participants.map((user) => user.fullName).join(", ");
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

export const filterParticipants = (participants) => {
  if (participants) {
    if (participants.length > 2) {
      return _.slice(
        participants,
        0,
        participants.length > 4 ? 4 : participants.length
      );
    } else {
      return participants.filter(
        (user) => user.username !== getCurrentUser().username
      );
    }
  } else {
    return [];
  }
};

export const targetAvatarLayout = (length, index, containerDemenssion) => {
  let returnStyle = {};
  if (length >= 4) {
    if (index === 0) {
      returnStyle = {
        top: 0,
        left: 0,
        borderTopLeftRadius: containerDemenssion,
      };
    }
    if (index === 1) {
      returnStyle = {
        right: 0,
        top: 0,
        borderTopRightRadius: containerDemenssion,
      };
    }
    if (index === 3) {
      returnStyle = {
        bottom: 0,
        left: 0,
        borderBottomLeftRadius: containerDemenssion,
      };
    }
    if (index === 4) {
      returnStyle = {
        bottom: 0,
        right: 0,
        borderBottomRightRadius: containerDemenssion,
      };
    }
    return {
      width: containerDemenssion / 2 - 2,
      height: containerDemenssion / 2 - 2,
      border: "1px solid white",
      ...returnStyle,
    };
  }
  if (length === 3) {
    if (index === 0) {
      returnStyle = {
        top: 0,
        left: 0,
        width: containerDemenssion,
        height: containerDemenssion,
        borderRadius: containerDemenssion,
      };
    }
    if (index === 1) {
      returnStyle = {
        top: 0,
        right: 0,
        width: containerDemenssion / 2 - 2,
        height: containerDemenssion / 2 - 2,
        border: "1px solid white",
        borderTopRightRadius: containerDemenssion,
      };
    }
    if (index === 2) {
      returnStyle = {
        bottom: 0,
        right: 0,
        width: containerDemenssion / 2 - 2,
        height: containerDemenssion / 2 - 2,
        border: "1px solid white",
        borderBottomRightRadius: containerDemenssion,
      };
    }
    return {
      ...returnStyle,
    };
  } else {
    return {
      width: containerDemenssion,
      height: containerDemenssion,
      borderRadius: containerDemenssion,
    };
  }
};

export const saveSearchList = (list, item) => {
  if (!list.find((listItem) => listItem.id === item.id)) {
    list.push(item);
    return _.reverse(_.slice(list, 0, 4));
  } else {
    const filtered = list.filter((listItem) => listItem.id !== item.id);
    filtered.push(item);
    return _.reverse(_.slice(filtered, 0, 4));
  }
};

export const getStatusOfConversation = (participants) => {
  let result = false;
  participants.map((user) => {
    if (user.isOnline && user.username !== getCurrentUser().username) {
      result = true;
    }
  });
  return result;
};

export const getAllCurrentInteractionUser = (currConvList) => {
  let result = [];
  currConvList.map((conv) => {
    conv.participants.map((user) => {
      if (
        !result.find((item) => item.id === user.id) &&
        user.username !== getCurrentUser().username
      ) {
        result.push(user);
      }
    });
  });
  return result;
};
