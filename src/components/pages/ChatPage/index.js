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
  getMessagesByConversationId,
} from "api/chatService";
import { getJwtToken } from "utils/cookie";
import { getCurrentUser } from "utils/jwtToken";
import { SOCKET_URL } from "api/constants";

let stompClient = null;

const ChatPage = () => {
  let rooms = [];
  const [inputMessage, setInputMessage] = useState("");
  const [message, setMessage] = useState([]);
  const [listSupporter, setListSupporter] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userChatting, setUserChatting] = useState("");
  const [conversationID, setConversationID] = useState(null);

  const onMessageReceived = (payload) => {};

  const onConversation = (payload) => {
    const data = JSON.parse(payload.body);
    setConversationID(data.id);
    stompClient.subscribe(
      `/conversations/${data.id}/queue/messages`,
      onMessageReceived,
      {
        "X-Authorization": getJwtToken(),
      }
    );
  };

  const onActiveUser = (payload) => {
    setActiveUsers(JSON.parse(payload.body));
  };

  const onConnected = () => {
    stompClient.subscribe(`/topic/active`, onActiveUser, {
      "X-Authorization": getJwtToken(),
    });
    stompClient.subscribe(
      `/user/${getCurrentUser().username}/new/conversation`,
      onConversation,
      {
        "X-Authorization": getJwtToken(),
      }
    );
    getConversations().then((res) => {
      rooms = res.data;
      rooms.forEach((room) => {
        stompClient.subscribe(
          `/conversations/${room.id}/queue/messages`,
          onMessageReceived,
          {
            "X-Authorization": getJwtToken(),
          }
        );
      });
    });
  };

  const onError = (err) => {
    console.log(
      {err}
    )
  };

  const connect = () => {
    console.log({jwt:  getJwtToken()})
    const token = getJwtToken();

    const sock = new SockJS(SOCKET_URL);
    stompClient = Stomp.over(sock);
    stompClient.connect(
      { "X-Authorization": ` ${token}` },
      onConnected,
      onError
    );
    console.log({sock, stompClient})
  };

  const changeMessage = (e) => {
    setInputMessage(e.target.value);
  };

  const onClickUserChatting = (username) => {
    setUserChatting(username);
    getConversationByUsername({ username })
      .then((res) => {
        setConversationID(res.data.id);
        getMessagesByConversationId({ id: res.data.id }).then((response) => {});
      })
      .catch((error) => {
        if (error.response.status === 404) {
          stompClient.send(
            "/app/conversations",
            { "X-Authorization": getJwtToken() },
            JSON.stringify({ usernames: [username] })
          );
        }
      });
  };

  const sendMessage = () => {
    if (conversationID === null) return;
    stompClient.send(
      "/app/chat",
      { "X-Authorization": getJwtToken() },
      JSON.stringify({ conversationId: conversationID, content: inputMessage })
    );
    setInputMessage("");
  };

  useEffect(() => {
    connect();
  }, []);

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

        <Typography component="div" className="user-item">
          <img src={require("images/avatar.png")} />
          <Typography component="div" className="user-name-container">
            <Typography className="username">Queen Elizabeth</Typography>
            <Typography className="active">Active today</Typography>
          </Typography>
        </Typography>
      </Typography>

      <Typography component="div" className="chat-with-user-container">
        <Typography component="div" className="header">
          <Typography component="div" className="user-item">
            <img src={require("images/avatar.png")} />
            <Typography component="div" className="user-name-container">
              <Typography className="username">Queen Elizabeth</Typography>
              <Typography className="active">Active today</Typography>
            </Typography>
          </Typography>
          <Typography component="div" className="action-btn">
            <InfoOutlinedIcon className="icon" />
          </Typography>
        </Typography>

        <Typography component="div" className="chat-content"></Typography>

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
              // onChange={handleCaptionChange}
              // value={commentContent}
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
