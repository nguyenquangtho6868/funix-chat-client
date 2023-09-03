import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import "./layout.css";
import { getCourseDetail } from "../../Services/CourseService";
import { Box, List, ListItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate, useParams } from "react-router-dom";
import { getlistNotification } from "../../Services/NotificationService";
import { toast } from "react-toastify";
import { API_URL } from "../../Constants/ApiConstant";
import io from "socket.io-client";
import { Howl } from "howler";

const socket = io(API_URL);

function LayoutMentorChildComponent() {
  const list = useRef(null);
  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [courseDetail, setCourseDetail] = useState([]);

  const backView = () => {
    navigate("/home");
  };

  const supportNow = (obj) => {
    let data = {
      notification_id: obj._id,
      roomId: obj.room,
      mentor_id: userId,
    };
    socket.emit("mentor-support-now", data);
    socket.emit("request-delete-notification", obj._id);
  };

  useEffect(() => {
    getlistNotification((rs) => {
      setNotifications(rs.data);
    }, id);
    getCourseDetail(
      (rs) => {
        setCourseDetail(...rs.data);
      },
      { course_id: id, userId }
    );
  }, [id]);

  useEffect(() => {
    socket.on(`quantity-room-chat-full/${userId}`, () => {
      toast.warning("Phòng này đã có Mentor hỗ trợ!");
    });

    socket.on(`join-room-chat-success/${userId}`, (data) => {
      navigate(`/chat-room/${data.roomId}`);
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
    socket.on("delete-notification", (id) => {
      setNotifications((prev) => prev.filter((obj) => obj._id !== id));
    });
  }, [notifications]);

  return (
    <Grid className="layout-children">
      <Grid className="layout-mentor-child">
        <Grid className="layout-mentor-child-header text-center-align" pl={2}>
          <Grid className="layout-nav-list-item mobile">
            <IconButton className="layout-mentor-btn-back" onClick={backView}>
              <ArrowBackIosIcon></ArrowBackIosIcon>
            </IconButton>
          </Grid>
          <Grid container className="group-chat-mobile">
            <Grid item xs={2} sm={1} className="text-center-align">
              <Avatar
                alt="Remy Sharp"
                src={require("../../assets/img/logo-funix.png")}
              />
            </Grid>
            <Grid item xs={6} className="group-chat-mobile-text">
              <Grid>
                <Typography
                  variant="p"
                  gutterBottom
                  noWrap={true}
                  className="layout-children-content-item-title group-chat-content-title  group-chat-content-title-top"
                >
                  {courseDetail.code}
                </Typography>
              </Grid>
              <Grid>
                <Typography
                  align="center"
                  variant="h6"
                  noWrap={true}
                  gutterBottom
                  className="layout-children-content-item-title group-chat-content-title text-center-align"
                >
                  {/* <PermIdentityIcon className='group-chat-content-icon-member' /> 4 Mentors */}
                  {courseDetail.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid className="layout-mentor-child-content ">
          <List
            className="layout-children-list-mentor list-notification"
            ref={list}
          >
            {notifications.length > 0 ? (
              notifications.map((obj, key) => {
                return (
                  <ListItem key={key}>
                    <Grid className="student-question">
                      <Typography ml={1} variant="p" gutterBottom>
                        {obj.name_student}
                      </Typography>
                      <Grid>
                        <Typography
                          variant="body1"
                          gutterBottom
                          className="text-question"
                        >
                          <Typography variant="p">Câu hỏi :</Typography>{" "}
                          {obj.question}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography
                          variant="body1"
                          gutterBottom
                          className="text-question"
                        >
                          <Typography variant="p">Mô tả :</Typography>{" "}
                          {obj.description}
                        </Typography>
                      </Grid>
                      <Grid className="text-center">
                        <Button
                          onClick={() => supportNow(obj)}
                          className="btn-support-student"
                          color="secondary"
                        >
                          Hỗ Trợ Ngay
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })
            ) : (
              <ListItem>
                <Box
                  display="flex"
                  justifyContent="center"
                  className="student-question"
                >
                  <Typography ml={1} variant="p" gutterBottom>
                    Hiện chưa có học viên cần hỗ trợ
                  </Typography>
                </Box>
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LayoutMentorChildComponent;
