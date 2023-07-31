import React, { useState, useEffect, useRef, useContext } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { List, ListItem, Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Button from "@mui/material/Button";
import { AuthContext } from "../../Context/AuthLogin";
import TelegramIcon from "@mui/icons-material/Telegram";
import "../chatRoom/chatRoom.css";
import { useNavigate, useParams } from "react-router-dom";
import { getMessagesHistoryWithIdRoomChat } from "../../Services/RoomChatService";
import ModalZoomImage from "../../shares/ModalZoomImage";
import Avatar from "@mui/material/Avatar";

function ViewChatHistoryComponent() {
  const list = useRef(null);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { role } = useContext(AuthContext);
  const [srcImage, setSrcImage] = useState([]);
  const userId = localStorage.getItem("userId");
  const [conversations, setConversations] = useState([]);
  const [openModalZoom, setOpenModalZoom] = useState(false);

  const openModalZoomImage = (src) => {
    setSrcImage(src);
    setOpenModalZoom(true);
  };

  const closeModalZoom = () => {
    setOpenModalZoom(false);
  };

  const backHistory = () => {
    navigate('/home/history');
  }

  useEffect(() => {
    getMessagesHistoryWithIdRoomChat((res) => {
        setConversations(res.data);
    }, roomId)
  },[])

  return (
    <Grid container className="layout-children-grid">
      <Grid item xs={12} className="layout-children-right chat-room">
        <Grid className="chat-right-title text-around-flex">
            <Button onClick={backHistory}>Back</Button>
          <Typography m={0} align="center" variant="p" gutterBottom>
            Lịch Sử Trò Chuyện
          </Typography>
          <Grid></Grid>
        </Grid>
        <Grid
          className="layout-children-right-content chat-right"
        >
          <List
            className="layout-children-list-mentor chat-content"
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
                  </Grid>
                );
              })}
          </List>
        </Grid>
        <Grid className="message-input">
          <Grid container className="message-input-content">
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

export default ViewChatHistoryComponent;
