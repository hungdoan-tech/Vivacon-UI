import { InputBase, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import "./style.scss";
import {
  getConversationByUsername,
  getConversations,
  getListOfConversationId,
  getMessagesByConversationId,
} from "api/chatService";
import { getJwtToken } from "utils/cookie";
import { getCurrentUser } from "utils/jwtToken";
import { SOCKET_URL } from "api/constants";
import {
  resolveName,
  resolveUserName,
  splitUserName,
  filterParticipants,
  targetAvatarLayout,
} from "utils/resolveData";
import classNames from "classnames";
import InfiniteScrollReverse from "react-infinite-scroll-reverse";
import InfiniteScroll from "react-infinite-scroll-component";
import { chattingType } from "constant/types";

let stompClient = null;

const ChatPage = () => {
  let rooms = [];
  const [inputMessage, setInputMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [submitMessage, setSubmitMessage] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [userChatting, setUserChatting] = useState("");
  const [conversationID, setConversationID] = useState(null);
  const [conversationList, setConversationList] = useState({});
  const [currentTargetAvatar, setCurrentTargetAvatar] = useState([]);

  const onMessageReceived = (payload) => {
    console.log({ recieved: JSON.parse(payload.body) });
    setSubmitMessage(JSON.parse(payload.body));
  };

  const getIndexOfConversation = (id) => {
    if (conversationList.content) {
      const currConvList = [...conversationList?.content];
      let index;
      currConvList.map((conv, i) => {
        if (conv.id === id) {
          index = i;
        }
      });
      return index;
    }
  };

  const getMessageList = (id) => {
    getMessagesByConversationId({
      id,
      _sort: "timestamp",
      _order: "desc",
    }).then((response) => {
      console.log({ response });
      setConversationID(id);
      setMessageList(response.data.content);
    });
  };

  const onConversation = (payload) => {
    const data = JSON.parse(payload.body);
    setConversationID(data.id);
    stompClient.subscribe(
      `/conversation/${data.id}/message`,
      onMessageReceived,
      {
        "WS-Authorization": getJwtToken(),
      }
    );
  };

  const onActiveUser = (payload) => {
    console.log({ payload });
    setActiveUsers(JSON.parse(payload.body));
  };

  const onConnected = () => {
    stompClient.subscribe(`/topic/account/online`, onActiveUser, {
      "WS-Authorization": getJwtToken(),
    });
    stompClient.subscribe(
      `/user/${getCurrentUser().username}/conversation/new`,
      onConversation,
      {
        "WS-Authorization": getJwtToken(),
      }
    );
    getListOfConversationId().then((res) => {
      if (res.status === 200) {
        console.log("ids: ", { res });
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
    getConversations({
      limit: 10,
      page: 0,
      _sort: "lastModifiedAt",
      _order: "desc",
    }).then((res) => {
      setConversationList(res.data);
      setUserChatting(splitUserName(res.data.content[0].participants));
      setConversationID(res.data.content[0].id);
      getMessageList(res.data.content[0].id);
    });
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

  const changeMessage = (e) => {
    setInputMessage(e.target.value);
  };

  // const onCreateNewChatting = (username) => {
  //   setUserChatting(username);
  //   getConversationByUsername({ username })
  //     .then((res) => {
  //       setConversationID(res.data.id);
  //       getMessagesByConversationId({ id: res.data.content[0].id }).then(
  //         (response) => {}
  //       );
  //     })
  //     .catch((error) => {
  //       if (error.response.status === 404) {
  //         stompClient.send(
  //           "/app/conversation",
  //           { "WS-Authorization": getJwtToken() },
  //           JSON.stringify({ usernames: [username] })
  //         );
  //       }
  //     });
  // };

  const onClickUserChatting = (id, username) => {
    setUserChatting(username);
    getMessageList(id);
  };

  const sendMessage = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log({ conversationID });
      if (conversationID === null || inputMessage === "") return;
      stompClient.send(
        "/app/chat",
        { "WS-Authorization": getJwtToken() },
        JSON.stringify({
          conversationId: conversationID,
          content: inputMessage,
        })
      );
      setInputMessage("");
    }
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (submitMessage.id) {
      let index
      if (conversationID === submitMessage.conversationId) {
        setMessageList([submitMessage, ...messageList]);
        index = getIndexOfConversation(conversationID);
      }
      else {
        index = getIndexOfConversation(submitMessage.conversationId);
      }
      setSubmitMessage({});
      //Save current conversation list and current index
      const currConvList = [...conversationList?.content];

      //Declare target
      const target = currConvList[index];
      target.latestMessage = { ...submitMessage };

      //Update list
      const filtered = currConvList.filter(
        (item) => item.id !== submitMessage.conversationId
      );
      const result = [target, ...filtered];

      setConversationList({ ...conversationList, content: result });
    }
  }, [submitMessage]);

  useEffect(() => {
    if (conversationID && conversationList.content) {
      const index = getIndexOfConversation(conversationID);
      const filtered = filterParticipants(
        conversationList.content[index]?.participants
      );
      setCurrentTargetAvatar(filtered);
    }
  }, [conversationID]);

  const renderUserItem = (conv) => {
    const participants = filterParticipants(conv.participants);
    const userItemClassName = classNames("user-item", {
      active: conv.id === conversationID,
    });
    return (
      <Typography
        component="div"
        className={userItemClassName}
        onClick={() =>
          onClickUserChatting(conv.id, splitUserName(conv.participants))
        }
      >
        <Typography component="div" className="target-avatar">
          {participants.map((user, index) => {
            return (
              <img
                src={user.avatar}
                style={targetAvatarLayout(participants.length, index, 40)}
              />
            );
          })}
        </Typography>
        <Typography component="div" className="user-name-container">
          <Typography className="username">
            {splitUserName(conv.participants)}
          </Typography>
          <Typography className="active">
            {conv.latestMessage &&
              `${resolveName(conv.latestMessage?.sender.fullName, "fullName")}:
            ${conv.latestMessage?.content}`}
          </Typography>
        </Typography>
      </Typography>
    );
  };

  const renderMessageList = (messageList) => {
    console.log({ messageList });
    return (
      <InfiniteScroll
        dataLength={100}
        hasMore={true}
        isLoading={true}
        loadMore={() => null}
        loadArea={30}
        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        inverse={true}
        scrollableTarget="scrollableDiv"
        scrollThreshold={"555px"}
        initialScrollY={0}
      >
        {messageList.map((message, index) => {
          const condition =
            message.sender.username === getCurrentUser().username;
          const messageClassName = classNames("message-item", {
            owner: condition,
            target: !condition,
          });

          const messageContainerClassName = classNames(
            "message-item-container",
            {
              owner: condition,
              target: !condition,
            }
          );
          const showAvatar =
            message.sender.username !== messageList[index - 1]?.sender.username;

          return (
            <Typography component="div" className={messageContainerClassName}>
              {!condition && (
                <Typography className="sender-avatar">
                  {showAvatar && <img src={message.sender.avatar} />}
                </Typography>
              )}
              <Typography
                className={messageClassName}
                align={condition ? "right" : "left"}
                component="div"
              >
                {message.content}
              </Typography>
            </Typography>
          );
        })}
      </InfiniteScroll>
    );
  };

  return (
    <Typography component="div" className="chat-container">
      <Typography component="div" className="list-user-container">
        <Typography component="div" className="header">
          <Typography component="div" className="search-btn">
            <SearchIcon className="icon" />
          </Typography>
          <Typography component="div" className="new-btn">
            <DriveFileRenameOutlineIcon className="icon" />
          </Typography>
        </Typography>
        {conversationList.content?.length > 0 &&
          conversationList.content?.map((room) => {
            return renderUserItem(room);
          })}
      </Typography>

      <Typography component="div" className="chat-with-user-container">
        <Typography component="div" className="header">
          <Typography component="div" className="user-item">
            <Typography component="div" className="target-avatar">
              {currentTargetAvatar.map((user, index) => {
                return (
                  <img
                    src={user.avatar}
                    style={targetAvatarLayout(
                      currentTargetAvatar.length,
                      index,
                      40
                    )}
                  />
                );
              })}
            </Typography>
            <Typography component="div" className="user-name-container">
              <Typography className="username">{userChatting}</Typography>
              <Typography className="active">Active today</Typography>
            </Typography>
          </Typography>
          <Typography component="div" className="action-btn">
            <InfoOutlinedIcon className="icon" />
          </Typography>
        </Typography>

        <Typography component="div" className="chat-content">
          {renderMessageList(messageList)}
        </Typography>

        <Typography component="div" className="chat-input-container">
          <Typography component="div" className="emoji">
            <SentimentSatisfiedAltOutlinedIcon className="icon" />
          </Typography>
          <Typography component="div" className="chat-input">
            <InputBase
              placeholder={"Message..."}
              fullWidth={true}
              maxRows={3}
              multiline={true}
              onChange={changeMessage}
              value={inputMessage}
              onKeyDown={sendMessage}
            />{" "}
          </Typography>
          <Typography component="div" className="send-images">
            <ImageOutlinedIcon className="icon" />
          </Typography>
          <Typography component="div" className="like-icon">
            <FavoriteBorderOutlinedIcon className="icon" />
          </Typography>
        </Typography>
      </Typography>
    </Typography>
  );
};

export default ChatPage;
