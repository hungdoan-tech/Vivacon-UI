import { useContext, useState, useEffect } from "react";
import { UpdateProfile } from "App";
import { SOCKET_URL } from "api/constants";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getJwtToken } from "utils/cookie";
import { getCurrentUser } from "utils/jwtToken";
import { getConversations, getListOfConversationId } from "api/chatService";

let stompClient = null;

const useSocket = () => {
  let rooms = [];
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [newConversation, setNewConversation] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [conversationList, setConversationList] = useState({ content: [] });

  const onNewConversation = (payload) => {
    const newConv = JSON.parse(payload.body);
    setNewConversation(newConv);
    stompClient.subscribe(
      `/conversation/${newConv.id}/message`,
      onMessageReceived,
      {
        "WS-Authorization": getJwtToken(),
      }
    );
  };

  const onNewNotification = (payload) => {
    console.log(JSON.parse(payload.body));
  };

  const onMessageReceived = (payload) => {
    setReceivedMessage(JSON.parse(payload.body));
  };

  const onActiveUser = (payload) => {
    setActiveUsers(JSON.parse(payload.body));
  };

  const onConnected = () => {
    stompClient.subscribe(`/topic/account/online`, onActiveUser, {
      "WS-Authorization": getJwtToken(),
    });
    stompClient.subscribe(
      `/user/${getCurrentUser().username}/conversation/new`,
      onNewConversation,
      {
        "WS-Authorization": getJwtToken(),
      }
    );
    stompClient.subscribe(
      `/user/${getCurrentUser().username}/notification`,
      onNewNotification,
      {
        "WS-Authorization": getJwtToken(),
      }
    );
    getListOfConversationId().then((res) => {
      if (res.status === 200) {
        rooms = res.data;
        rooms.forEach((room) => {
          stompClient.subscribe(
            `/conversation/${room}/message`,
            onMessageReceived,
            {
              "WS-Authorization": getJwtToken(),
            }
          );
        });
      }
    });
    // getConversations({
    //   limit: 2,
    //   page: 0,
    //   _sort: "lastModifiedAt",
    //   _order: "desc",
    // }).then((res) => {
    //   setConversationList(res.data);
    // });
  };

  const onError = (err) => {
    console.log({ err });
  };

  const connect = () => {
    const sock = new SockJS(SOCKET_URL);
    stompClient = Stomp.over(sock);
    stompClient.connect(
      { "WS-Authorization": getJwtToken() },
      onConnected,
      onError
    );
  };

  const chatInExistedConversation = (conversationId, content) => {
    stompClient.send(
      "/app/chat",
      { "WS-Authorization": getJwtToken() },
      JSON.stringify({
        conversationId,
        content,
      })
    );
  };

  const chatInVirtualConversation = (usernames, firstMessageContent) => {
    stompClient.send(
      "/app/conversation",
      {
        "WS-Authorization": getJwtToken(),
      },
      JSON.stringify({
        usernames,
        firstMessageContent,
      })
    );
  };

  const typing = (conversationId) => {
    stompClient.send(
      "/app/conversation/typing",
      { "WS-Authorization": getJwtToken() },
      JSON.stringify({
        conversationId,
        isTyping: true,
      })
    );
  };

  const untyping = (conversationId) => {
    stompClient.send(
      "/app/conversation/typing",
      { "WS-Authorization": getJwtToken() },
      JSON.stringify({
        conversationId,
        isTyping: false,
      })
    );
  };

  useEffect(() => {
    connect();
  }, []);

  return {
    states: {
      receivedMessage,
      newConversation,
      activeUsers,
      conversationList,
    },
    setStates: {
      setReceivedMessage,
      setNewConversation,
      setActiveUsers,
      setConversationList,
    },
    handlers: {
      chatInExistedConversation,
      chatInVirtualConversation,
      typing,
      untyping,
    },
  };
};

export default useSocket;
