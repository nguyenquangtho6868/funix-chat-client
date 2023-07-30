import React, { useState, useEffect, useRef, useContext } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { List, ListItem, Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Button from "@mui/material/Button";
import { AuthContext } from "../../Context/AuthLogin";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import "./chatRoom.css";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRoomChat,
  endRoomChat,
  getRoomChatWithId,
  getRoomCheckUserId,
} from "../../Services/RoomChatService";
import { API_URL } from "../../Constants/ApiConstant";
import { uploadFile } from "../../uploadfile/uploadfile";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ModalZoomImage from "../../shares/ModalZoomImage";
import Avatar from "@mui/material/Avatar";
import io from "socket.io-client";
import { Howl } from "howler";
import { postRate } from "../../Services/RoomChatService";
import { format } from 'date-fns';
const socket = io(API_URL);

function ChatRoomComponent() {
  const list = useRef(null);
  const { role } = useContext(AuthContext);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [isBottom, setIsBottom] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [isMentorIn, setIsMentorIn] = useState(false);
  const [openModalZoom, setOpenModalZoom] = useState(false);
  const [valueMessage, setValueMessage] = useState("");
  const [srcImage, setSrcImage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [rate, setRate] = useState(false);
  const [valueRate, setValueRate] = useState(null);
  const mentor =
    conversations.find((c) => c.sender.role === "MENTOR") === undefined
      ? false
      : true;

  const endConversation = () => {
    // Lấy thông tin phòng để kiểm tra xem đã có mentor vào phòng hay chưa rồi chia 2 trường hợp kết thúc
    let end_date = format(new Date(), 'dd/MM/yyyy HH:mm');
    getRoomChatWithId((rs) => {
      if (rs.statusCode === 200) {
        const mentor = rs.data.users.filter((item) => item !== userId)[0];
        if (mentor) {
          endRoomChat((rs) => {
            if (rs.statusCode === 200) {
              localStorage.setItem("seconds", 0);
              localStorage.setItem("minutes", 0);
              socket.emit("end-conversation", mentor);
              if(role === 'STUDENT') {
                setRate(true);
              } else {
                navigate("/home");
                toast.success("Buổi trao đổi kết thúc!");
              }
            } else {
              toast.error("Có lỗi trong quá trình xử lý!");
            }
          }, {end_date, roomId, status: 'Closed'});
        } else {
          endRoomChat((rs) => {
            if (rs.statusCode === 200) {
              navigate("/home");
              toast.success("Buổi trao đổi kết thúc!");
              localStorage.setItem("seconds", 0);
              localStorage.setItem("minutes", 0);
            } else {
              toast.error("Có lỗi trong quá trình xử lý!");
            }
          }, {end_date, roomId, status: 'Cancelled'});
        }
      } else {
        toast.error("Có lỗi trong quá trình xử lý!");
        return;
      }
    }, roomId);
  };

  const handleSendMessage = () => {
    let data = {
      sender: userId,
      content: {
        value: valueMessage,
        is_file: false,
      },
      room_id: roomId,
      prev_message: conversations[conversations.length - 1],
    };
    socket.emit("send-message", data);
    setValueMessage("");
    const sound = new Howl({
      src: [require("../../assets/sounds/send.mp3")], // Đường dẫn đến file âm thanh
    });
    sound.play();
  };

  const sendMessage = () => {
    if (valueMessage !== "") {
      handleSendMessage(valueMessage);
    }
  };

  const sendMessageEnter = (e) => {
    if (valueMessage !== "" && e.key === "Enter") {
      handleSendMessage(valueMessage);
    }
  };

  const handleScrollListChat = (e) => {
    let rollDistance =
      e.currentTarget.scrollHeight -
      e.currentTarget.offsetHeight -
      e.currentTarget.scrollTop;
    if (rollDistance > 500) {
      setIsBottom(true);
    }
    if (rollDistance === 0) {
      setIsBottom(false);
    }
  };

  const onBottom = () => {
    list.current.scrollTo({
      top: list.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const getMinutes = Number(localStorage.getItem("minutes"));
    const getSeconds = Number(localStorage.getItem("seconds"));
    if (minutes < getMinutes) setMinutes(getMinutes);
    if (seconds < getSeconds) setSeconds(getSeconds);
    const countdown = setInterval(() => {
      if (mentor) {
        if (seconds === 59) {
          setMinutes((prev) => {
            localStorage.setItem("minutes", prev + 1);
            return prev + 1;
          });
          setSeconds(-1);
        }

        if (seconds >= 0) {
          setSeconds((prev) => {
            localStorage.setItem("seconds", prev + 1);
            return prev + 1;
          });
        }
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [minutes, seconds, mentor]);

  useEffect(() => {
    getRoomCheckUserId((res) => {
      if (!res.data) {
        toast.error("Bạn không có quyền truy cập!");
        navigate("/home");
      } else {
        getRoomChat((rs) => {
          if (rs.statusCode === 200) {
            console.log(rs.data);
            setConversations(rs.data);
          } else {
            toast.error(rs.message);
            navigate("/home");
          }
        }, roomId);
      }
    }, userId);
  }, []);

  useEffect(() => {
    socket.on("create-new-message", (data) => {
      setConversations((prev) => [...prev, ...data]);
      if (data[0].sender._id !== userId) {
        const sound = new Howl({
          src: [require("../../assets/sounds/recive.mp3")], // Đường dẫn đến file âm thanh
        });
        sound.play();
      }
    });

    socket.on("update-message", (data) => {
      setConversations((prev) => [...prev.slice(0, prev.length - 1), ...data]);
    });

    socket.on(`mentor-in-room-chat/${roomId}`, (data) => {
      setIsMentorIn(true);
    });

    socket.on(`end-conversation-success/${userId}`, () => {
      if(role === 'STUDENT') {
        setRate(true);
      } else {
        navigate("/home");
        toast.success("Buổi trao đổi kết thúc!");
      }
    });

    socket.on(`exit-room-cause-no-mentor/${userId}`, () => {
      navigate("/home");
      toast.warning("Rất xin lỗi vì hiện các Mentor đang bận!");
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    list.current.scrollTo({
      top: list.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversations]);

  useEffect(() => {
    if (valueMessage === "") {
      setIsSend(false);
    } else {
      setIsSend(true);
    }
  }, [valueMessage]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleSendFile = (file) => {
    console.log(file);
    let data = {
      sender: userId,
      content: {
        value: file,
        is_file: true,
      },
      room_id: roomId,
      prev_message: conversations[conversations.length - 1],
    };
    socket.emit("send-message", data);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const file = await uploadFile(droppedFiles[0]);
    if (file) handleSendFile(file);
  };

  const handleGetFile = async (event) => {
    const file = await uploadFile(event.target.files[0]);
    if (file) handleSendFile(file);
  };
  const hanldeBlock = () => {
    localStorage.removeItem("seconds");
    localStorage.removeItem("minutes");
    setMinutes(0);
    setSeconds(0);
  };
  const openModalZoomImage = (src) => {
    setOpenModalZoom(true);
    setSrcImage(src);
  };

  const closeModalZoom = () => {
    setOpenModalZoom(false);
  };
  const handleRate = () => {
    postRate((res) => {
      if (res.statusCode === 200) {
        toast.success("Kết thúc cuộc trò chuyện!", { className: "toast-message" });
        navigate("/home");
      } else {
        if (res.message) {
          toast.error(res.message, { className: "toast-message" });
        } else {
          toast.error("Có lỗi trong quá trình xử lý!", {
            className: "toast-message",
          });
        }
      }
    }, {roomId, rate: valueRate});
  };

  if (minutes >= 1 && seconds > 10) {
    endConversation();
  }
  return (
    <Grid container className="layout-children-grid">
      <Grid item xs={12} className="layout-children-right chat-room">
        <Grid className="chat-right-title text-around-flex">
          <Grid>
            <span>{formatTime(minutes)}:</span>
            <span>{formatTime(seconds)}</span>
            {minutes >= 1 && seconds < 10 && !rate && (
              <div>
                <Dialog open={minutes >= 1}>
                  <DialogTitle>Block</DialogTitle>
                  <DialogContent>
                    <p>Bạn có muốn tiếp tục Block</p>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={hanldeBlock}
                    >
                      Tiếp Tục
                    </Button>
                    <Button onClick={endConversation}>Kết Thúc</Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
            {
              <div>
                <Dialog open={rate} size="large">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="10vh"
                  >
                    <DialogContent padding={5}>
                      <Rating
                        name="simple-controlled"
                        size="large"
                        onChange={(event, newValue) => {
                          setValueRate(newValue);
                        }}
                      />
                    </DialogContent>
                    <DialogContent>
                      <Button variant="outlined" onClick={handleRate}>
                        Đánh Giá
                      </Button>
                    </DialogContent>
                  </Box>
                </Dialog>
              </div>
            }
          </Grid>
          <Typography m={0} align="center" variant="p" gutterBottom>
            phòng trao đổi
          </Typography>
          <Button
            className="ipad-pc "
            variant="contained"
            color="error"
            onClick={endConversation}
          >
            END
          </Button>
        </Grid>
        <Grid
          className="layout-children-right-content chat-right"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <List
            className="layout-children-list-mentor chat-content"
            ref={list}
            onScroll={handleScrollListChat}
          >
            {conversations.length > 0 &&
              conversations.map((obj, key) => {
                return (
                  <Grid key={key}>
                    <ListItem
                      className={obj.sender._id === userId ? "justify-end" : ""}
                    >
                      <Grid>
                        <Grid
                          className={
                            obj.sender._id === userId ? "text-end-justify" : ""
                          }
                        >
                          <Avatar
                            className={
                              obj.sender.role === "MENTOR" ||
                              obj.sender.role === "ADMIN"
                                ? "display-none"
                                : ""
                            }
                            sx={{ height: "24px", width: "24px" }}
                            src={require("../../assets/img/logo-funix.png")}
                          />
                          <Avatar
                            className={
                              obj.sender.role === "STUDENT"
                                ? "display-none"
                                : ""
                            }
                            sx={{ height: "24px", width: "24px" }}
                            src={require("../../assets/img/mentor.png")}
                          />
                        </Grid>
                        <List>
                          {obj.content.length > 0 &&
                            obj.content.map((item, i) => {
                              return (
                                <ListItem
                                  key={i}
                                  className={
                                    obj.sender._id === userId
                                      ? "messages-item justify-end"
                                      : "messages-item"
                                  }
                                >
                                  <Box
                                    className={
                                      item.is_file ? "display-none" : ""
                                    }
                                  >
                                    <Typography
                                      className={
                                        obj.sender._id === userId
                                          ? "messages-item-text middle-message messages-item-text-sender"
                                          : "messages-item-text middle-message messages-item-text-receiver"
                                      }
                                      // className={key === 0 && obj.message.length > 2 ?
                                      //     'messages-item-text first-message' :
                                      //     `${key === obj.message.length - 1 && obj.message.length > 2 ?
                                      //         'messages-item-text last-message' : 'messages-item-text middle-message'}`}
                                      ml={1}
                                      variant="body1"
                                      gutterBottom
                                    >
                                      {item.value}
                                    </Typography>
                                  </Box>
                                  <Box
                                    className={
                                      !item.is_file ? "display-none" : ""
                                    }
                                    onClick={() =>
                                      openModalZoomImage(item.value)
                                    }
                                  >
                                    <img
                                      style={{
                                        width: "25rem",
                                        borderRadius: "1.5rem",
                                        cursor: "pointer",
                                      }}
                                      src={item.value}
                                      alt=""
                                    />
                                  </Box>
                                </ListItem>
                              );
                            })}
                        </List>
                      </Grid>
                    </ListItem>
                    <Grid
                      className={
                        conversations.length - 1 === key
                          ? "text-center-justify chat-time-distance display-none"
                          : "text-center-justify chat-time-distance"
                      }
                    >
                      {obj.createdAtTime}
                    </Grid>
                  </Grid>
                );
              })}
          </List>
          <Grid
            className={isBottom ? "display-block" : "display-none"}
            onClick={onBottom}
          >
            <Grid className="button-on-bottom-chat">
              <ArrowDownwardIcon />
            </Grid>
          </Grid>
        </Grid>
        <Grid className="message-input">
          <Grid container className="message-input-content">
            <Grid
              item
              className="message-input-tag"
              xs={9}
              sm={9}
              md={10}
              lg={11}
              pr={1}
            >
              <input
                value={valueMessage}
                onChange={(e) => setValueMessage(e.target.value)}
                className="message-input-value"
                placeholder="Nhập thông tin..."
                onKeyUp={(e) => sendMessageEnter(e)}
              ></input>
            </Grid>

            <Grid
              item
              xs={3}
              sm={3}
              md={2}
              lg={1}
              className="message-input-send"
            >
              <Grid className={isSend ? "is-typing" : "not-typing"}>
                <TelegramIcon
                  className="message-input-send-icon"
                  onClick={sendMessage}
                />
              </Grid>
              <Button
                className={isSend ? "display-none" : ""}
                component="label"
              >
                <input type="file" hidden onChange={(e) => handleGetFile(e)} />
                <ImageIcon className="message-input-send-icon" />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {openModalZoom && (
        <ModalZoomImage
          srcImage={srcImage}
          open={openModalZoom}
          handleCloseModal={closeModalZoom}
        />
      )}
    </Grid>
  );
}

export default ChatRoomComponent;
