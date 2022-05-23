import { InputBase, Typography, Badge, Button } from "@mui/material";
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
  checkConversationIsExistOrNot,
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
  getStatusOfConversation,
  getAllCurrentInteractionUser,
} from "utils/resolveData";
import classNames from "classnames";
import InfiniteScrollReverse from "react-infinite-scroll-reverse";
import InfiniteScroll from "react-infinite-scroll-component";
import { chattingType } from "constant/types";
import { useTranslation } from "react-i18next";
import CustomModal from "components/common/CustomModal";
import ChattingSearch from "components/common/ChattingSearch";
import ThreeDotsAnimation from "components/common/ThreeDotsAnimation";
import _ from "lodash";

let stompClient = null;

const ChatPage = () => {
  let rooms = [];
  const [inputMessage, setInputMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [submitMessage, setSubmitMessage] = useState({});
  const [typingMessage, setTypingMessage] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [userChatting, setUserChatting] = useState({
    name: "",
    isOnline: false,
  });
  const [conversationID, setConversationID] = useState(null);
  const [conversationList, setConversationList] = useState({ content: [] });
  const [currentTargetAvatar, setCurrentTargetAvatar] = useState([]);
  const [openChattingSearch, setOpenChattingSearch] = useState(false);
  const [newConversation, setNewConversation] = useState({});
  const [newestVirtualConvId, setNewestVirtualConvId] = useState(0);
  const [typingOnConvList, setTypingOnConvList] = useState([]);

  const { t: trans } = useTranslation();

  const startAudio = () => {
    const notificationAudio = new Audio(require("audio/chat.mp3"));
    notificationAudio.play();
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log({ message });
    switch (message.messageType) {
      case chattingType.USUAL_TEXT: {
        startAudio();
        setSubmitMessage(message);
        break;
      }
      case chattingType.TYPING: {
        setTypingMessage(message);
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    if (typingMessage.conversationId) {
      //Check existed item on typing conversation list
      const foundItem = typingOnConvList.filter(
        (item) => item.conversationId === typingMessage.conversationId
      )[0];

      //If not existed => create new item in typing conversation list
      if (!foundItem) {
        setTypingOnConvList([
          ...typingOnConvList,
          {
            conversationId: typingMessage.conversationId,
            usersTyping: [typingMessage.sender],
          },
        ]);
      }
      //If existed => save overlap
      else {
        const currTypingOnConvList = [...typingOnConvList];
        const index = typingOnConvList.indexOf(foundItem);

        if (typingMessage.content === "true") {
          foundItem.usersTyping.push(typingMessage.sender);
          currTypingOnConvList[index] = foundItem;
        } else {
          const filtered = foundItem.usersTyping.filter(
            (user) => user.username !== typingMessage.sender.username
          );
          currTypingOnConvList[index] = filtered;
        }

        setTypingOnConvList(currTypingOnConvList);
      }
    }
  }, [typingMessage]);

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
    }).then((response) => {
      setConversationID(id);
      setMessageList(response.data.content);
    });
  };

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

  useEffect(() => {
    if (newConversation.id) {
      //If new conversation is chat 1vs1
      if (newConversation.participants.length === 2) {
        const currConversationList = [...conversationList.content];
        let isExistedConv = false;
        let isOnConv = false;

        //Check per item on current conversation list
        currConversationList.map((item, index) => {
          if (item.id === conversationID) {
            isOnConv = true;
          }
          //If found a conversation like new conversation
          if (
            splitUserName(item.participants) ===
            splitUserName(newConversation.participants)
          ) {
            startAudio();
            isExistedConv = true;
            currConversationList[index] = newConversation;
            setConversationList({
              ...conversationList,
              content: currConversationList,
            });
          }
        });

        //If existed conversation
        if (!isExistedConv) {
          setConversationList({
            ...conversationList,
            content: [newConversation, ...currConversationList],
          });
        }
        //If on new conversation now
        if (isOnConv) {
          setConversationID(newConversation.id);
          setMessageList([...messageList, newConversation.latestMessage]);
        }
        setNewConversation({});
      }
    }
  }, [newConversation]);

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
    getConversations({
      limit: 10,
      page: 0,
      _sort: "lastModifiedAt",
      _order: "desc",
    }).then((res) => {
      setConversationList(res.data);
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

  const onClickUserChatting = (conversationId, name, isOnline) => {
    setUserChatting({ name, isOnline });
    getMessageList(conversationId);
    setInputMessage("");
  };

  const sendMessage = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (conversationID === null || inputMessage === "") return;
      // Chat in existed conversation
      if (conversationID >= 0) {
        stompClient.send(
          "/app/chat",
          { "WS-Authorization": getJwtToken() },
          JSON.stringify({
            conversationId: conversationID,
            content: inputMessage,
          })
        );
      }
      //Chat in virtual conversation
      else {
        const participantsOfVirtualConv = conversationList.content.filter(
          (conv) => conv.id === conversationID
        )[0].participants;
        stompClient.send(
          "/app/conversation",
          {
            "WS-Authorization": getJwtToken(),
          },
          JSON.stringify({
            usernames: participantsOfVirtualConv.map((user) => {
              return user.username;
            }),
            firstMessageContent: inputMessage,
          })
        );
      }
      setInputMessage("");
    }
  };

  const handleCloseChattingSearchModal = () => {
    setOpenChattingSearch(false);
  };

  const handleOpenChattingSearchModal = () => {
    const suggestedUsers = getAllCurrentInteractionUser(
      _.slice(conversationList.content, 0, 4)
    );
    localStorage.setItem("suggested_users", JSON.stringify(suggestedUsers));
    setOpenChattingSearch(true);
  };

  const handleCreateNewMessage = (selectedList) => {
    //If length of selected user list = 1 => check existed conversation
    if (selectedList.length === 1) {
      checkConversationIsExistOrNot(selectedList[0].id)
        .then((res) => {
          if (res.status === 200) {
            const { fullName, isOnline } = selectedList[0];
            const { id: conversationId } = res.data;
            setOpenChattingSearch(false);
            onClickUserChatting(conversationId, fullName, isOnline);
          }
        })
        // Create virtual conversation
        .catch(() => {
          const { fullName, isOnline } = selectedList[0];
          setOpenChattingSearch(false);
          const currConvList = [
            {
              id: newestVirtualConvId - 1,
              latestMessage: null,
              participants: [selectedList[0], getCurrentUser()],
            },
            ...conversationList.content,
          ];
          setNewestVirtualConvId(newestVirtualConvId - 1);
          setConversationList({
            ...conversationList,
            content: currConvList,
          });
          setUserChatting({ name: fullName, isOnline });
          setMessageList([]);
          setConversationID(-1);
        });
    }
    // If length of selected user list > 1 => Create virtual conversation
    else {
      console.log({ selectedList });
    }
  };

  const handleTyping = () => {
    stompClient.send(
      "/app/conversation/typing",
      { "WS-Authorization": getJwtToken() },
      JSON.stringify({
        conversationId: conversationID,
        isTyping: true,
      })
    );
  };

  const handleUntyping = () => {
    stompClient.send(
      "/app/conversation/typing",
      { "WS-Authorization": getJwtToken() },
      JSON.stringify({
        conversationId: conversationID,
        isTyping: false,
      })
    );
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (submitMessage.id) {
      let index;
      if (conversationID === submitMessage.conversationId) {
        setMessageList([submitMessage, ...messageList]);
        index = getIndexOfConversation(conversationID);
      } else {
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

    conversationList.content?.map((conv) => {
      if (conv.id === conversationID) {
        setUserChatting({
          name: splitUserName(conv.participants),
          isOnline: getStatusOfConversation(conv.participants),
        });
      }
    });
  }, [conversationID, conversationList]);

  useEffect(() => {
    if (activeUsers.length > 0) {
      const currConvList = [...conversationList.content];
      currConvList.map((conversation) => {
        conversation.participants?.map((user, index) => {
          if (activeUsers.find((activeUser) => activeUser === user.username)) {
            user.isOnline = true;
          } else {
            user.isOnline = false;
          }
        });
      });
      setConversationList({ ...conversationList, content: currConvList });
    }
  }, [activeUsers]);

  const renderUserItem = (conv) => {
    const participants = filterParticipants(conv.participants);
    const userItemClassName = classNames("user-item", {
      active: conv.id === conversationID,
    });
    const isOnline = getStatusOfConversation(conv.participants);
    const usersTypingList = typingOnConvList
      .filter((item) => item.conversationId === conv.id)[0]
      ?.usersTyping.filter(
        (user) => user.username !== getCurrentUser().username
      );
    return (
      <Typography
        component="div"
        className={userItemClassName}
        onClick={() =>
          onClickUserChatting(
            conv.id,
            splitUserName(conv.participants),
            isOnline
          )
        }
      >
        <Typography component="div" className="target-avatar">
          {participants.map((user, index) => {
            return (
              <>
                <img
                  src={user.avatar}
                  style={targetAvatarLayout(participants.length, index, 40)}
                />
                {isOnline && (
                  <Typography className="status-badge online-status"></Typography>
                )}
              </>
            );
          })}
        </Typography>
        <Typography component="div" className="user-name-container">
          <Typography className="username">
            {splitUserName(conv.participants)}
          </Typography>
          <Typography className="latest-action">
            {usersTypingList && usersTypingList.length > 0 ? (
              usersTypingList.length === 1 ? (
                <>
                  {usersTypingList[0].fullName}: <ThreeDotsAnimation />
                </>
              ) : (
                <>
                  {usersTypingList?.length} people: <ThreeDotsAnimation />
                </>
              )
            ) : (
              conv.latestMessage &&
              `${resolveName(conv.latestMessage?.sender.fullName, "fullName")}:
            ${conv.latestMessage?.content}`
            )}
          </Typography>
        </Typography>
      </Typography>
    );
  };

  const renderMessageList = (messageList) => {
    const usersTypingList = typingOnConvList
      .filter((item) => item.conversationId === conversationID)[0]
      ?.usersTyping.filter(
        (user) => user.username !== getCurrentUser().username
      );

    const renderTypingContainer = () => {
      const restLength = usersTypingList.length - 3;
      return (
        <>
          <Typography
            component="div"
            align="left"
            className="user-list-typing-avatar"
          >
            {_.slice(usersTypingList, 0, 3).map((userTyping) => {
              return (
                <img src={userTyping.avatar} className="user-typing-avatar" />
              );
            })}
            {restLength > 0 && <ThreeDotsAnimation animation={false} />}
          </Typography>
          <Typography component="div" align="left" className="typing-container">
            <ThreeDotsAnimation className="typing-dots" />
            <Typography className="typing-text">
              {_.slice(usersTypingList, 0, 3)
                .map((user) => user.fullName)
                .join(", ")}
              {restLength > 0
                ? ` and ${restLength} other people are typing...`
                : restLength > -2
                ? " are typing"
                : " is typing..."}
            </Typography>
          </Typography>
        </>
      );
    };
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
        {usersTypingList && usersTypingList.length > 0 && (
          <Typography>
            <Typography component="div" align="left" className="latest-action">
              {renderTypingContainer()}
            </Typography>
          </Typography>
        )}
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
    <>
      <Typography component="div" className="chat-container">
        <Typography component="div" className="list-user-container">
          <Typography component="div" className="header">
            <Typography component="div" className="search-btn">
              <SearchIcon className="icon" />
            </Typography>
            <Typography
              component="div"
              className="new-chatting-btn"
              onClick={handleOpenChattingSearchModal}
            >
              <DriveFileRenameOutlineIcon className="icon" />
            </Typography>
          </Typography>
          {conversationList.content?.length > 0 &&
            conversationList.content?.map((room) => {
              return renderUserItem(room);
            })}
        </Typography>
        {conversationID ? (
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
                  {userChatting.isOnline && (
                    <Typography className="status-badge online-status"></Typography>
                  )}
                </Typography>
                <Typography component="div" className="user-name-container">
                  <Typography className="username">
                    {userChatting.name}
                  </Typography>
                  {userChatting.isOnline && (
                    <Typography className="active">
                      {trans("chatting.active")}
                    </Typography>
                  )}
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
                  onFocus={handleTyping}
                  onBlur={handleUntyping}
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
        ) : (
          <Typography component="div" className="initial-chat-container">
            <img src={require("images/chat.png")} width="100" height="100" />
            <Typography className="your-messages">
              {trans("chatting.yourMessages")}
            </Typography>
            <Typography className="let-send-messages">
              {trans("chatting.letSend")}
            </Typography>
            <Button
              className="send-message-btn"
              onClick={handleOpenChattingSearchModal}
            >
              {trans("chatting.sendMessage")}
            </Button>
          </Typography>
        )}
      </Typography>
      <CustomModal
        isRadius
        width={400}
        height={400}
        open={openChattingSearch}
        handleCloseModal={handleCloseChattingSearchModal}
      >
        <ChattingSearch handleNext={handleCreateNewMessage} />
      </CustomModal>
    </>
  );
};

export default ChatPage;
